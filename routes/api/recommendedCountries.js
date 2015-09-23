var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var recommendedCountries = require('../../models/recommendedCountries');

//mongoose.collection.createIndex({"people.languages.text":"text"});
/* POST users listing. */
router.post('/', function(req, res, next) {

    var obj = req.body;
    var id = obj._id;
    if (id) {

      recommendedCountries.findById(id, function(err,userRecommendedCountries){

        if(err){

          next(err);

        }else{

          userRecommendedCountries.recommendedCountries = obj.recommendedCountries;
          userRecommendedCountries.save(function(err){

            if(err) {
              next(err);

            }else {

              res.send(JSON.stringify(obj));
            }

          });
        }
      });

    }else{

      var userRecommendedCountries = new recommendedCountries(req.body);

      userRecommendedCountries.save(function(err){
        if(err) {
          next(err);
        }else {
          res.send(JSON.stringify(obj));
        }
      });
    }
});

module.exports = router;
