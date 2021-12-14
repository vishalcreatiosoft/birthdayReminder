const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstname :{
        type : String,
        trim : true,
        
    },
    lastname : {
        type : String,
        trim : true,
        
    },
    email : {
        type : String,
        trim : true,
        unique : true
    },
    city : {
        type : String,
        trim : true
    },
    dob : {
        type : Date
    }
    
});


module.exports = mongoose.model('employee', employeeSchema);