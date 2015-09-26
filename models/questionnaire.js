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
        question5: Boolean,
        question6: String,
        question7: String,
        question8: String
    },
    updatedAt: Date
});

questionnaireSchema.pre('save', function(next){
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to the current date
    this.updatedAt = currentDate;

    next();
});

var Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

module.exports = Questionnaire;