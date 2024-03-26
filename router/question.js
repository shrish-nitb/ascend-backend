const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Question, Answer } = require("../model/question");

router.get('/solve/:questionId/:markedValue', async (req, res) => {
  try {
    const { questionId, markedValue } = req.params;
    const answerDoc = await Answer.findOne({ _id: questionId.trim(), isPaid: false }).exec();
    if (!answerDoc) {
      return res.json({ correct: false });
    }
    const answer = answerDoc.answer;
    const correct = (answer.toString().trim() == markedValue.toString().trim());
    return res.json({ correct });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post("/list", async (req, res) => {
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
    query.isPaid = false;

    console.log(query);

    const questions = await Question.find(query);

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.post("/add", async (req, res) => {
//   try {
//     const questionObj = req.body;
//     const response = await addQuestion(questionObj);
//     res.status(201).json(response);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

module.exports = router;
