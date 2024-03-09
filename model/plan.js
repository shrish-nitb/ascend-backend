//  plan
//      _id
//      name, string, required
//      description, string, required
//      price, number, default 0
//      test, array of object id, ref Test, default []
//      questions, array of object id, ref Question, default []
//      hackbooks, array of object id, default []
//      media, array of string, default []

const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number, //paise
    default: 0,
  },
  validity: {
    type: Number, //days
    default: 0,
  },
  test: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      default: [],
    },
  ],
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: [],
    },
  ],
  hackbooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
  ],
  media: {
    type: [String],
    default: [],
  },
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;