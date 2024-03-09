
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
  
  
  async function getQuestion() {}