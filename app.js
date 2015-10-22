//dependencies
const
    express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport');

//routes
const
    routes = require('./routes/index'),
    register = require('./routes/api/register'),
    login = require('./routes/api/login'),
    logout = require('./routes/api/logout'),
    worldFactbook = require('./routes/api/worldFactbook'),
    questionnaire = require('./routes/api/questionnaire'),
    worldBank = require('./routes/externalAPIs/worldBankData'),
    mediWiki = require('./routes/externalAPIs/mediWiki');

//db models
var Users = require('./models/users');

//Passport Strategies
const
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//Google oauth variables
const
    GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_OAUTH_CALLBACK = process.env.GOOGLE_OAUTH_CALLBACK;
var opts = {
    secretOrKey: process.env.jwtSecret,
    passReqToCallback: true
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

//middleware to use
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
        callbackURL: GOOGLE_OAUTH_CALLBACK || "http://127.0.0.1:3000/api/login/auth/google/callback"
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
                    return done(err, user);
                });

            }
        });

    }
));

//Routes to use
app.use('/api/register', register);
app.use('/api/worldFactbook', worldFactbook);
app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/questionnaire', questionnaire);
app.use('/externalAPIs/worldBankData',worldBank);
app.use('/externalAPIs/mediWiki',mediWiki);
app.use('*', routes);

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
