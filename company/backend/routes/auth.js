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

router.get('/api/auth/employee/birthday', (req, res) => {

    try {
        let nameArray = [];
        schedule.scheduleJob('*/00 */29 */18 * * *', async () => {

            const birthday = async (id) => {
                const birthdayPerson = await Employee.find({ _id: id })
                console.log(`${birthdayPerson[0].firstname} ${birthdayPerson[0].lastname} has birthday today`);
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
        });

        setTimeout(() => {
            res.status(200).json(nameArray);
        }, 5000)


    } catch (e) {
        console.log(e.message);
        res.status(500).send('Internal Server Error');
    }
})



router.get('/api/auth/sendemail', (req, res) => {
    

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"birthday reminder  👻" <info@example.com>', // sender address
            to: "doremon@example.com, baz@example.com", // list of receivers
            subject: "Hello ✔", // Subject line
            html: "<b>Hello world?</b>", // html body
        });

        if(info.messageId){
            res.send('Email sent');
        }else{
            res.send('Error with sending email')
        }
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    }

    main().catch(console.error);
    
})


module.exports = router;