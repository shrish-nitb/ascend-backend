require("dotenv").config();
const { connectDB } = require("./utils/database");

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const mongoose = require("mongoose");
const User = require("./model/user");
const { Question, Answer } = require("./model/question");
const Test = require("./model/test");
const Report = require("./model/report");
const Plan = require("./model/plan");

const app = express();
app.use(cookieParser());
const firebaseApp = initializeApp({
  apiKey: "AIzaSyB-S3EQg0O7_AONI9MWsVS8r90x5Ox2UkI",
  authDomain: "prjasc-4ccde.firebaseapp.com",
  projectId: "prjasc-4ccde",
  storageBucket: "prjasc-4ccde.appspot.com",
  messagingSenderId: "708105850428",
  appId: "1:708105850428:web:9ad5d97342a9967a793d39",
  measurementId: "G-4PP2RGQ23G",
});

async function main() {
  // createPlan()

  // getAnalytics({report: "65e71689886c4046412a8d95"})
  // let report = await getTest({
  //   testID: "65e4264650108b6e21a57a6d",
  //   userID: "TaHnN6qbILP2XXTN7QKNRSXj0rF2",
  // });

  // saveandcontinue({
  //   report: "65e71689886c4046412a8d95",
  //   data : {
  //     name: "Section 3",
  //     points: 0,
  //     questions: [
  //       {
  //         _id: "65e4210b9923f0e7392f1ed5",
  //         marked: "65e4210b9923f0e7392f1ed7",
  //         status: 0,
  //         positives: 4,
  //         negatives: 1,
  //         points: 0,
  //         duration: 60,
  //       },
  //       {
  //         _id: "65e4210b9923f0e7392f1edb",
  //         marked: 56.78,
  //         status: 0,
  //         positives: 4,
  //         negatives: 1,
  //         points: 0,
  //         duration: 60,
  //       },
  //       {
  //         _id: "65e4210b9923f0e7392f1ede",
  //         marked: "RandomWordABC",
  //         status: 0,
  //         positives: 4,
  //         negatives: 1,
  //         points: 0,
  //         duration: 60,
  //       },
  //       {
  //         _id: "65e4210b9923f0e7392f1ee1",
  //         marked: "65e4210b9923f0e7392f1ee2",
  //         status: 0,
  //         positives: 4,
  //         negatives: 1,
  //         points: 0,
  //         duration: 60,
  //       },
  //       {
  //         _id: "65e4210b9923f0e7392f1ee7",
  //         marked: 123,
  //         status: 0,
  //         positives: 4,
  //         negatives: 1,
  //         points: 0,
  //         duration: 60,
  //       },
  //     ],
  //     duration: 1800,
  //     _id: "65e4264650108b6e21a57a70",
  //   }
  // });

  // submitReport({ report: "65e71689886c4046412a8d95" });

  // report.sections[0].questions[0].status = 2;
  // report.sections[0].questions[0].marked = "65e4210a9923f0e7392f1eac";
  // report.sections[0].questions[1].status = 2;
  // report.sections[0].questions[1].marked = "42.5";
  // report.sections[0].questions[2].status = 2;
  // report.sections[0].questions[2].marked = "RandomWord123";
  // updateReport({
  //   report: report._id,
  //   section: report.sections[0]._id,
  //   data: report.sections[0],
  //   event: 0,
  // });
  

  // try {
  // console.log(await isSignedIn(accessToken));
  // await signup(accessToken);
  // await isSignedIn(accessToken);
  // await signout(accessToken);
  // await isSignedIn(accessToken);
  // addQuestion({
  //   statement: "Rise in price of commodity is known as?",
  //   type: "SUBJECTIVE",
  //   answer: "Inflation",
  //   meta: {
  //     tag: "EASY",
  //     topic: "Financial Analysis",
  //     subtopic: "Introduction",
  //   },
  //   testOnly: false,
  // });
  // } catch (error) {
  //   console.error(error);
  // }

  const sampleSubmissionData = {
    test: "65e4264650108b6e21a57a6d",
    answers: {
      "65e4210a9923f0e7392f1ea9": {
        duration: 60,
        answer: "65e4210a9923f0e7392f1eac",
        status: 0,
      },
      "65e4210a9923f0e7392f1eaf": {
        duration: 60,
        answer: 42.5,
        status: 0,
      },
      "65e4210a9923f0e7392f1eb3": {
        duration: 60,
        answer: "RandomWord123",
        status: 0,
      },
      "65e4210a9923f0e7392f1eb7": {
        duration: 60,
        answer: "65e4210a9923f0e7392f1eb9",
        status: 0,
      },
      "65e4210a9923f0e7392f1ebd": {
        duration: 60,
        answer: 73,
        status: 0,
      },
      "65e4210a9923f0e7392f1ec0": {
        duration: 60,
        answer: "65e4210a9923f0e7392f1ec1",
        status: 0,
      },
      "65e4210a9923f0e7392f1ec6": {
        duration: 60,
        answer: "RandomWord456",
        status: 0,
      },
      "65e4210b9923f0e7392f1ec9": {
        duration: 60,
        answer: "65e4210b9923f0e7392f1ecc",
        status: 0,
      },
      "65e4210b9923f0e7392f1ecf": {
        duration: 60,
        answer: 100,
        status: 0,
      },
      "65e4210b9923f0e7392f1ed2": {
        duration: 60,
        answer: "RandomWord789",
        status: 0,
      },
      "65e4210b9923f0e7392f1ed5": {
        duration: 60,
        answer: "65e4210b9923f0e7392f1ed7",
        status: 0,
      },
      "65e4210b9923f0e7392f1edb": {
        duration: 60,
        answer: 56.78,
        status: 0,
      },
      "65e4210b9923f0e7392f1ede": {
        duration: 60,
        answer: "RandomWordABC",
        status: 0,
      },
      "65e4210b9923f0e7392f1ee1": {
        duration: 60,
        answer: "65e4210b9923f0e7392f1ee2",
        status: 0,
      },
      "65e4210b9923f0e7392f1ee7": {
        duration: 60,
        answer: 123,
        status: 0,
      },
    },
  };
}

//test functions


connectDB()
  .then(() => {
    main();
  })
  .catch((error) => {
    console.log(error);
  });
