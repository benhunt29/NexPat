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

            return res.json(401, { error: 'Incorrect username and/or password!' });
        }

        //user has authenticated correctly thus we create a JWT token
        //var token = jwt.encode({ username: 'somedata'}, tokenSecret);
        var userToBeTokenized = { username: user.username };
        var token = jsonwebtoken.sign(userToBeTokenized, process.env.jwtSecret, {
            expiresInMinutes: 1440 // expires in 24 hours
        });
        res.json(token);

    })(req, res, next);
});

router.get('/auth/google', function(req,res,next) {
    passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read'] })(req, res, next);
});

//router.get('/auth/google/callback', function(req,res,next) {
//    passport.authenticate('google', {failureRedirect: '/' },function(err, user, info) {
//        if (err) { return next(err) }
//        if (!user) {
//            return res.json(401, { error: 'message' });
//        }
//
//        //user has authenticated correctly thus we create a JWT token
//        //var token = jwt.encode({ username: 'somedata'}, tokenSecret);
//        var token = jsonwebtoken.sign(user, 'supersecret', {
//            expiresInMinutes: 1440 // expires in 24 hours
//        });
//        res.json(token);
//
//    })(req, res, next);
//});

router.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: "/" }),
    function(req, res) {
        var userToBeTokenized = { username: req.user.username };
        var token = jsonwebtoken.sign(userToBeTokenized, process.env.jwtSecret, {
            expiresInMinutes: 1440 // expires in 24 hours
        });
        res.redirect("/?access_token=" + token);
    }
);



// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
router.get('/auth/google/return',
    passport.authenticate('google', { successRedirect: '/',
        failureRedirect: '/' }));

module.exports = router;