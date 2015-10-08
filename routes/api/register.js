var express = require('express');
var router = express.Router();
var Users = require('../../models/users');

/* GET users listing. */
router.post('/', function(req, res, next) {

  if (req.body.firstName === undefined || !req.body.firstName.length) {
    console.log("First Name Required.");
    res.status(400).send("First Name Required.");
  } else if (req.body.lastName === undefined || !req.body.lastName.length) {
    console.log("Last Name Required.");
    res.status(400).send("Last Name Required.");
  } else if(req.body.username === undefined || !req.body.username.length){
    console.log("Username Required.");
    res.status(400).send("Username Required.");
  } else if (req.body.password === undefined || !req.body.password.length) {
    console.log("Password Required.");
    res.status(400).send("Password Required.");
  } else if (req.body.password !== req.body.passwordConfirm) {
    console.log("Password Must Match Confirmation.");
    res.status(400).send("Password Must Match Confirmation.");
  } else if (req.body.email === undefined || !req.body.email.length) {
    console.log("Email Required.");
    res.status(400).send("Email Required.");
  }

  Users.findOne({ $or:[ {'username':req.body.username}, {'email':req.body.email} ]},function(err,user){
    if (err){
      next(err);
    } else if (user){
      if (user.username == req.body.username){
        res.json(409,{error: "That username is taken!"});

      } else if(user.email == req.body.email){
        res.json(409,{error: "That email has already been registered!"});
      }
    } else{
      var newUser = new Users(req.body);
      newUser.save(function(err,post){
        if(err) {
          next(err);
        }else {
          res.status(200).redirect('/');
        }
      });
    }
  });

});

module.exports = router;
