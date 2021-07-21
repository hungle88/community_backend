const mongoose = require("mongoose");
const { model, Schema } = require("mongoose");

const postSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    // created_date: String,
    createdAt: 
    { type: Date,  expires: 60*60*48  },

    fullname: String,
    type: String,
    content: String,
    city: String,
    state: String,
    ownerId: String,
    comments: Array,
    checkIn: Date
  },
  { collection: "posts" }
);

const Post = model("Post", postSchema);

module.exports = Post;
