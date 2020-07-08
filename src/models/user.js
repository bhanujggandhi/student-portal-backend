const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    trim: true,
  },
  // email: {
  //   type: String,
  //   // unique: true,
  //   // required: true,
  //   trim: true,
  //   lowercase: true,
  // },
  password: {
    type: String,
    minlength: 8,
    trim: true,
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
