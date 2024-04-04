const mongoose = require('mongoose');
const emailSchema = new mongoose.Schema({
    sender: String,
    subject: String,
    body: String,
    date: Date,
    messageId: String, 
    forwarded: {
        type: Boolean,
        default: false, 
      },    
  });
    
  const Email = mongoose.model('Email', emailSchema);
  
  module.exports = Email;
  