const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const aggregatePaginate = require('mongoose-aggregate-paginate');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profileImage: {
    type: String,
  },

}, {
  timestamps: true
});
userSchema.plugin(aggregatePaginate);
userSchema.plugin(mongoosePaginate);
const User = mongoose.model('user', userSchema);


module.exports = User;
