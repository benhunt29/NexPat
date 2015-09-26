var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var WorldFactbook = require('../../models/WorldFactbook');
var countriesList = require('../../modules/countryData');

//mongoose.collection.createIndex({"people.languages.text":"text"});
/* POST users listing. */
router.post('/', function(req, res, next) {
  if (req.body.languageOption){
    var query = req.body.language;

    WorldFactbook.find({$text:{$search:query}},function(err,results){

      if(err){
        next(err);
      }else{

        //results.forEach(function(item,index){
        //  var returnedCountry = {};
        //  returnedCountry.countryName = item.name.name;
        //  returnedCountry.laborAg = parseFloat(item.econ.labor_force_by_occupation.agriculture);
        //  returnedCountry.laborInd = parseFloat(item.econ.labor_force_by_occupation.industry);
        //  returnedCountry.laborSvc = parseFloat(item.econ.labor_force_by_occupation.services);
        //  returnedCountry.climate = item.geo.climate.text;
        //  returnedCountry.per_capita_ppp = item.econ.gdp_per_capita_ppp.text;
        //
        //  if(returnedCountry.per_capita_ppp) {
        //    returnedCountry.per_capita_ppp = parseFloat(returnedCountry.per_capita_ppp.match(/([^\s]+)/)[0].replace(/[^\d\.]/g,''));
        //
        //}
        //  returnedCountry.per_capita_ppp = parseFloat(returnedCountry.per_capita_ppp);
        //  returnedCountry.urban_population = parseFloat(item.people.urbanization.urban_population);
        //  returnedCountry.median_age = parseFloat(item.people.median_age.total);
        //  returnedCountry.internetUsage = parseFloat(item.comm.internet_users.text)/parseFloat(item.people.population.text);
        //  returnedCountries.push(returnedCountry);
        //
        //});
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
