const express = require("express");
const router = express.Router();
const { ObjectID } = require("bson");

const jwtManager = require("../jwt/jwtManager");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/user");
const hasher = require("bcryptjs");

//LOGIN
// api/v1/auth/login
router.post("/login", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((doc) => {
    if (doc && hasher.compareSync(req.body.password, doc.password)) {
      const data = {};
      data.email = doc.email;
      data.fullname = doc.fullname;
      data._id = doc._id;
      data.city = doc.city;
      data.state = doc.state;
      const token = jwtManager.generate(data);

      res.cookie("accessToken", token);
      res.json({
        result: token,
        status: "success",
        userId: data._id,
        userFullname: data.fullname,
        city: data.city,
        state: data.state,
      });
    } else {
      res.json({ status: "invalid_user" });
    }
  });
});

//SIGNUP
// api/v1/auth/signup
router.post("/signup", function (req, res, next) {
  const email = req.body.email;
  const password = hasher.hashSync(req.body.password, 12);

  User.findOne({ email: email }).then((doc) => {
    if (!doc) {
      let newUser = new User({
        _id: new ObjectID(),
        fullname: req.body.fullname,
        email: req.body.email,
        password: password,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        phone: req.body.phone,
        active: true,
      });
      newUser.save(function (err, user) {
        if (err) return console.error(err);
        console.log(user.fullname + " is saved to database");
        res.json({ status: "success" });
      });
    } else {
      res.json({ status: "user exist" });
    }
  });
});

module.exports = router;
