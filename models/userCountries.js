var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Mongoose Schema
var userCountriesSchema = new Schema({
    username: { type: String, required: true, unique: true },
    userCountries: [String],
    updatedAt: Date
});

userCountriesSchema.pre('save', function(next){
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to the current date
    this.updatedAt= currentDate;

    next();
});

var userCountries = mongoose.model('userCountries', userCountriesSchema);

module.exports = userCountries;