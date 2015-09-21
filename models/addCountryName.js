var country = require('./models/WorldFactbook');
var fs = require('fs');

var countries = [];
var dir = path.join(__dirname,'./models/europe/');

var names = fs.readdir(dir,function(err,files){
    files.forEach(function(file){
        var currentCountry = {};
        fs.readFile(path.join(dir,file),'utf-8',function(err,returnedfile){
            currentCountry = JSON.parse(returnedfile);
            currentCountry.name = {};
            currentCountry.name.name = file.slice(3,file.length-5);
            currentCountry.name.abbreviation = file.slice(0,2);
            country.create(currentCountry,function(err,test){
                if(err){
                    console.log(err);
                }
            });
        });
    });

});