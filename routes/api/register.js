var express = require('express');
var router = express.Router();
var Users = require('../../models/users');

/* GET users listing. */
router.post('/', function(req, res, next) {

  var user = new Users(req.body);
  user.save(function(err,post){
    if(err) {
      next(err);
    }else {
      res.redirect('/');
    }
  })
});

module.exports = router;
