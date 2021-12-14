const express = require('express');
const route = require('../routes/auth');
//const schedule = require('node-schedule');
const connectToMongo = require('../database/db');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;
connectToMongo();
app.use(cors());
app.use(express.json());

app.use(route);
app.use('/api/auth',require('../routes/auth'));


// const job = schedule.scheduleJob('*/57 */17 * * *', function(){
//     console.log('Its working .... done');
// });



app.listen(port, ()=>{
    console.log(`server started at port ${port}`);
})