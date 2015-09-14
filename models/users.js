var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Mongoose Schema
var userSchema = new Schema({
    username: { type: String, required: true, index: {unique:true}},
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique:true}
});

var User = mongoose.model('User', userSchema);

module.exports = User;