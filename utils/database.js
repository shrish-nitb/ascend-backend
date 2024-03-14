const mongoose = require("mongoose");
const uri = process.env.DB_URL;
const User = require("../model/user");

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

module.exports = { connectDB, getUser };
