const mongoose = require("mongoose");
const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    fullname: String,
    email: String,
    password: String,
    address: String,
    city: String,
    state: String,
    zipcode: Number,
    phone: Number,
    active: Boolean,
  },
  { collection: "users" }
);

const User = model("User", userSchema);

module.exports = User;
