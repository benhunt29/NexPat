var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/:country', function(req, res, next) {

  var mediWikiQuery = 'https://en.wikipedia.org/w/api.php/w/api.php?action=query&prop=imageinfo&format=json&iiprop=url&iiurlwidth=220&titles=File%3A' + 'Flag_of_' + req.params.country + '.svg';

  request(mediWikiQuery, function (err, response, body) {
    if (!err && response.statusCode == 200) {
        var data = JSON.parse(body);
        res.json(data.query.pages['-1'].imageinfo[0].thumburl);
    }

    if(err){
      next(err);
    }

  });

});

module.exports = router;
