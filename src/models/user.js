const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    // required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 8,
    trim: true,
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  // ============== Passpot JS ======================

  return user;
};

module.exports = User;
