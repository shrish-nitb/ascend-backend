const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Question } = require("../model/question");

router.post("/list", async (req, res) => {
  try {
    const { id, type, difficulty, topic } = req.body;

    if(id == undefined || type == undefined || difficulty == undefined || topic == undefined){
        return res.status(400).json({ error: 'Insufficient parameter' });
    }

    if(id == "" && type == "" && difficulty == "" && topic == ""){
        return res.status(400).json({ error: 'Please provide atleast one non empty parameter' });
    }

    const query = {};
    if (id != "") query._id = new mongoose.Types.ObjectId(id);
    if (type != "") query.type = type;
    if (difficulty != "") query["meta.tag"] = difficulty;
    if (topic != "") query["meta.topic"] = topic;
    query.isPaid = false;

    const questions = await Question.find(query);

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

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
