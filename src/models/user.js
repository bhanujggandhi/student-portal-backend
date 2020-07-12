const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    trim: true,
  },
  lName: {
    type: String,
    trim: true,
  },
  wNumber: {
    type: Number,
    minlength: 10,
    maxlength: 10,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 8,
    trim: true,
  },
  collegeName: {
    type: String,
    trim: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  pImage: String,
  cImage: String,
});

// Profile Photo
// College Logo
// College ID for verification

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const User = mongoose.model("User", userSchema);

module.exports = User;
