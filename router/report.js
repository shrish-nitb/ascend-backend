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
