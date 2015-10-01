var express = require('express');
var router = express.Router();
var request = require('request');
var worldBankIndicators = require('../../models/worldBankIndicators.json');


//mongoose.collection.createIndex({"people.languages.text":"text"});
/* POST users listing. */
router.get('/:abbrev', function(req, res, next) {

  var combinedIndicators = '';
  worldBankIndicators.forEach(function(item,index){
    combinedIndicators += item.indicatorCode +';';
  });

  combinedIndicators = combinedIndicators.substring(0,combinedIndicators.length-1);
  var worldBankAPIQuery = 'http://api.worldbank.org/country/' + req.params.abbrev + '/indicator/' + combinedIndicators + '?source=2&per_page=100&date=2006:2015&format=json';

  request(worldBankAPIQuery, function (err, response, body) {
    if (!err && response.statusCode == 200) {

      var data = JSON.parse(body);
      //console.log(data);
      data.shift();
      data = data[0];
      var compiledIndicators = [];
      var indicatorObj = {};
      var year = '2005';
      var lastId = data[0].indicator.id;
      data.forEach(function(indicator){

        if(indicator.indicator.id != lastId){
          compiledIndicators.push(indicatorObj);
          indicatorObj={};
          year = '2005';
        }

        if(indicator.date > year && indicator.value){
          year = indicator.date;
          indicatorObj.indicator = indicator.indicator.value;
          indicatorObj.value = indicator.value;
          indicatorObj.year = year;
        }

        lastId = indicator.indicator.id;
        // console.log(indicatorObj);


      });
      //console.log(compiledIndicators);
      res.json(compiledIndicators);
    }

    if(err){
      next(err);
    }

  });

  //request('http://www.google.com', function (error, response, body) {
  //  if (!error && response.statusCode == 200) {
  //    console.log(body); // Show the HTML for the Google homepage.
  //  } else if(error){
  //    console.log(error);
  //  }
  //});





});

module.exports = router;
