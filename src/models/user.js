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
  googleID: String,
  password: {
    type: String,
    minlength: 8,
    trim: true,
  },
  collegeName: {
    type: String,
    trim: true,
  },
  isManager: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  pImage: String,
  cImage: String,
  idImage: String,
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const User = mongoose.model("User", userSchema);

module.exports = User;
