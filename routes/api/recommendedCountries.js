var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var recommendedCountries = require('../../models/recommendedCountries');

//mongoose.collection.createIndex({"people.languages.text":"text"});
/* POST users listing. */
router.post('/', function(req, res, next) {

  var obj = req.body;
  var id = obj.recommendedCountries;

  recommendedCountries.findOne({username: obj.username}, function (err, userRecommendations) {

    if (err) {
      next(err);
    } else if (userCountryList) {

      userRecommendations.recommendedCountries = obj.recommendedCountries;
      userRecommendations.save(function (err) {

        if (err) {
          next(err);
        } else {
          res.send(JSON.stringify(obj));
        }
      });

    } else {
      var newUserRecommendations = new recommendedCountries(req.body);

      newUserRecommendations.save(function (err) {
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
