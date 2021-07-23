var express = require("express");
var router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const { ObjectID } = require("bson");

//display list of posts
//show request by city and pagination
// router.get("/requests/:state/:city/:page", (req, res) => {
  router.get("/requests/:state/:city/", (req, res) => {


// const postPerPage = 25;
  // const page = Math.max(0, req.params.page - 1);

  Post.find({
    type: "Help Requests",
    state: req.params.state,
    city: req.params.city,
  })
    .sort({ createdAt: -1 })
    // .limit(postPerPage)
    // .skip(postPerPage * page)
    .exec(function (err, post) {
      if (err) return handleError(err);

      console.log(post);
      if (post.length != 0) {
        res.json(post);
      } else {
        res.json({ status: "max" });
      }
    });
});

//show provider by city and pagination
// router.get("/providers/:state/:city/:page", (req, res) => {
  router.get("/providers/:state/:city/", (req, res) => {

// const postPerPage = 25;
  // const page = Math.max(0, req.params.page - 1);

  Post.find({
    type: "Service Providers",
    state: req.params.state,
    city: req.params.city,
  })
    .sort({ createdAt: -1 })
    // .limit(postPerPage)
    // .skip(postPerPage * page)
    .exec(function (err, post) {
      if (err) return handleError(err);

      console.log(post);
      if (post.length != 0) {
        res.json(post);
      } else {
        res.json({ status: "max" });
      }
    });
});

//get one post
router.get("/:id", (req, res) => {
  Post.find({ _id: req.params.id }).exec(function (err, post) {
    if (err) return handleError(err);

    console.log(post);
    res.json(post);
  });
});

//add post with expiry time
router.post("/", function (req, res, next) {
  console.log(req._id);
  const date = new Date();
  let newPost = new Post({
    _id: new ObjectID(),
    createdAt: date,
    fullname: req.fullname,
    type: req.body.type,
    content: req.body.content,
    city: req.body.city,
    state: req.body.state,
    comments: [],
    ownerId: req._id,
    checkIn: date, //add check-in date
  });
  newPost.save(function (err, post) {
    if (err) return console.error(err);
    console.log("post is saved to database");
    res.json({ status: "success" });
  });
});

//update post
router.put("/:id", (req, res) => {
  Post.findOneAndUpdate(
    { _id: new ObjectID(req.params.id), ownerId: req._id },

    {
      $set: {
        content: req.body.content,
        city: req.body.city,
        state: req.body.state,
      },
    },
    function (err, result) {
      if (err) return handleError(err);
      res.json({ status: "success" });
    }
  );
});

//delete post
router.delete("/:id", (req, res) => {
  Post.findOneAndDelete(
    { _id: new ObjectID(req.params.id), ownerId: req._id },

    function (err, result) {
      if (err) return handleError(err);
      res.json({ status: "success" });
    }
  );
});

//add comment
router.put("/:id/comments", (req, res) => {
  const date = new Date();

  const newComment = {
    createdAt: date,
    _id: new ObjectID(),
    fullname: req.fullname,
    commentContent: req.body.commentContent,
    commentOwnerId: req._id,
    checkIn: date, //add check-in date
  };
  Post.updateOne(
    { _id: new ObjectID(req.params.id) },
    { $push: { comments: newComment } },
    function (err, result) {
      if (err) return handleError(err);
      res.json({ status: "success" });
    }
  );
});

//edit comment
router.put("/:id/comments/:comId", (req, res) => {
  Post.findOneAndUpdate(
    {
      "comments._id": new ObjectID(req.params.comId),
      "comments.commentOwnerId": req._id,
    },
    { $set: { "comments.$.commentContent": req.body.commentContent } },
    function (err, result) {
      if (err) return handleError(err);
      res.json({ status: "success" });
    }
  );
});

//delete comment
router.delete("/:id/comments/:comId/delete", (req, res) => {
  Post.findOneAndUpdate(
    {
      "comments._id": new ObjectID(req.params.comId),
      "comments.commentOwnerId": req._id,
    },

    { $pull: { comments: { _id: new ObjectID(req.params.comId) } } },
    function (err, result) {
      if (err) return handleError(err);
      res.json({ status: "success" });
    }
  );
});

//update post checkin
router.put("/checkin/:id", (req, res) => {
  const date = new Date();
  Post.findOneAndUpdate(
    { _id: new ObjectID(req.params.id), ownerId: req._id },

    {
      $set: {
        checkIn: date,
      },
    },
    function (err, result) {
      if (err) return handleError(err);
      res.json({ status: "success" });
    }
  );
});

//update comment checkIn
router.put("/checkin/:id/comments/:comId", (req, res) => {
  const date = new Date();
  Post.findOneAndUpdate(
    {
      "comments._id": new ObjectID(req.params.comId),
      "comments.commentOwnerId": req._id,
    },
    { $set: { "comments.$.checkIn": date } },
    function (err, result) {
      if (err) return handleError(err);
      res.json({ status: "success" });
    }
  );
});

//get all follow post

router.get("/follow/:page", (req, res) => {
  const postPerPage = 5;
  const page = Math.max(0, req.params.page - 1);

  Post.find({
    $or: [{ ownerId: req._id }, { "comments.commentOwnerId": req._id }],
  })
    .sort({ createdAt: -1 })
    // .limit(postPerPage)
    // .skip(postPerPage * page)
    .exec(function (err, post) {
      if (err) return handleError(err);

      console.log(post);
      if (post.length != 0) {
        res.json(post);
      } else {
        res.json({ status: "max" });
      }
    });
});
module.exports = router;
