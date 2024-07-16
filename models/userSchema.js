const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  image: { type: String },
  address: { city: String, state: String, pincode: Number },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
