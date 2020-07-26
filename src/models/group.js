const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupNumber: Number,
  groupLink: String,
});

groupSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'group',
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
