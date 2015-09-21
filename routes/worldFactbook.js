var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var WorldFactbook = require('../models/WorldFactbook');

/* GET users listing. */
router.post('/', function(req, res, next) {
  if (req.body.searchParams){
    var query = req.body.searchParams;
    WorldFactbook.find(query,function(err,results){

      if(err){
        next(err);
      }else{
        res.json(results);
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
