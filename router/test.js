const Test = require("../model/test");
const express = require("express");
const router = express.Router();

router.get("/:testid", async (req, res) => {
  try {
    let meta = await getTestMeta(req.params.testid);
    res.status(200).json(meta);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

async function getTestMeta(testID) {
  try {
    let testObj = (await Test.find({ _id: testID }).exec())[0].toObject();
    testObj.size = 0;
    testObj.maximum = 0;
    console.log(
      testObj.sections.map((section) => {
        let temp = 0;
        section.maximum = 0;
        section.questions.forEach((question) => {
          temp++;
          section.maximum += question.positives;
        });
        console.log(temp);
        testObj.maximum += section.maximum;
        section.size = temp;
        testObj.size += section.size;
        delete section.questions;
        delete section._id;
        return section;
      })
    );
    delete testObj.__v;
    return testObj;
  } catch (error) {
    throw error;
  }
}

async function startTest({ testID, userID }) {
  try {
    let test_fetched = (await Test.find({ _id: testID }).exec())[0];
    let init_report = new Report({
      test: test_fetched._id,
      user: userID,
      sections: test_fetched.sections,
      duration: test_fetched.duration,
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
  } catch (error) {
    throw error;
  }
}
