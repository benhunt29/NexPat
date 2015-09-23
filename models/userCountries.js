var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Mongoose Schema
var userCountriesSchema = new Schema({
    username: { type: String, required: true, unique: true },
    userCountries: [String]
});

var userCountries = mongoose.model('userCountries', userCountriesSchema);

module.exports = userCountries;