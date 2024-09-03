require("dotenv").config();
const PORT = process.env.PORT;

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRouter = require("./router/user");
const adminRouter = require("./router/admin");
const ordersRouter = require("./router/order");
const plansRouter = require("./router/plan");
const testRouter = require("./router/test");
const reportRouter = require("./router/report");
const questionRouter = require("./router/question");
const courseRouter = require("./router/course");
const { connectDB } = require("./utils/database");
const FileUpload=require("express-fileupload");
const { firebaseTokenVerifier, userAuthLookup, roleAuthProvider } = require("./utils/middleware")

async function main() {
  const app = express();
  app.use(cookieParser());
  app.use(cors());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(FileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/'
  })); 
  
  app.use("/user", userRouter);
  app.use("/admin", firebaseTokenVerifier, userAuthLookup, roleAuthProvider('ADMIN'), adminRouter);
  app.use("/orders", ordersRouter);
  app.use("/plans", plansRouter);
  app.use("/test", testRouter);
  app.use("/report", reportRouter);
  app.use("/question", questionRouter)
  app.use("/course", courseRouter)


  try {
    await connectDB();
    app.listen(PORT, (req, res) => {
      console.log(
        `Successfully connected to the database and running on port ${PORT}`
      );
    });
  } catch (error) {
    console.log(error);
  }
}

main()
