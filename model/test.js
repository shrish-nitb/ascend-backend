// test {}
//  _id, object id, autofill
//  instructions, string, mandatory
//  sections [{}...]
//      name, string, mandatory
//      questions [{}...], objects array, mandatory
//          _id (foreign key Question), object id, mandatory
//          positives, number, mandatory
//          negatives, number, mandatory
//      duration, number, mandatory
//  duration, number, mandatory

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    ref: 'Question', 
    required: true,
  },
  positives: {
    type: Number,
    required: true,
  },
  negatives: {
    type: Number,
    required: true,
  },
});

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: {
    type: [questionSchema],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const testSchema = new mongoose.Schema({
  instructions: {
    type: String,
    required: true,
  },
  sections: {
    type: [sectionSchema],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
