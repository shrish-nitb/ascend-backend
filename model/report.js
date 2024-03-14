//report {}
// _id, object id, autofill, mandatory
// test, foreign key(Test), object id, mandatory
// user, foreign key(User), mandatory
// points, number, default 0
//  sections [{}...]
//      name, string, mandatory
//      questions [{}...], objects array, mandatory
//          _id (foreign key Question), object id, mandatory
//          positives, number, mandatory
//          negatives, number, mandatory
//          points, default 0, number
//          duration, number, default -1
//      duration, number, mandatory
//      start, default -1, number
//      end, default -1, number
//  duration, number, mandatory
//  start, default -1, date
//  end, default -1, date
//  submitted, default false, boolean, mandatory

const mongoose = require("mongoose");

const { Answer } = require("./question");

const reportSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  positives:{
    type: Number,
    default: 0,
  },
  negatives:{
    type: Number,
    default: 0,
  },
  maximum: {
    type: Number,
    default: 0,
  },
  size: {
    type: Number,
    default: 0,
  },
  sections: [
    {
      name: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        default: 0,
      },
      maximum: {
        type: Number,
        default: 0,
      },
      size: {
        type: Number,
        default: 0,
      },
      positives:{
        type: Number,
        default: 0,
      },
      negatives:{
        type: Number,
        default: 0,
      },
      questions: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          marked: {
            type: String,
            default: "",
          },
          status: {
            type: Number,
            default: 0,
            //0:    Not Visited
            //1:    Answered
            //2:    Answered and Marked for Review
            //3:    Marked for Review
            //4:    Not Answered
          },
          positives: {
            type: Number,
            required: true,
          },
          negatives: {
            type: Number,
            required: true,
          },
          points: {
            type: Number,
            default: 0,
          },
          duration: {
            type: Number,
            default: 0,
          },
        },
      ],
      duration: {
        type: Number,
        required: true,
      },
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
    },
  ],
  duration: {
    type: Number,
    required: true,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  submitted: {
    type: Boolean,
    default: false,
    required: true,
  },
});


const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
