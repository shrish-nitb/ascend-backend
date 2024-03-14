const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Question, Answer } = require("../model/question");

// router.post("/list", async (req, res) => {
//   try {
//     const { id, type, difficulty, topic } = req.body;

//     if (
//       id == undefined ||
//       type == undefined ||
//       difficulty == undefined ||
//       topic == undefined ||
//       subtopic == undefined
//     ) {
//       return res.status(400).json({ error: "Insufficient parameter" });
//     }

//     if (
//       id == "" &&
//       type == "" &&
//       difficulty == "" &&
//       topic == "" &&
//       subtopic == ""
//     ) {
//       return res
//         .status(400)
//         .json({ error: "Please provide atleast one non empty parameter" });
//     }

//     const query = {};
//     if (id != "") query._id = new mongoose.Types.ObjectId(id);
//     if (type != "") query.type = type;
//     if (difficulty != "") query["meta.tag"] = difficulty;
//     if (topic != "") query["meta.topic"] = topic;
//     if (subtopic != "") query["meta.subtopic"] = subtopic;
//     query.isPaid = false;

//     const questions = await Question.find(query);

//     res.status(200).json({ questions });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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
