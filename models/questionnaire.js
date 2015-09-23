var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Mongoose Schema
var questionnaireSchema = new Schema({
    username: {type: String, required: true, unique: true},
    questionResponses: {
        question1: String,
        question2: String,
        question3: String,
        question4: String,
        question5: String,
        question6: String,
        question7: String,
        question8: String
    },
    dateUpdated: Date
});

userSchema.pre('save', function(next){
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to the current date
    this.updated_at = currentDate;

    // if created_at hasn't be set, add that as well
    if(!this.created_at){
        this.created_at = currentDate;
    }
    next();
});

var Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

module.exports = Questionnaire;