var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var WorldFactbook = require('../../models/WorldFactbook');
var countriesList = require('../../modules/countryData');
var expressJwt = require('express-jwt');

router.post('/', expressJwt({secret:process.env.jwtSecret}), function(req, res, next) {
  if (req.body.languageOption){
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

    WorldFactbook.find({},function(err,results){

      if(err){
        next(err);
      }else{
        var returnedCountries = countriesList(results);
        res.json(returnedCountries);
      }
    });
  }

});

module.exports = router;
