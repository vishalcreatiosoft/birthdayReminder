const express = require('express');
const router = new express.Router();
const User = require('../models/user-model');
const Employee = require('../models/employee-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator')
const schedule = require('node-schedule');
const { find } = require('../models/user-model');
const nodemailer = require("nodemailer");

const JWT_SECRET = 'helloworld'

//getting today date for matching with employees DOB
const today = new Date();
const dd = today.getDate().toString();
const mm = (today.getMonth() + 1).toString();
const date = `${dd}/${mm}`;
let nameArray = [];



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
                city: req.body.city,
                dob: req.body.dob
            })
            //console.log(employee);

            res.status(200).json({ success })

        } catch (e) {
            console.log(e.message);
            res.status(500).send('Internal server error');
        }
    }
)


schedule.scheduleJob('29 12 * * *', async() => {
    try {
        
        const birthday = async (id) => {
            const birthdayPerson = await Employee.find({ _id: id })
            //console.log(`${birthdayPerson[0].firstname} ${birthdayPerson[0].lastname} has birthday today`);
            nameArray.push(`${birthdayPerson[0].firstname} ${birthdayPerson[0].lastname}`);

        }

        const data = await Employee.aggregate([
            {
                $project: {
                    month: { $month: "$dob" },
                    date: { $dayOfMonth: "$dob" }
                }
            }
        ])

        data.forEach(element => {
            if(`${element.date}/${element.month}` == date) {
                birthday(element._id);
            }
        });
   
    } catch (e) {
        console.log(e.message);
        res.status(500).send('Internal Server Error');
    }
})


schedule.scheduleJob('30 12 * * *', () => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sender@gmail.com',
            pass: '*********'
        }
    });

    let mailOptions = {
        from: 'sender@gmail.com',
        to: 'receiver@gmail.com',
        subject: `Today's Birthday List`,
        text: `${nameArray}`
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {   
            cosole.log('Error Occurs', err);
        } else {
            console.log('Email Sent')
        }
    })

});






module.exports = router;