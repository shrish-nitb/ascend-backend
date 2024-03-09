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
