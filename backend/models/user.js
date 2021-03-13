const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//this will give us an error if we try to save an user with an email that already exists
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
