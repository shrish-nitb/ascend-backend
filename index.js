require("dotenv").config();
const { connectDB } = require("./utils/database");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));

const PORT = process.env.PORT;

const userRouter = require("./router/user");
const adminRouter = require("./router/admin");
const ordersRouter = require("./router/order");
const plansRouter = require("./router/plan");
const testRouter = require("./router/test");
const reportRouter = require("./router/report");
const questionRouter = require("./router/question");

const {createTest, checkAnswers, checkQuestions, createVa} = require("./scripts/create_test")
const {grantAccess} = require("./scripts/user_scripts")


const {reportsAll, usersAll, viewTest, createTopic, addSubtopics, removeSubtopic, updateTopicName} = require("./utils/database")


app.use("/user", userRouter);
// app.use("/admin", adminRouter);
app.use("/orders", ordersRouter);
app.use("/plans", plansRouter);
app.use("/test", testRouter);
app.use("/report", reportRouter);
app.use("/question",questionRouter)



connectDB()
  .then(async () => {
    app.listen(PORT, (req, res) => {
      console.log(
        `Successfully connected to the database and running on port ${PORT}`
      );
      // reportsAll("QkgZx38mqVMO7Ug2n30xQSNlJGJ3")
      // usersAll()
      // viewTest("6605a9d74b793730ccf6a363")
      // createTopic({
      //   name: "Topic Name",
      //   subtopic: ["Subtopic 1", "Subtopic 2"]
      // })
      // addSubtopic("66bc8801a66e62fdc917980c", ["Subtopic 4", "Subtopic 5"])
      // updateTopicName("66bc8801a66e62fdc917980c", "Updated Name")
      // removeSubtopic("66bc8801a66e62fdc917980c", "Subtopic 5")


    });
  })
  .catch((error) => {
    console.log(error);
  });
