var express = require("express");
var router = express.Router();
const User = require("../models/user");
const { ObjectID } = require("bson");

/* GET users listing. */
router.get("/", (req, res) => {
  User.find(function (err, person) {
    if (err) return handleError(err);

    console.log(person);
    res.json(person);
  });
});

//get one user
router.get("/:id", (req, res) => {
  User.find({ _id: req.params.id })
    .exec(function (err, person) {
      if (err) return handleError(err);

      console.log(person);
      res.json(person);
    });
});

//edit user
router.put("/:id", (req, res) => {
  User.findOneAndUpdate(
    { _id: new ObjectID(req.params.id) },
    {
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      phone: req.body.phone,
    },
    function (err, result) {
      if (err) return handleError(err);
      res.json({ status: "success" });
    }
  );
});

module.exports = router;
