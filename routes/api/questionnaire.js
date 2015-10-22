var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Questionnaire = require('../../models/questionnaire');
var expressJwt = require('express-jwt');

router.get('/:username', expressJwt({secret:process.env.jwtSecret}), function(req, res, next) {
  var obj = req.params;

  Questionnaire.findOne({username: obj.username}, function (err, userQuestionnaire) {

    if (err) {
      next(err);
    } else {
      if(userQuestionnaire){
        res.json(userQuestionnaire.questionResponses);
      }else{
        res.sendStatus(200);
      }
    }
  });
});

router.post('/', expressJwt({secret:process.env.jwtSecret}),function(req, res, next) {

  var obj = req.body;

  Questionnaire.findOne({username: obj.username}, function (err, userQuestionnaire) {

    if (err) {
      next(err);
    } else if (userQuestionnaire) {

      userQuestionnaire.questionResponses = obj.questionResponses;
      userQuestionnaire.save(function (err) {

        if (err) {
          next(err);
        } else {
          res.sendStatus(200);
        }
      });

    } else {
      var newUserQuestionnaire = new Questionnaire(req.body);

      newUserQuestionnaire.save(function (err) {
        if (err) {
          next(err);
        } else {
          res.sendStatus(200);
        }
      });
    }
  })
});

router.delete('/:username', expressJwt({secret:process.env.jwtSecret}), function(req, res, next) {
  var obj = req.params;

  Questionnaire.findOneAndRemove({username: obj.username}, function (err) {

    if (err) {
      next(err);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
