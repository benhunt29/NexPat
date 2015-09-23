var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userCountries = require('../../models/userCountries');

//mongoose.collection.createIndex({"people.languages.text":"text"});
/* POST users listing. */
router.post('/', function(req, res, next) {

    var obj = req.body;
    var id = obj._id;
    if (id) {

      userCountries.findById(id, function(err,userCountryList){

        if(err){

          next(err);

        }else{

          userCountryList.userCountries = obj.userCountries;
          userCountryList.save(function(err){

            if(err) {
              next(err);

            }else {

              res.send(JSON.stringify(obj));
            }

          });
        }
      });

    }else{

      var userCountryList = new userCountries(req.body);

      userCountryList.save(function(err){
        if(err) {
          next(err);
        }else {
          res.send(JSON.stringify(obj));
        }
      });
    }
});

module.exports = router;
