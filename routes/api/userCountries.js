var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userCountries = require('../../models/userCountries');
var passport = require('passport');

//mongoose.collection.createIndex({"people.languages.text":"text"});

router.get('/:username', passport.authenticate('bearer',{session:false}), function(req, res, next) {
  var obj = req.params;
  console.log(req.user);

  userCountries.findOne({username: obj.username}, function (err, userCountries) {

    if (err) {
      next(err);
    } else {
      res.json(userCountries.userCountries);
    }
  });
});

/* POST users listing. */
router.post('/', function(req, res, next) {

  var obj = req.body;
  var id = obj.userCountries;
  console.log(obj);

  userCountries.findOne({username: obj.username}, function (err, userCountryList) {

    if (err) {
      next(err);
    } else if (userCountryList) {

      userCountryList.userCountries = obj.userCountries;
      userCountryList.save(function (err) {

        if (err) {
          next(err);
        } else {
          res.sendStatus(200);
        }
      });

    } else {
      var newUserCountryList = new userCountries(req.body);

      newUserCountryList.save(function (err) {
        if (err) {
          next(err);
        } else {
          res.sendStatus(200);
        }
      });
    }
  })
});

module.exports = router;
