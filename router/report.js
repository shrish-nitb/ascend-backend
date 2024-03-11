const express = require("express");
const router = express.Router();
const Report = require("../model/report");
const { Question, Answer } = require("../model/question");

const { verifyToken } = require("../utils/firebase");

const verificationMiddleware = async (req, res, next) => {
  let token = req.header("Authorization");
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.body && req.body.token) {
    token = req.body.token;
  }
  decodedToken = await verifyToken(token);
  req.decodedToken = decodedToken;
  next();
};

router.put("/", async (req, res) => {
  try {
    const { report, data } = req.body;
    const message = await saveandcontinue(report, data);
    res.status(200).json({ message: message });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { report } = req.body;
    const message = await submitReport(report);
    res.status(200).json({ message: message });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/list", verificationMiddleware, async (req, res) => {
  try {
    const userID = req.decodedToken.uid;

    //we need to return the testID along with the reportID
    const reports = await Report.find({ user: userID, submitted: true }).select(
      "_id test"
    );
    res.status(200).json(reports);
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:reportID", async (req, res) => {
  try {
    const reportID = req.params.reportID;
    const analytics = await getAnalytics(reportID);
    res.status(200).json(analytics);
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

async function saveandcontinue(report, data) {
  try {
    let message = "";
    let updateable = true;
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
          message = `section ${index + 1} started successfully at ${
            section.start
          }`;
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
          message = `section ${index + 1} submitted successfully at ${
            section.end
          }`;
        } else {
          updateable = false;
          message = `section ${
            index + 1
          } is already submitted for evaluation and is in read-only mode`;
        }
      }
      return section;
    });
    if (!updateable) {
      return message;
    }
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
    return message;
  } catch (error) {
    throw error;
  }
}

async function submitReport(report) {
  try {
    let message = "";
    let reportObj = await Report.findOne({ _id: report });
    //note if report id was non existant the reportObj will be null
    if (reportObj.submitted == true) {
      message = "Test already evaluated now in read-only mode";
      return message;
    }
    let sections = reportObj.sections;
    let incomplete = false;
    sections.forEach((section, index) => {
      if (!section.start || !section.end) {
        incomplete = true;
      }
    });
    if (incomplete) {
      message = `cannot submit the test please attempt section ${index + 1}`;
      return message;
    }
    let testScore = 0;
    let positiveTestScore = 0;
    let negativeTestScore = 0;
    let maximumTestScore = 0;
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
                section.positives += question.positives;
                positiveTestScore += question.positives;
              } else {
                question.points -= question.negatives;
                section.negatives += question.negatives;
                negativeTestScore += question.negatives;
              }
            }
            section.maximum += question.positives;
            maximumTestScore += question.positives;
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
    reportObj.positives = positiveTestScore;
    reportObj.negatives = negativeTestScore;
    reportObj.maximum = maximumTestScore;
    reportObj.submitted = true;
    await Report.updateOne({ _id: report }, reportObj);
    message = "Test evaluated successfully";
    return message;
  } catch (error) {
    throw error;
  }
}

async function getAnalytics(report) {
  let analyticsObj = (
    await Report.find({ _id: report }).populate({
      path: "sections.questions._id",
      model: "Question",
    })
  )[0].toObject();

  await Promise.all(
    analyticsObj.sections.map(async (section) => {
      await Promise.all(
        section.questions.map(async (question) => {
          let answerObj = await Answer.findOne({ _id: question._id });
          question.answer = answerObj.answer;
          question.solution = answerObj.solution;
        })
      );
    })
  );
  return analyticsObj;
}

async function calculateRank(testID, marks) {}
