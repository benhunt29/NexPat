var express = require('express');
var router = express.Router();
var request = require('request');
var worldBankIndicators = require('../../models/worldBankIndicators.json');

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
      //start at year 2005
      var year = '2005';
      //initialize lastId to first entry
      var lastId = data[0].indicator.id;
      //loop through data to find latest entry
      data.forEach(function(indicator){

        //push object and reset values
        if(indicator.indicator.id != lastId && Object.keys(indicatorObj).length !=0){
          compiledIndicators.push(indicatorObj);
          indicatorObj={};
          year = '2005';
        }

        //if more recent entry exists, compile object to push
        if(indicator.date > year && indicator.value && indicator.value !=0){
          year = indicator.date;
          indicatorObj.indicator = indicator.indicator.value;
          indicatorObj.value = indicator.value;
          indicatorObj.year = year;
        }

        //reset lastId to current entry id
        lastId = indicator.indicator.id;

      });
      res.json(compiledIndicators);
    }

    if(err){
      next(err);
    }

  });

});

module.exports = router;
