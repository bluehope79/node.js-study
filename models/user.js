const mongoose = require('mongoose');
useMongoClient: true;

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  displayName: String,
  uploadfile: Array

})
//db.users.find()
module.exports = mongoose.model('user', UserSchema); //user에 s가 자동으로 붙음
