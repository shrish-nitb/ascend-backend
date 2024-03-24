require("dotenv").config();
const { connectDB } = require("./utils/database");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// const {createTest} = require("./scripts/create_test");

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;

const userRouter = require("./router/user");
const ordersRouter = require("./router/order");
const plansRouter = require("./router/plan");
const testRouter = require("./router/test");
const reportRouter = require("./router/report");
const questionRouter = require("./router/question");


app.use("/user", userRouter);
app.use("/orders", ordersRouter);
app.use("/plans", plansRouter);
app.use("/test", testRouter);
app.use("/report", reportRouter);
app.use("/question",questionRouter)



connectDB()
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(
        `Successfully connected to the database and running on port ${PORT}`
      );
    });
    // createTest();
  })
  .catch((error) => {
    console.log(error);
  });
