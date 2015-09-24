var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userCountries = require('../../models/userCountries');

//mongoose.collection.createIndex({"people.languages.text":"text"});
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
          res.send(JSON.stringify(obj));
        }
      });

    } else {
      var newUserCountryList = new userCountries(req.body);

      newUserCountryList.save(function (err) {
        if (err) {
          next(err);
        } else {
          res.send(JSON.stringify(obj));
        }
      });
    }
  })
});

module.exports = router;
