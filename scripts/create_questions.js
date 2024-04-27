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
    testOnly: true,
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
    testOnly: false,
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
    testOnly: true,
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
    testOnly: false,
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
    testOnly: true,
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
    testOnly: true,
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
    testOnly: false,
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
    testOnly: false,
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
    testOnly: true,
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
    testOnly: true,
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
    testOnly: false,
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
    testOnly: true,
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
    testOnly: true,
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
    testOnly: true,
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
    testOnly: false,
    answer: 123, // Integer for 'NUMERICAL' type
  },
];

const addQuestionsSequentially = async (questions) => {
  for (let i = 0; i < questions.length; i++) {
    try {
      const result = await addQuestion(questions[i]);
      console.log(`${result._id}`);
    } catch (error) {
      console.error(`Error adding question at index ${i}:`, error.message);
    }
  }
};

async function addQuestion(questionObj) {
  try {
    const { answer, solution, ...q } = questionObj;
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

addQuestionsSequentially(sampleQuestions);
