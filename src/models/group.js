const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupNumber: Number,
  groupLink: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  },
});

const Group = mongoose.model('Group', groupSchema);
groupSchema.plugin(require('mongoose-autopopulate'));

module.exports = Group;
