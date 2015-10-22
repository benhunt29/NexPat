var
  express = require('express'),
  router = express.Router(),
  Users = require('../../models/users'),
  expressValidator = require('express-validator');

router.use(expressValidator({
  customValidators: {
    passwordType: function (input) {
      return (input.match('(?=.*[!@#$%^&*])(?=.*[0-9])') != null);
    }
  }
}
));

/* GET users listing. */
router.post('/', function(req, res, next) {

  req.checkBody({
    'username': { //
      notEmpty: true, // won't validate if field is empty
      isAlphanumeric: {
        errorMessage: 'Username must be alphanumeric' // Error message for the validator, takes precedent over parameter message
      },
      isLength:{
        options: [4,100],
        errorMessage: 'Must be at least 4 characters long'
      }
    },
    'email': {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    'password': {
      notEmpty: true,
      isLength: {
        options: [8, 100],
        errorMessage: 'Password must be at least 8 characters'// pass options to the validator with the options property as an array
      },
      passwordType:{
        errorMessage: 'Password must contain at least one number and one special character'
      }
    },
    'firstName': { //
      optional: true, // won't validate if field is empty
      isAlpha: {
        errorMessage: 'Invalid first name' // Error message for the validator, takes precedent over parameter message
      }
    },
    'lastName': { //
      optional: true, // won't validate if field is empty
      isAlpha: {
        errorMessage: 'Invalid first name' // Error message for the validator, takes precedent over parameter message
      }
    }
  });

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.json(409,{error: errors.msg});
  } else {
    Users.findOne({$or: [{'username': req.body.username}, {'email': req.body.email}]}, function (err, user) {
      if (err) {
        next(err);
      } else if (user) {
        if (user.username == req.body.username) {
          res.json(409, {error: "That username is taken!"});

        } else if (user.email == req.body.email) {
          console.log(user);
          res.json(409, {error: "That email has already been registered!"});
        }
      } else {
        var newUser = new Users(req.body);
        newUser.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.status(200).redirect('/');
          }
        });
      }
    });
  }
});

module.exports = router;
