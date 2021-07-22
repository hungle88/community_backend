const mongoose = require("mongoose");
const { model, Schema } = require("mongoose");

const postSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    // created_date: String,
    createdAt: Date,

    fullname: String,
    type: String,
    content: String,
    city: String,
    state: String,
    ownerId: String,
    comments: Array,
    checkIn: Date,
  },
  { collection: "posts" }
);

const Post = model("Post", postSchema);

module.exports = Post;
