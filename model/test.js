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

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
    unique: false, 
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
  maximum: {
    type: Number,
    default: 0,
  },
  size: {
    type: Number,
    default: 0,
  }
});

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
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
  maximum: {
    type: Number,
    default: 0,
  },
  size: {
    type: Number,
    default: 0,
  }
});

testSchema.pre('save', function (next) {
  this.size = 0;
  this.maximum = 0;
  this.sections.map((section) => {
    let temp = 0;
    section.maximum = 0;
    section.questions.forEach((question) => {
      temp++;
      section.maximum += question.positives;
    });
    this.maximum += section.maximum;
    section.size = temp;
    this.size += section.size;
    return section;
  });

  next();
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
