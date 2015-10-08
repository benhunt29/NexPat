var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR =  12;

// create a Mongoose Schema
var userSchema = new Schema({
    username: { type: String, required: true, index: {unique:true}},
    password: String,
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique:true},
    registerDate: Date,
    access_token: String
});

userSchema.pre('save',function(next){
    var user = this;

    if (!this.registerDate){
        this.registerDate = new Date();
    }

    //only hash the password if it has been modified (or is new)
    if (!user.isModified('password')){
        return next();
    }

    //generate a salty snack
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if (err){
            return next(err);
        }

        // hash the password along with our new salty snack
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();

        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err,isMatch){
        if(err){
            return cb(err);
        }
        cb(null,isMatch);
    });
};

var User = mongoose.model('User', userSchema);

module.exports = User;