var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Mongoose Schema
var recommendedCountriesSchema = new Schema({
    username: { type: String, required: true, unique: true },
    recommendedCountries: {
        0: String,
        1: String,
        2: String,
        3: String,
        4: String,
        5: String
    }
});

var RecommededCountries = mongoose.model('recommendedCountries', recommendedCountriesSchema);

module.exports = RecommededCountries;