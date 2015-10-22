var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/:country', function(req, res, next) {

    var countryName = req.params.country;

    if (countryName == "Ireland"){
        var altCountryName = "Republic of " + countryName;
    }

    var mediWikiParseQuery = 'https://en.wikipedia.org/w/api.php/w/api.php?action=parse&format=json&page=' + encodeURI(altCountryName || countryName) + '&prop=images';

    request(mediWikiParseQuery, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            var images = data.parse.images;
            var isFlagImage = false;
            var flagImageName ='';
            var countrySearchName = countryName.replace(/[\s]/g, '_');
            var matchRegExp ='Flag_of.*'+countrySearchName;
            var i = 0;
            while(!isFlagImage && i != images.length - 1 ){
                isFlagImage = images[i].match(matchRegExp);
                if(isFlagImage){
                    flagImageName = images[i];

                    var mediWikiImageQuery = 'https://en.wikipedia.org/w/api.php/w/api.php?action=query&prop=imageinfo&format=json&iiprop=url&iiurlwidth=220&titles=File%3A' + flagImageName;

                    request(mediWikiImageQuery, function (err, response, body) {
                        if (!err && response.statusCode == 200) {
                            var data = JSON.parse(body);

                            if(data.query.pages){
                                var keys = Object.keys(data.query.pages);
                                res.json(data.query.pages[keys[0]].imageinfo[0].thumburl);
                            } else{
                                res.json('');
                            }
                        }
                    });
                }
                i++;
            }
        }
        if(err){
            next(err);
        }
    });
});

module.exports = router;
