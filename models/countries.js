var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Mongoose Schema
var countrySchema = new Schema({
    name: { type: String, required: true },
    continent: { type: String, required: true },
    population: {type: Number, required: true},
    officialLanguage: { type: String, required: true },
    currency: {type: String, required: true},
    exhangeRate: {type: Number, required: true}
});

var Country = mongoose.model('Country', countrySchema);

module.exports = Country;