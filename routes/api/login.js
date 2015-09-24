var express = require('express');
var router = express.Router();
var passport = require('passport');
var Users = require('../../models/users');
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

router.post('/', function(req, res, next) {
    passport.authenticate('local', {session:false},function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.json(401, { error: 'message' });
        }

        //user has authenticated correctly thus we create a JWT token
        //var token = jwt.encode({ username: 'somedata'}, tokenSecret);
        var token = jsonwebtoken.sign(user, 'supersecret', {
            expiresInMinutes: 1440 // expires in 24 hours
        });
        res.json(token);

    })(req, res, next);
});

module.exports = router;