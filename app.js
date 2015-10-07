var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

var index = require('./routes/index');
var register = require('./routes/api/register');
var login = require('./routes/api/login');
var logout = require('./routes/api/logout');
var worldFactbook = require('./routes/api/worldFactbook');
var userCountries = require('./routes/api/userCountries');
var questionnaire = require('./routes/api/questionnaire');
var worldBank = require('./routes/externalAPIs/worldBankData');
var mediWiki = require('./routes/externalAPIs/mediWiki');

var Users = require('./models/users');

//Passport Strategies
var BearerStrategy = require('passport-http-bearer');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var GOOGLE_OAUTH_CALLBACK = process.env.GOOGLE_OAUTH_CALLBACK;
var JwtStrategy = require('passport-jwt').Strategy;
var opts = {};
opts.secretOrKey = process.env.jwtSecret;
opts.passReqToCallback = true;
//var expressJwt = require('express-jwt');
//var jsonwebtoken = require('jsonwebtoken');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Bring Mongoose into the app
var mongoose = require('mongoose');

// Build the connection string
var dbURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/NextPat';

// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);

});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);

});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

app.use(favicon(path.join(__dirname, 'public', './images/NextPatLogo.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

//passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
//        console.log('Checking user in passport JwtStrategy!', jwt_payload.sub);
//        Users.findOne({username: jwt_payload.sub}, function (err, user) {
//            if (err) {
//                //req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.');
//                throw err;
//            }
//
//            if (!user) {
//                console.log('nouser');
//                return done(null, false);//, req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.'));
//            }
//
//            user.comparePassword(password, function (err, isMatch) {
//                if (err) {
//                    throw err;
//                }
//                if (isMatch) {
//                    return done(null, user);
//                } else {
//                    done(null, false);//, req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.'));
//                }
//            });
//        });
//    })
//);

passport.use('local', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'username'
    },
    function (req, username, password, done) {
        Users.findOne({username: username}, function (err, user) {
            if (err) {
                //req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.');
                throw err;
            }

            if (!user) {
                console.log('nouser');
                return done(null, false);//,req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.'));
            }

            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    done(null, false);//,req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.'));
                }
            });
        });
    }));

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_OATH_CALLBACK || "http://127.0.0.1:3000/api/login/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        googleUser = {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            username: profile.emails[0].value,
            access_token: accessToken
        };

        Users.findOne({username: googleUser.username}, function (err, user) {
            if (user) {
                return done(err, user);
            } else {
                var newGoogleUser = new Users(googleUser);
                newGoogleUser.save(function (err, user) {
                    //if(err) {
                    //    res.json(401, { error: 'message' });
                    //}else {
                    //    res.redirect('/');
                    //}
                    return done(err, user);
                });

            }
        });

    }
));

//passport.use(
//    new BearerStrategy(
//        function(token, done) {
//            var decoded = jasonwebtoken.decode(token,process.env.jwtSecret);
//            console.log(decoded);
//            Users.findOne({ access_token: token },
//                function(err, user) {
//                    if(err) {
//                        return done(err)
//                    }
//                    if(!user) {
//                        return done(null, false)
//                    }
//
//                    return done(null, user, { scope: 'all' })
//                }
//            );
//        }
//    )
//);

app.use('/', index);
app.use('/api/register', register);
app.use('/api/worldFactbook', worldFactbook);
app.use('/api/userCountries', userCountries);
app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/questionnaire', questionnaire);
app.use('/externalAPIs/worldBankData',worldBank);
app.use('/externalAPIs/mediWiki',mediWiki);
//app.use('/worldFactbook/*', expressJwt({secret: process.env.jwtSecret}));
app.use('/*', function (req, res, next) {
    if (req.url.contains('.')) { // exclude files
        next();
    } else {
        res.redirect('/#' + req.url);
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
