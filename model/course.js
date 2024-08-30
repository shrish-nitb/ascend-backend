const mongoose = require("mongoose");


// const questionSchema = new mongoose.Schema({
//     _id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Question",
//       required: true,
//       unique: false, 
//     },
    
//   });
// Resource Schema
const resourceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        default: "",
    },
    questions: { 
        type: [String],
        required: true,
        default: [],
    },
});

// Topic Schema
const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Resource',
        required: true,
        default: {},
    },
});

// Section Schema
const sectionSchema = new mongoose.Schema({
    sectionNumber: {
        type: Number,
        required: true,
    },
    sectionTitle: {
        type: String,
        required: true,
    },
    topics: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:'CourseTopic',
        default: [],
    },
});

// Category Schema
const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    sections: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Section',
        default: [],
    },
});

// Models
const Category = mongoose.model('Category', categorySchema);
const Section = mongoose.model('Section', sectionSchema);
const CourseTopic = mongoose.model('CourseTopic', topicSchema);
const Resource = mongoose.model('Resource', resourceSchema);

module.exports = { Category, CourseTopic, Section, Resource };
