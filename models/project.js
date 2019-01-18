var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  customerName: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  projectName: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  dataSize: {
    type: String,
    required: true,
  },
  dataLocation: {
    type: String,
    required: true,
  },
  numberOfAppliances: {
    type: String,
    require: true,
  },
  numberOfAws: {
    type: String,
    require: true,
  }
});