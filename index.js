require("dotenv").config();
const { connectDB } = require("./helper/database");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const PORT = process.env.PORT;

const userRouter = require("./router/user");
const ordersRouter = require("./router/order");
const plansRouter = require("./router/plan");

app.use("/user", userRouter);
app.use("/orders", ordersRouter);
app.use("/plans", plansRouter);

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
