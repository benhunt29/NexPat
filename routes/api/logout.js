var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/',function(req,res,next){
    req.logout();
    res.sendStatus(200);
});

module.exports = router;