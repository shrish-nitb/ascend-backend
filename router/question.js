const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Question, Answer } = require("../model/question");
const { firebaseTokenVerifier, userAuthLookup, authorizationProvider } = require("../utils/middleware");
const { algoAll } = require("../utils/database");


router.get('/solve/:questionId/:markedValue', firebaseTokenVerifier, userAuthLookup, authorizationProvider('PRACTICE'), async (req, res) => {
  try {
    const { questionId, markedValue } = req.params;
    const testOnly = (await Question.findOne({_id: questionId.trim()}, "testOnly -_id").exec())?.testOnly || false; //undefined (evaluates to if not found testOnly key instead of exception) || false
    if(testOnly){
      throw new Error("Test Only")
    }
    const answerDoc = await Answer.findOne({ _id: questionId.trim() }).exec();
    if (!answerDoc) {
      throw new Error("Answer not exist")
    }
    const answer = answerDoc.answer;
    const correct = (answer.toString().trim() == markedValue.toString().trim());
    return res.json({ correct, answer});
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/algos", async (req, res) => {
  try {
      const list  = await algoAll()
      res.status(200).json({algos: list});
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
})


router.post("/list", firebaseTokenVerifier, userAuthLookup, authorizationProvider('PRACTICE'), async (req, res) => {
  try {
    const { id, type, difficulty, topic, subtopic } = req.body;
    console.log(req.body)
    // if (
    //   id == undefined ||
    //   type == undefined ||
    //   difficulty == undefined ||
    //   topic == undefined ||
    //   subtopic == undefined
    // ) {
    //   return res.status(400).json({ error: "Insufficient parameter" });
    // }

    if (
      id == "" &&
      type == "" &&
      difficulty == "" &&
      topic == "" &&
      subtopic == ""
    ) {
      return res
        .status(400)
        .json({ error: "Please provide atleast one non empty parameter" });
    }

    const query = {};
    if (id != undefined) query._id = new mongoose.Types.ObjectId(id);
    if (type != undefined) query.type = type;
    if (difficulty != undefined) query["meta.tag"] = difficulty;
    if (topic != undefined) query["meta.topic"] = topic;
    if (subtopic != undefined) query["meta.subtopic"] = subtopic;
    query.testOnly = false;

    console.log(query);

    const questions = await Question.find(query);

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const questionObj = req.body;
    const response = await addQuestion(questionObj);
    res.status(201).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error });
  }
});

async function addQuestion(questionObj) {
  try {
    let { answer, solution, ...q } = questionObj;
    q.meta.topic = q.meta?.topic?.trim().toLowerCase()
    const question = await Question.create(q);
    switch (question.type) {
      case "SINGLE": {
        if (answer < question.options.length && answer > -1) {
          await Answer.create({
            _id: question._id,
            answer: question.options[answer]._id,
            solution: solution,
          });
        }
        //else rollback question and create error 'Answer out of range'
        break;
      }
      default: {
        //case for 'NUMERICAL' and 'SUBJECTIVE' question.type
        await Answer.create({ _id: question._id, answer: answer, solution: solution, });
        break;
      }
    }
    return question;
  } catch (error) {
    throw error;
  }
}

module.exports = router;
