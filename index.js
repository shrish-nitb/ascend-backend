require("dotenv").config();
const { connectDB } = require("./utils/database");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use("/", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cookieParser());
app.use(bodyParser.json());
const PORT = process.env.PORT;

const userRouter = require("./router/user");
const ordersRouter = require("./router/order");
const plansRouter = require("./router/plan");
const questionsRouter = require("./router/question");



app.use("/user", userRouter);
app.use("/orders", ordersRouter);
app.use("/plans", plansRouter);
app.use("/questions", questionsRouter);

connectDB()
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(
        `Successfully connected to the database and running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
