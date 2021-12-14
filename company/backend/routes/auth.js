const express = require('express');
const router = new express.Router();
const User = require('../models/user-model');
const Employee = require('../models/employee-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator')
const schedule = require('node-schedule');
const { find } = require('../models/user-model');

const JWT_SECRET = 'helloworld'

const today  = new Date();
const dd = today.getDate();
const mm = today.getMonth() + 1;
const date = `${mm}-${dd}`;





//Route 1 - for user signup  using - /api/auth/signup.
router.post('/api/auth/signup', [
    body('firstname', 'Enter valid firstname').isLength({ min: 3 }),
    body('lastname', 'Enter valid lastname').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Enter valid password').isLength({ min: 5 })
],
    async (req, res) => {
        let success = true;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            success = false;
            res.status(400).json({ success, errors: errors.array() });
        }
        try {

            //hashing the password.
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            // singup user
            const user = await User.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashedPassword
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.status(200).json({ success, authToken });


        } catch (e) {
            console.log(e.message);
            res.status(500).send('Internal server error');
        }

    })


//Route2 - for login user using - /api/auth/login.
router.post('/api/auth/login', [
    body('email', 'Enter valid email id').isEmail(),
    body('password', "Enter valid password").isLength({ min: 5 })
], async (req, res) => {
    let success = true;
    const errors = validationResult(req);
    const { email, password } = req.body;
    if (!errors.isEmpty) {
        success = false;
        res.status(400).json({ success, errors: errors.array() });
    }

    try {

        let user = await User.findOne({ email: email });
        if (!user) {
            success = false;
            res.status(400).json({ success, error: 'Incorrect Email' });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            success = false;
            res.status(400).json({ success, error: 'Incorrect password' });
        }

        const data = {
            user: {
                id: user.id,
                name: user.firstname
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        res.status(200).json({ success, authToken })

    } catch (e) {
        console.log(e.message);
        res.status(500).send('Internal Server Error');
    }
}
)

//Route3 -  to add new employee using - '/api/auth/addemployee'
router.post('/api/auth/addemployee', [
    body('firstname', 'Enter valid firstname').isLength({ min: 3 }),
    body('lastname', 'Enter valid lastname').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail()
],
    async (req, res) => {
        let success = true;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            success = false;
            res.status(400).json({ success, errors: errors.array() });
        }
        try {
            // add new employee
            const employee = await Employee.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                city : req.body.city,
                dob : req.body.dob
            }) 
            //console.log(employee);

            res.status(200).json({ success })

        } catch (e) {
            console.log(e.message);
            res.status(500).send('Internal server error');
        }
    }
)



const job = schedule.scheduleJob('*/08 */18 * * *', function(){
   console.log('its working');  
  
});

router.get('/api/auth/birthdate', async(req, res)=>{
    try{

        console.log(Employee.aggregate([
            {
                $details : {
                    year : {
                        $year : "$dom"
                    }
                }
            }
        ]))
        

    }catch(e){
        console.log(e.message);
        res.status(400).send('Internal Server Error');
    }
})

module.exports = router;