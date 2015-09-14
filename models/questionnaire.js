var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Mongoose Schema
var questionnaireSchema = new Schema({
    questionNumber: { type: String, required: true },
    questionText: { type: String, required: true },
    questionResponse: {type: Boolean, required: true}
});

var Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

module.exports = Questionnaire;