var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var WorldFactbook = require('../models/WorldFactbook');

//mongoose.collection.createIndex({"people.languages.text":"text"});
/* POST users listing. */
router.post('/', function(req, res, next) {

  if (req.body.languageOption === 'true'){
    var query = req.body.language;
    var returnedCountries = [];

    WorldFactbook.find({$text:{$search:query}},function(err,results){

      if(err){
        next(err);
      }else{

        results.forEach(function(item,index){
          var returnedCountry = {};
          returnedCountry.name = item.name.name;
          returnedCountry.laborAg = item.econ.labor_force_by_occupation.agriculture;
          returnedCountry.laborInd = item.econ.labor_force_by_occupation.industry;
          returnedCountry.laborSvc = item.econ.labor_force_by_occupation.services;
          returnedCountry.climate = item.geo.climate.text;
          returnedCountry.per_capita_ppp = parseFloat(item.econ.gdp_per_capita_ppp.text.match(/([^\s]+)/)[0].replace(/[^\d\.]/g,''));
          returnedCountry.urban_population = parseFloat(item.people.urbanization.urban_population);
          returnedCountry.median_age = parseFloat(item.people.median_age.total);
          returnedCountry.internetUsage = item.people.population.text/item.comm.internet_users.text;
          returnedCountries.push(returnedCountry);

        });

        res.json(returnedCountries);
      }
    });

  } else{

    WorldFactbook.find({},function(err,results){

      if(err){
        next(err);
      }else{
        res.json(results);
      }
    });
  }

});

module.exports = router;
