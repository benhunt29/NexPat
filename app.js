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
var recommendedCountries = require('./routes/api/recommendedCountries');
var questionnaire = require('./routes/api/questionnaire');
var Users = require('./models/users');
//var questionnaire = require('./routes/api/questionnaire');
//var session = require('express-session');
//var flash = require('express-flash');

//Passport Strategies
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GOOGLE_CLIENT_ID = '466944027920-6l7mdc2q5nghcpmkqrv10lphoe3f78v8.apps.googleusercontent.com';
var GOOGLE_CLIENT_SECRET = 'bBCiwuKRLS_27tvHIU_0dFQM';
var JwtStrategy = require('passport-jwt').Strategy;
var opts = {};
opts.secretOrKey = 'supersecret';
opts.passReqToCallback = true;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Bring Mongoose into the app
var mongoose = require('mongoose');

// Build the connection string
var dbURI = 'mongodb://localhost:27017/NextPat';

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

//mongoose.connection.db.collection('WorldFactbook', function(err,collection){
//  //console.log(collection);
//});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
//app.use(flash());

//passport.serializeUser(function (user, done) {
//    done(null, user.id);
//});
//
//passport.deserializeUser(function (id, done) {
//    User.findById(id, function (err, user) {
//        if (err) {
//            done(err);
//        }
//        done(null, user);
//    });
//});

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        console.log('Checking user in passport JwtStrategy!', jwt_payload.sub);
        User.findOne({username: jwt_payload.sub}, function (err, user) {
            if (err) {
                //req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.');
                throw err;
            }

            if (!user) {
                console.log('nouser');
                return done(null, false);//, req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.'));
            }

            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    done(null, false);//, req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.'));
                }
            });
        });
    })
);

passport.use('local',new LocalStrategy({ passReqToCallback:true,
        usernameField:'username'},
    function(req,username,password,done){
        Users.findOne({ username: username },function(err,user){
            if(err) {
                //req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.');
                throw err;
            }

            if(!user){
                console.log('nouser');
                return done(null,false);//,req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.'));
            }

            user.comparePassword(password, function(err,isMatch){
                if(err) {
                    throw err;
                }
                if(isMatch){
                    return done(null,user);
                }else {
                    done(null, false);//,req.flash('incorrectCredentialsMsg', 'Incorrect username and/or password.'));
                }
            });
        });
    }));

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/api/login/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));

app.use('/', index);
app.use('/api/register', register);
app.use('/api/worldFactbook', worldFactbook);
//app.use('/api/questionnaire',questionnaire);
app.use('/api/userCountries', userCountries);
app.use('/api/recommendedCountries', recommendedCountries);
app.use('/api/login', login);
app.use('api/logout',logout);
app.use('/api/questionnaire',questionnaire);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
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
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
