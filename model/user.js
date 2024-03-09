const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question', 
    required: true,
  },
  order:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', 
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
})

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  joinedOn: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    default: ""
  },
  plans: {
    type: [planSchema],
    default: [],
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;