var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Mongoose Schema
var recommendedCountriesSchema = new Schema({
    username: { type: String, required: true, unique: true },
    recommendedCountries: {
        1: String,
        2: String,
        3: String,
        4: String,
        5: String
    },
    updatedAt: Date
});

recommendedCountriesSchema.pre('save', function(next){
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to the current date
    this.updatedAt= currentDate;

    next();
});

var RecommededCountries = mongoose.model('recommendedCountries', recommendedCountriesSchema);

module.exports = RecommededCountries;