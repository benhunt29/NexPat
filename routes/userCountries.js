var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userCountries = require('../models/userCountries');

//mongoose.collection.createIndex({"people.languages.text":"text"});
/* POST users listing. */
router.post('/', function(req, res, next) {

  if (req.body.languageOption === 'true'){
    var query = req.body.language;


    WorldFactbook.find({$text:{$search:query}},function(err,results){

      if(err){
        next(err);
      }else{
        var returnedCountries = countriesList(results);
        res.json(returnedCountries);
      }
    });

  } else{

    var userCountry = {
      username: "test",
      userCountries: ['france','spain','germany']
    };
    var obj = req.body;
    var id = obj._id;
    delete obj._id;
    if (id) {

      userCountries.findByIdAndUpdate(id, {userCountries: obj.userCountries}, function(err,results){

        if(err){
          next(err);
        }else{
          res.json(results);
        }
      });
    }else{
      userCountries.create(obj, function(err,results){
        if(err) {
          next(err);
        }else{
          res.json(results);
        }
      });
    }

  }

});

module.exports = router;
