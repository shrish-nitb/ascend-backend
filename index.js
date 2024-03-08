require("dotenv").config();
const { connectDB } = require("./helper/database");

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

const PORT =
  process.env.PORT;

const userRouter = require("./router/user")

app.use('/user', userRouter)

connectDB()
  .then(() => {
    app.listen(PORT, (req, res)=>{
        console.log(`Successfully connected to the database and running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error);
  });
