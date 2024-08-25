const mongoose = require("mongoose");
const uri = process.env.DB_URL;
const User = require("../model/user");
const Plan = require('../model/plan');
const Test = require('../model/test');
const { Algo, Topic } = require("../model/algorithm");
const Order = require("../model/order");
const Report = require("../model/report");
const { Question, Answer } = require("../model/question");

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function connectDB() {
  await mongoose.connect(uri, clientOptions);
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

//user related db calls (USED)
async function getUser(uid) {
  return User.findOne({ uid: uid }).populate({
    path: "plans.plan",
    model: "Plan",
  }).exec();
}

async function addPhone(decodedToken, phoneNumber) {

  const updatedUser = await User.findOneAndUpdate({ uid: decodedToken.uid }, { phone: phoneNumber }, { new: true }).exec();
  return updatedUser;

}

async function signup(decodedToken) {

  const newUser = await User.create({
    uid: decodedToken.uid,
    name: decodedToken.name,
    email: decodedToken.email,
    picture: decodedToken.picture,
    phone: decodedToken.phone,
  });
  return newUser;

}

//order and plan related db calls (NEVER USED)
async function listPlans(planID) {

  return await Plan.find().populate('test', '-sections.questions -sections._id');

}

async function findPlan(planID) {

  return await Plan.findOne({ _id: planID }).exec();

}

async function createOrder(planID, userID) {

  return await Order.create({
    plan: planID,
    user: userID,
  });

}

async function completeOrder(transactionID, transactionData) {

  return await Order.updateOne(
    { _id: transactionID },
    { status: "Completed", paymentCallbackData: transactionData }
  );

}

async function addPlan(userID, newPlanObj) {

  return await User.updateOne(
    {
      uid: userID,
    },
    {
      $push: { plans: newPlanObj },
    }
  );

}

async function cancelOrder(transactionID, transactionData) {

  return await Order.updateOne(
    { _id: transactionID },
    { status: "Cancelled", paymentCallbackData: transactionData }
  )

}

//test and report related db calls

//admin panel calls follows (In use)

//All dashboard calls starts
//fetching all users
async function usersAll() {
  const users = await User.find({}, 'uid name email phone role').exec();
  return users
}
//change role of any user
async function changeRole(uid, role) {
  if (!["USER", "ADMIN"].includes(role)) {
    throw new Error("Please provide a valid role.")
  }
  const doc = await User.findOneAndUpdate({ uid: uid }, { role: role }, { new: true }).exec();
  if (!doc) {
    throw new Error("User not found")
  }
  return { name: doc.name, role: doc.role }
}
//fetching user reports along with data
async function reportsAll(userID) {
  const user = await User.findOne({ uid: userID }, '-_id -bio -__v -plans._id').populate("plans.plan", "name").exec();
  if (!user) {
    throw new Error("User not found")
  }
  const reportObj = user.toObject();
  reportObj.reports = await Report.find({ user: userID }, "_id test points positives negatives submitted start end").populate("test", "name").exec();
  return reportObj;
}
//allow userID to reattempt testID
async function reattempt(testID, userID) {
  const user = await User.updateOne(
    {
      uid: userID,
    },
    {
      $pull: { attemptedTest: { _id: testID } },
    }).exec();
  if (user.matchedCount == 0) {
    throw new Error("User not found");
  }
  const report = await Report.findOneAndDelete(
    {
      user: userID,
      test: testID,
    }).exec();
  if (!report) {
    throw new Error("Test not found");
  }
  return true;
}
//All Dashboard calls ends

//All plan calls starts
//fetching the test along with answers and solutions
async function viewTest(testID) {
  let testObj = await Test.findOne({ _id: testID }).populate({
    path: "sections.questions._id",
  });
  if (!testObj) {
    throw new Error("No test found")
  }
  testObj = testObj.toObject();
  testObj.sections = await Promise.all(
    testObj.sections.map(async (section) => {
      let questionsObj = await Promise.all(
        section.questions.map(async (question) => {
          let { answer, solution } = await Answer.findOne({ _id: question._id._id }).exec();
          question.answer = answer;
          question.solution = solution;
          return question;
        })
      );
      section.questions = questionsObj;
      return section;
    })
  );
  return testObj;
}

//creating new test in a plan
async function createTest(planID, testObj) {
  const plan = await Plan.findById(planID).exec()
  if (!plan) {
    throw new Error("Plan not exist")
  }
  const test = await Test.create(testObj);
  const doc = await Plan.findByIdAndUpdate(planID, { $push: { test: test._id } }).exec()
  return test._id
}

//CRUD functionality for Plans

//Add Plan
async function createPlan(planObj) {
  const plan = Plan.create(planObj)
  return plan
}

//Deleting existing Plan
async function removePlan(planId) {
  await User.updateMany({"plans.plan": planId}, {$pull : {plans : {plan: planId}}})
  const doc = await Plan.findByIdAndDelete(planId);
  if (!doc) {
    throw new Error("No plan found");
  }
  return true
}

//Update Plan
// {
//   name
//   description
//   features
//   price
//   validity
//   test []
//   algo []
//   media []
// }
async function updatePlan(planId, planObj) {
  for (item of planObj.test) {
    const test = await Test.findById(item)
    if (!test) {
      throw new Error("No Test found with that ID, Updation Failed.");
    }
  }
  for (item of planObj.algo) {
    const algo = await Algo.findById(item)
    if (!algo) {
      throw new Error("No Algo found with that ID, Updation Failed.");
    }
  }
  const doc = await Plan.findByIdAndUpdate(planId, planObj);
  if (!doc) {
    throw new Error("Plan not found, Updation Failed.");
  }
  return true
}

async function updateQuestion(questionId, questionObj){
  try {
    const {answer, solution, ...q} = questionObj
    //question obj is same as what we store in DB
    //it must have the type information
    const questionUpdate = await Question.updateOne({_id: questionId}, q)
    switch (questionObj.type) {
      case "SINGLE": {
        if (answer < questionObj.options.length && answer > -1) {
          answerUpdate = await Answer.updateOne(
          {
            _id: questionId
          },
          {
            answer: new mongoose.Types.ObjectId(questionObj.options[answer]._id),
            solution: solution,
          });
        }
        break
      }
      default: {
        answerUpdate = await Answer.updateOne(
        { 
          _id: questionId
        }, 
        {
          answer: answer, 
          solution: solution, 
        });
        break
      }
    }
    return true
  } catch (error) {
    throw error;
  }
}

//Add Remove test, algo, subplan
async function addSubplan(mainPlanId, subPlanId) {

}

//remove test, algo subplan
async function removeSubplan(mainPlanId, subPlanId) {

}

//CRUD functionality for Algo

//Inserting a new Alog
async function createAlgo(algObj) {
  await Algo.create(algObj);
  return true
}

//Deleting existing Algo
async function removeAlgo(algId) {
  await Plan.updateMany({"algo": algId}, {$pull : {"algo": algId}})
  const doc = await Algo.findByIdAndDelete(algId);
  if (!doc) {
    throw new Error("No document found with that ID");
  }
  return true
}

//Update existing Algo
async function updateAlgo(algId, algObj) {
  const doc = await Algo.findByIdAndUpdate(algId, algObj)
  if (!doc) {
    throw new Error("No document found with that ID");
  }
  return true
}

//CRUD functionality for Topics

//Inserting a new Topic
async function createTopic(algId, tpcObj) {
  const topic = await Topic.create(tpcObj);
  const doc = await Algo.findByIdAndUpdate(algId, {$push: {topics: topic._id}})
  if(!doc){
    throw new Error("No algo found with the ID")
  }
  return true
}

//Deleting existing Topic
async function removeTopic(algId, tpcId) {
  await Algo.updateOne({"_id": algId}, {$pull : {topics : tpcId}})
  const doc = await Topic.findByIdAndDelete(tpcId);
  if (!doc) {
    throw new Error("No document found with that ID");
  }
  return true
}

//Update existing Topic Name
async function updateTopic(tpcId, tpcObj) {
  const doc = await Topic.findByIdAndUpdate(tpcId, tpcObj)
  if (!doc) {
    throw new Error("No document found with that ID");
  }
  return true
}

async function algoAll(){
  const algoList = await Algo.find({}, "-__v").populate("topics", "-__v")
  return algoList
}

async function testAll(){
  const testList = await Test.find({}, "-sections -__v")
  return testList
}

async function viewQue(queId){
  const queObj = await Question.findById(queId, "-__v")
  const ansObj = await Answer.findById(queId, "-__v")
  if(!queObj || !ansObj){
    throw new Error("Question/Answer not found")
  }
  return {...(queObj._doc), ...(ansObj._doc)}
} 

module.exports = {
  connectDB, getUser, addPhone, signup,
  reattempt, reportsAll, usersAll, changeRole, viewTest, createTest, updateQuestion, createAlgo, removeAlgo, updateAlgo, createTopic, removeTopic, updateTopic, createPlan, removePlan, updatePlan, addSubplan, removeSubplan, algoAll, testAll, viewQue
};

  //DONE
  //reattempt - grant a test access again to any user
  //reportsAll - get list of all reports of any user
  //usersAll - get list of all users with their data
  //viewTest - get test corresponding to given testID
  //createTest - create a new test using testObj
  //createAlgo - create a new algo using algoObj
  //removeAlgo - removes algo with given algoId
  //updateAlgoName - change algo name
  //addAlgoTopic - adds topic (tpcID) to algo
  //removeAlgoTopic - remove topic form algo
  //createTopic - create a new topic
  //removeTopic - remove topic from database
  //updateTopicName - change topic name
  //addSubtopics - add list/single subtopics into a topic
  //removeSubtopic - remove any subtopic
  //createPlan - introduce a new plan
  //removePlan - remove given plan
  //updatePlan - change plan data like name, description, featues[], price, validity
  //addPlanTest - make a test(testID) part of Plan(planId)
  //addPlanAlgo - make an algo(algoID) part of Plan(planId)
  //addSubplan - make a plan(planId) part of Plan(planId)
  //removePlanTest - remove a test(testID) from part of Plan(planId)
  //removePlanAlgo - remove an algo(algoID) from part of Plan(planId)
  //removeSubplan - remove a plan(planId) from part of Plan(planId)
  //updateQuestion - update the question's directions, statement, media, options, solution (answer?)
  //updateRole - swtich role between admin and user of given userID

  //PENDING
  //mock status modification endpoint (?)
