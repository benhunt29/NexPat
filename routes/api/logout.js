var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jsonwebtoken = require('jsonwebtoken');

/* POST /api/login/ */
//router.post('/', passport.authenticate('local',{session:false}),
//    function (req, res, next) {
//      //Users.getAuthenticated(req.body, function (err, token) {
//      //  if (err) {
//      //    console.log(err.message);
//      //    res.status(400).send(err.message);
//      //  } else {
//      //    res.send(token);
//      //  }
//      //});
//      res.send(req.user.profile);
//});


router.get('/',function(req,res,next){
    req.logout();
    res.sendStatus(200);
});

module.exports = router;