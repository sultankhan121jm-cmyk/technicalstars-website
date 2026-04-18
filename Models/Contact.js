const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true
  },
  lname: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  service: {
    type: String,
    required: true,
    enum: ['ac', 'plumbing', 'electric', 'other'] // Ensures only these values are accepted
  },
  address: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    default: 'new' // new, contacted, completed
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Contact', contactSchema);