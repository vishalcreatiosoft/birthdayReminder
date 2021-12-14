const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/company';

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log('mongodb is connected ');
    })
}

module.exports = connectToMongo;
