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

  //if (req.body.firstName === undefined || !req.body.firstName.length) {
  //  console.log("First Name Required.");
  //  res.status(400).send("First Name Required.");
  //} else if (req.body.lastName === undefined || !req.body.lastName.length) {
  //  console.log("Last Name Required.");
  //  res.status(400).send("Last Name Required.");
  //} else if(req.body.username === undefined || !req.body.username.length){
  //  console.log("Username Required.");
  //  res.status(400).send("Username Required.");
  //} else if (req.body.password === undefined || !req.body.password.length) {
  //  console.log("Password Required.");
  //  res.status(400).send("Password Required.");
  //} else if (req.body.password !== req.body.passwordConfirm) {
  //  console.log("Password Must Match Confirmation.");
  //  res.status(400).send("Password Must Match Confirmation.");
  //} else if (req.body.email === undefined || !req.body.email.length) {
  //  console.log("Email Required.");
  //  res.status(400).send("Email Required.");
  //}

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
        newUser.save(function (err, post) {
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
