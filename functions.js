require("dotenv").config();
const { connectDB } = require("./helper/database");

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

async function addQuestion(questionObj) {
  const { answer, ...q } = questionObj;
  const question = await Question.create(q);
  switch (question.type) {
    case "SINGLE": {
      if (answer < question.options.length && answer > -1) {
        await Answer.create({
          _id: question._id,
          answer: question.options[answer]._id,
        });
      }
      //else rollback question and create error 'Answer out of range'
      break;
    }
    default: {
      //case for 'NUMERICAL' and 'SUBJECTIVE' question.type
      await Answer.create({ _id: question._id, answer: answer });
      break;
    }
  }
  return question._id;
}

async function createTest(testObj) {
  let test = await Test.create(testObj);
  return test;
}

async function getTest({ testID, userID }) {
  let test_fetched = await Test.find({ _id: testID }).exec();
  let init_report = new Report({
    test: test_fetched[0]._id,
    user: userID, 
    sections: test_fetched[0].sections,
    duration: test_fetched[0].duration,
  });
  return JSON.stringify(
    await (
      await init_report.save()
    ).populate({
      path: "sections.questions._id",
      model: "Question",
    }),
    null,
    2
  );
}

async function saveandcontinue({ report, data }) {
  let sectionsObj = (await Report.findOne({ _id: report }, "sections"))
    .sections;
  let updatedSectionIndex = null;
  let updatedSectionStatus = null;
  sectionsObj = sectionsObj.map((section, index) => {
    if (section._id == data._id) {
      if (!section.start) {
        updatedSectionIndex = index;
        updatedSectionStatus = "start";
        section.start = Date.now();
        console.log(
          `section ${index + 1} started successfully at ${section.start}`
        );
      } else if (!section.end) {
        updatedSectionIndex = index;
        updatedSectionStatus = "end";
        section.questions = section.questions.map((item, index) => {
          let question = data.questions[index];
          if (question._id == item._id) {
            item.marked = question.marked;
            item.duration = question.duration;
            item.status = question.status;
          }
          return item;
        });
        section.end = Date.now();
        console.log(
          `section ${index + 1} submitted successfully at ${section.end}`
        );
      } else {
        console.log(
          "section is already submitted for evaluation and is in read-only mode"
        );
      }
    }
    return section;
  });
  let updateObj = { sections: sectionsObj };
  if (updatedSectionIndex == 0 && updatedSectionStatus == "start") {
    updateObj.start = sectionsObj[0].start;
  }
  if (
    updatedSectionIndex == sectionsObj.length - 1 &&
    updatedSectionStatus == "end"
  ) {
    updateObj.end = sectionsObj[sectionsObj.length - 1].end;
  }
  await Report.updateOne({ _id: report }, updateObj);
}

async function submitReport({ report }) {
  let reportObj = await Report.findOne({ _id: report });
  //note if report id was non existant the reportObj will be null
  if (reportObj.submitted == true) {
    console.log("Test already evaluated now in read-only mode");
    return;
  }
  let sections = reportObj.sections;
  let incomplete = false;
  sections.forEach((section, index) => {
    if (!section.start || !section.end) {
      console.log(`cannot submit the test please attempt section ${index + 1}`);
      incomplete = true;
    }
  });
  if (incomplete) {
    return;
  }
  let testScore = 0;
  sections = await Promise.all(
    sections.map(async (section) => {
      let sectionScore = 0;
      let questionsObj = await Promise.all(
        section.questions.map(async (question) => {
          if (question.status === 1 || question.status === 2) {
            let answer = (
              await Answer.find({ _id: question._id }).exec()
            )[0].answer
              .toString()
              .trim();
            let marked = question.marked.trim();
            if (answer == marked) {
              question.points = question.positives;
            } else {
              question.points -= question.negatives;
            }
          }
          sectionScore += question.points;
          testScore += question.points;
          return question;
        })
      );
      section.questions = questionsObj;
      section.points = sectionScore;
      return section;
    })
  );
  reportObj.points = testScore;
  reportObj.submitted = true;
  await Report.updateOne({ _id: report }, reportObj);
  console.log("Test evaluated successfully");
}

async function getQuestion() {}

async function getAnalytics({ report }) {
  console.log(
    JSON.stringify(
      await Report.find({ _id: report }).populate({
        path: "sections.questions._id",
        model: "Question",
      }),
      null,
      2
    )
  );
}

async function createPlan(){
  await Plan.create({
    name: "sample plan",
    description: "sample description",
    price: 1,
    test: [new mongoose.Types.ObjectId("65e4264650108b6e21a57a6d")],
    questions: [new mongoose.Types.ObjectId("65e4210a9923f0e7392f1ea9")]
  })
}

async function createOrder(){
  //userid
  //planid
  let orderObj = {
    plan: "65e77366dee12a6507b4113a",
    user: "TaHnN6qbILP2XXTN7QKNRSXj0rF2"
  }
}



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
  // const accessToken =
  //   "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNiYjg3ZGNhM2JjYjY5ZDcyYjZjYmExYjU5YjMzY2M1MjI5N2NhOGQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU2hyaXNoIFNocml2YXN0YXZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0s1cnNuR3d0bGtjbXRDRzlRMlZRLUI1NEFnVlZlVHRoSWJwV1dkZ1Y4RT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wcmphc2MtNGNjZGUiLCJhdWQiOiJwcmphc2MtNGNjZGUiLCJhdXRoX3RpbWUiOjE3MDkzNjQ4MzAsInVzZXJfaWQiOiJUYUhuTjZxYklMUDJYWFRON1FLTlJTWGowckYyIiwic3ViIjoiVGFIbk42cWJJTFAyWFhUTjdRS05SU1hqMHJGMiIsImlhdCI6MTcwOTM2NDgzMCwiZXhwIjoxNzA5MzY4NDMwLCJlbWFpbCI6InNocmlzaC53b3JrQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTAzNjk2MzYyOTAzNjc3NDYyNjA5Il0sImVtYWlsIjpbInNocmlzaC53b3JrQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.WeT-bV7X6blbNpuYDbobPj04dyOdi0jZ8t-0X14TbeOWol48SJgOaeIHwo80PAcVKyqUylbGgjnxlTVYa6EhLMN5kj6f7UQMA1NyzIXOOVT9CruuWNcZu5A2hZKVdK4kxqfpL7XYFzTyaMMu8rPawlhAuhWZIZqUh7sTlAgEI3BZnSPvyG7I_JuYOyUHpzrSYefSZ1T8OAej9z9qW2v-Dw8Sitzfqf6qpfleUaLcdYSP_aAWMjE3g2PuoznQfZJklaeWtZZ8jPjhSvjLKkc1vw1PTgSCNXgi8oznQlvpxJ5iw67ifiGMqLgcX-783FxMIYlxxRCtptjvy904OdE5dA";

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
  //   isPaid: false,
  // });
  // } catch (error) {
  //   console.error(error);
  // }

  const sampleQuestions = [
    {
      directions: "Sample directions 1",
      statement: "Sample statement 1",
      media: "Sample media 1",
      type: "SINGLE",
      options: [
        { value: "Option A" },
        { value: "Option B" },
        { value: "Option C" },
      ],
      meta: {
        tag: "EASY",
        topic: "Sample Topic 1",
        subtopic: "Sample Subtopic 1",
      },
      isPaid: true,
      answer: 2, // Index of correct option (0-based) for 'SINGLE' type
    },
    {
      directions: "Sample directions 2",
      statement: "Sample statement 2",
      media: "Sample media 2",
      type: "NUMERICAL",
      options: [],
      meta: {
        tag: "MEDIUM",
        topic: "Sample Topic 2",
        subtopic: "Sample Subtopic 2",
      },
      isPaid: false,
      answer: 42.5, // Floating-point number for 'NUMERICAL' type
    },
    {
      directions: "Sample directions 3",
      statement: "Sample statement 3",
      media: "Sample media 3",
      type: "SUBJECTIVE",
      options: [],
      meta: {
        tag: "HARD",
        topic: "Sample Topic 3",
        subtopic: "Sample Subtopic 3",
      },
      isPaid: true,
      answer: "RandomWord123", // Random word for 'SUBJECTIVE' type
    },
    {
      directions: "Sample directions 4",
      statement: "Sample statement 4",
      media: "Sample media 4",
      type: "SINGLE",
      options: [
        { value: "Option X" },
        { value: "Option Y" },
        { value: "Option Z" },
      ],
      meta: {
        tag: "MEDIUM",
        topic: "Sample Topic 4",
        subtopic: "Sample Subtopic 4",
      },
      isPaid: false,
      answer: 1, // Index of correct option (0-based) for 'SINGLE' type
    },
    {
      directions: "Sample directions 5",
      statement: "Sample statement 5",
      media: "Sample media 5",
      type: "NUMERICAL",
      options: [],
      meta: {
        tag: "EASY",
        topic: "Sample Topic 5",
        subtopic: "Sample Subtopic 5",
      },
      isPaid: true,
      answer: 73, // Integer for 'NUMERICAL' type
    },
    {
      directions: "Sample directions 6",
      statement: "Sample statement 6",
      media: "Sample media 6",
      type: "SINGLE",
      options: [
        { value: "Option P" },
        { value: "Option Q" },
        { value: "Option R" },
      ],
      meta: {
        tag: "HARD",
        topic: "Sample Topic 6",
        subtopic: "Sample Subtopic 6",
      },
      isPaid: true,
      answer: 0, // Index of correct option (0-based) for 'SINGLE' type
    },
    {
      directions: "Sample directions 7",
      statement: "Sample statement 7",
      media: "Sample media 7",
      type: "SUBJECTIVE",
      options: [],
      meta: {
        tag: "MEDIUM",
        topic: "Sample Topic 7",
        subtopic: "Sample Subtopic 7",
      },
      isPaid: false,
      answer: "RandomWord456", // Random word for 'SUBJECTIVE' type
    },
    {
      directions: "Sample directions 8",
      statement: "Sample statement 8",
      media: "Sample media 8",
      type: "SINGLE",
      options: [
        { value: "Option M" },
        { value: "Option N" },
        { value: "Option O" },
      ],
      meta: {
        tag: "EASY",
        topic: "Sample Topic 8",
        subtopic: "Sample Subtopic 8",
      },
      isPaid: false,
      answer: 2, // Index of correct option (0-based) for 'SINGLE' type
    },
    {
      directions: "Sample directions 9",
      statement: "Sample statement 9",
      media: "Sample media 9",
      type: "NUMERICAL",
      options: [],
      meta: {
        tag: "HARD",
        topic: "Sample Topic 9",
        subtopic: "Sample Subtopic 9",
      },
      isPaid: true,
      answer: 100, // Integer for 'NUMERICAL' type
    },
    {
      directions: "Sample directions 10",
      statement: "Sample statement 10",
      media: "Sample media 10",
      type: "SUBJECTIVE",
      options: [],
      meta: {
        tag: "MEDIUM",
        topic: "Sample Topic 10",
        subtopic: "Sample Subtopic 10",
      },
      isPaid: true,
      answer: "RandomWord789", // Random word for 'SUBJECTIVE' type
    },
    {
      directions: "Sample directions 11",
      statement: "Sample statement 11",
      media: "Sample media 11",
      type: "SINGLE",
      options: [
        { value: "Option G" },
        { value: "Option H" },
        { value: "Option I" },
      ],
      meta: {
        tag: "EASY",
        topic: "Sample Topic 11",
        subtopic: "Sample Subtopic 11",
      },
      isPaid: false,
      answer: 1, // Index of correct option (0-based) for 'SINGLE' type
    },
    {
      directions: "Sample directions 12",
      statement: "Sample statement 12",
      media: "Sample media 12",
      type: "NUMERICAL",
      options: [],
      meta: {
        tag: "HARD",
        topic: "Sample Topic 12",
        subtopic: "Sample Subtopic 12",
      },
      isPaid: true,
      answer: 56.78, // Floating-point number for 'NUMERICAL' type
    },
    {
      directions: "Sample directions 13",
      statement: "Sample statement 13",
      media: "Sample media 13",
      type: "SUBJECTIVE",
      options: [],
      meta: {
        tag: "MEDIUM",
        topic: "Sample Topic 13",
        subtopic: "Sample Subtopic 13",
      },
      isPaid: true,
      answer: "RandomWordABC", // Random word for 'SUBJECTIVE' type
    },
    {
      directions: "Sample directions 14",
      statement: "Sample statement 14",
      media: "Sample media 14",
      type: "SINGLE",
      options: [
        { value: "Option U" },
        { value: "Option V" },
        { value: "Option W" },
      ],
      meta: {
        tag: "EASY",
        topic: "Sample Topic 14",
        subtopic: "Sample Subtopic 14",
      },
      isPaid: true,
      answer: 0, // Index of correct option (0-based) for 'SINGLE' type
    },
    {
      directions: "Sample directions 15",
      statement: "Sample statement 15",
      media: "Sample media 15",
      type: "NUMERICAL",
      options: [],
      meta: {
        tag: "HARD",
        topic: "Sample Topic 15",
        subtopic: "Sample Subtopic 15",
      },
      isPaid: false,
      answer: 123, // Integer for 'NUMERICAL' type
    },
  ];

  // addQuestionsSequentially(sampleQuestions);

  // Index 0: 65e4210a9923f0e7392f1ea9
  // Index 1: 65e4210a9923f0e7392f1eaf
  // Index 2: 65e4210a9923f0e7392f1eb3
  // Index 3: 65e4210a9923f0e7392f1eb7
  // Index 4: 65e4210a9923f0e7392f1ebd
  // Index 5: 65e4210a9923f0e7392f1ec0
  // Index 6: 65e4210a9923f0e7392f1ec6
  // Index 7: 65e4210b9923f0e7392f1ec9
  // Index 8: 65e4210b9923f0e7392f1ecf
  // Index 9: 65e4210b9923f0e7392f1ed2
  // Index 10: 65e4210b9923f0e7392f1ed5
  // Index 11: 65e4210b9923f0e7392f1edb
  // Index 12: 65e4210b9923f0e7392f1ede
  // Index 13: 65e4210b9923f0e7392f1ee1
  // Index 14: 65e4210b9923f0e7392f1ee7

  // const questionIds = [
  //   "65e4210a9923f0e7392f1ea9",
  //   "65e4210a9923f0e7392f1eaf",
  //   "65e4210a9923f0e7392f1eb3",
  //   "65e4210a9923f0e7392f1eb7",
  //   "65e4210a9923f0e7392f1ebd",
  //   "65e4210a9923f0e7392f1ec0",
  //   "65e4210a9923f0e7392f1ec6",
  //   "65e4210b9923f0e7392f1ec9",
  //   "65e4210b9923f0e7392f1ecf",
  //   "65e4210b9923f0e7392f1ed2",
  //   "65e4210b9923f0e7392f1ed5",
  //   "65e4210b9923f0e7392f1edb",
  //   "65e4210b9923f0e7392f1ede",
  //   "65e4210b9923f0e7392f1ee1",
  //   "65e4210b9923f0e7392f1ee7",
  // ];

  // const sampleTest = {
  //   instructions: "Read the instructions carefully before answering.",
  //   sections: [
  //     {
  //       name: "Section 1",
  //       questions: questionIds.slice(0, 5).map((qid) => ({
  //         _id: new mongoose.Types.ObjectId(qid),
  //         positives: 4,
  //         negatives: 1,
  //       })),
  //       duration: 30, // Duration for Section 1 in minutes
  //     },
  //     {
  //       name: "Section 2",
  //       questions: questionIds.slice(5, 10).map((qid) => ({
  //         _id: new mongoose.Types.ObjectId(qid),
  //         positives: 4,
  //         negatives: 1,
  //       })),
  //       duration: 30, // Duration for Section 2 in minutes
  //     },
  //     {
  //       name: "Section 3",
  //       questions: questionIds.slice(10, 15).map((qid) => ({
  //         _id: new mongoose.Types.ObjectId(qid),
  //         positives: 4,
  //         negatives: 1,
  //       })),
  //       duration: 30, // Duration for Section 3 in minutes
  //     },
  //   ],
  //   duration: 90, // Total duration of the test in minutes
  // };

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
const addQuestionsSequentially = async (questions) => {
  for (let i = 0; i < questions.length; i++) {
    try {
      const result = await addQuestion(questions[i]);
      console.log(`Index ${i}: ${result}`);
    } catch (error) {
      console.error(`Error adding question at index ${i}:`, error.message);
    }
  }
};

connectDB()
  .then(() => {
    main();
  })
  .catch((error) => {
    console.log(error);
  });
