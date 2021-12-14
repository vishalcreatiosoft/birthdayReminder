const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        trim : true,
        required : true
    },
    lastname : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        trim : true,
        unique : true,
        required : true
    },
    password : {
        type : String,
        trim : true,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }

})

module.exports = mongoose.model('users', userSchema);