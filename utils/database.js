const mongoose = require("mongoose");
const uri = process.env.DB_URL;
const User = require("../model/user");
const Plan = require('../model/plan');
const Test = require('../model/test');
const Algo = require("../model/algorithm");
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

//user related db calls
async function getUser(uid) {
  return User.findOne({ uid: uid }).populate({
    path: "plans.plan",
    model: "Plan",
  }).exec();
}

async function addPhone(decodedToken, phoneNumber) {
  try {
    const updatedUser = await User.findOneAndUpdate({ uid: decodedToken.uid }, { phone: phoneNumber }, { new: true }).exec();
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

async function signup(decodedToken) {
  try {
    const newUser = await User.create({
      uid: decodedToken.uid,
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture,
      phone: decodedToken.phone,
    });
    return newUser;
  } catch (error) {
    throw error;
  }
}

//order and plan related db calls
async function listPlans(planID) {
  try {
    return await Plan.find().populate('test', '-sections.questions -sections._id');
  } catch (error) {
    throw error
  }
}

async function findPlan(planID) {
  try {
    return await Plan.findOne({ _id: planID }).exec();
  } catch (error) {
    throw error
  }
}

async function createOrder(planID, userID) {
  try {
    return await Order.create({
      plan: planID,
      user: userID,
    });
  } catch (error) {
    throw error;
  }
}

async function completeOrder(transactionID, transactionData) {
  try {
    return await Order.updateOne(
      { _id: transactionID },
      { status: "Completed", paymentCallbackData: transactionData }
    );
  } catch (error) {
    throw error;
  }
}

async function addPlan(userID, newPlanObj) {
  try {
    return await User.updateOne(
      {
        uid: userID,
      },
      {
        $push: { plans: newPlanObj },
      }
    );
  } catch (error) {
    throw error;
  }
}

async function cancelOrder(transactionID, transactionData) {
  try {
    return await Order.updateOne(
      { _id: transactionID },
      { status: "Cancelled", paymentCallbackData: transactionData }
    )
  } catch (error) {
    throw error;
  }
}

//test and report related db calls

//admin panel calls
async function reattempt(testID, userID) {
  try {
    await User.updateOne(
      {
        uid: userID,
      },
      {
        $pull: { attemptedTest: { _id: testID } },
      });
  } catch (error) {
    throw error;
  }
}

//fetching user reports along with data
async function reportsAll(userID) {
  try {
    const user = await User.findOne({ uid: userID }, '-_id name uid email phone attemptedTest').exec();
    const reportObj = user.toObject();
    reportObj.reports = await Report.find({ user: userID }).exec();
    console.log(reportObj);
  } catch (error) {
    throw error;
  }
}

//fetching all users
async function usersAll() {
  try {
    const users = await User.find({}, '-_id -__v').exec();
    console.log(users);
  } catch (error) {
    throw error;
  }
}

//fetching the test along with answers
async function viewTest(testID) {
  try {
    let testObj = await Test.findOne({ _id: testID }).populate({
      path: "sections.questions._id",
    });

    testObj = testObj.toObject();
    testObj.sections = await Promise.all(
      testObj.sections.map(async (section) => {
        let questionsObj = await Promise.all(
          section.questions.map(async (question) => {
            let answer = (
              await Answer.find({ _id: question._id._id }).exec()
            )[0].answer
              .toString()
              .trim();
            question.answer = answer;
            return question;
          })
        );
        section.questions = questionsObj;
        return section;
      })
    );
    // console.log(testObj.sections[0].questions[5])
  } catch (error) {
    throw error;
  }
}

//changing the uploaded question
async function updateQuestion() {

}

//creating new tests
async function createTest(testObj) {
  try {
    await Test.create(testObj);
  } catch (error) {
    throw error;
  }
}

//CRUD functionality for Algo

//Inserting a new Alog
async function createAlgo(algObj) {
  try {
    await Algo.create(algObj);
  } catch (error) {
    throw error;
  }
}

//Deleting existing Algo
async function removeAlgo(algId) {
  try {
    const doc = await Algo.findByIdAndDelete(algId);
    if (!doc) {
      throw new Error("No document found with that ID");
    }
  } catch (error) {
    throw error;
  }
}

//Update existing Algo Name
async function updateAlgoName(algId, newName) {
  try {
    const doc = await Algo.findByIdAndUpdate(algId, { name: newName })
    if (!doc) {
      throw new Error("No document found with that ID");
    }
  } catch (error) {
    throw error;
  }
}

//Add existing Topic to Algo 
async function addAlgoTopic(algId, tpcId) {
  try {
    const tpc = await Topic.findById(tpcId)
    if (!tpc) {
      throw new Error("No topic found with that ID");
    }
    const doc = await Algo.findByIdAndUpdate(algId, { $push: { topics: tpcId } })
    if (!doc) {
      throw new Error("No Algo found with that ID");
    }
  } catch (error) {
    throw error;
  }
}

//Remove existing Topic from Algo
async function removeAlgoTopic(algId, tpcId) {
  try {
    const tpc = await Topic.findById(tpcId)
    if (!tpc) {
      throw new Error("No topic found with that ID");
    }
    const doc = await Algo.findByIdAndUpdate(algId, { $pop: { topics: tpcId } })
    if (!doc) {
      throw new Error("No Algo found with that ID");
    }
  } catch (error) {
    throw error;
  }
}





module.exports = { connectDB, getUser, addPhone, signup, reattempt, reportsAll, usersAll, viewTest, createTest, createAlgo };
