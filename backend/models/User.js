const mongoose = require("mongoose");



// User Schema
const UserSchema = new mongoose.Schema({
  // username: { type: String, required: true },
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
