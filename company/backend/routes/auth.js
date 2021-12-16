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


//function to getNames of the employees who have birthday at given date
const getNames = async(names,searchDate)=>{

    const searchName = async (id) => {
        const birthdayPerson = await Employee.find({ _id: id })
        //console.log(`${birthdayPerson[0].firstname} ${birthdayPerson[0].lastname}`);
        names.push(`${birthdayPerson[0].firstname} ${birthdayPerson[0].lastname}`);
        console.log(names);
    }
    const data = await Employee.aggregate([
        {
            $project: {
                year: { $year: "$dob" },
                month: { $month: "$dob" },
                date: { $dayOfMonth: "$dob" }
            }
        }
    ])

    data.forEach(element => {
        if (`${element.year}-${element.month}-${element.date}` == searchDate) {
            searchName(element._id);
            
        }
    });

    
}


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

// scheduler1 : To fetch the name of the Today's Birthday Persons at given time.
schedule.scheduleJob('41 16 * * *', async () => {
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
            if (`${element.date}/${element.month}` == date) {
                birthday(element._id);
            }
        });

    } catch (e) {
        console.log(e.message);
        res.status(500).send('Internal Server Error');
    }
})

// scheduler2 : To send the email to Today's Birthday List of Employees at given time.
schedule.scheduleJob('00 10 * * *', () => {

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

//Route-4: To get the name of BirthDay list of peoples for notification page using - /api/auth/employee/birthday
router.post('/api/auth/employee/birthday', async (req, res) => {

    try {
        let names = [];
        let count = 0
        const searchDate = req.body.dob;

        const birthdayNames = await getNames(names,searchDate);

       // console.log(birthdayNames);

    } catch (e) {
        console.log(e.message);
        res.status(500).send('Internal server error');
    }

})




module.exports = router;