const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan', 
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true,
  },
  paymentCallbackData: {
    type: Object, 
    default: {}
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt:{
    type: Date,
    default: Date.now,
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
