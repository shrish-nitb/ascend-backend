const mongoose = require("mongoose");
const uri = process.env.DB_URL;
const User = require("../model/user");
const Plan = require('../model/plan');
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

async function getUser(uid) {
  return User.findOne({ uid: uid }).populate({
    path: "plans.plan",
    model: "Plan",
  }).exec();
}


//order and plan related db calls
async function listPlans(planID) {
  try {
    return await Plan.find().populate('test', '-sections.questions -sections._id');
  } catch(error){
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


module.exports = { connectDB, getUser };
