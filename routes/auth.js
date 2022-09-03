const express = require('express');
const User = require('../models/User');
const router = express.Router();//express ke andar router hota hai
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// JWT enables a very secure verification between user and backend/server
const JWT_Secret = "Amanisagoodbb$oy";// Idealy you should keep this safe not here. You may keep it in .env.variable file

// Create a User using : POST "/api/auth/createUser". No login required
// Use POST  not GET bcoz GET se URL me information chipakar aati hai and then your password won't be safe
router.post('/createUser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email already exists
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Sorry a user with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const secured_password = await bcrypt.hash(req.body.password, salt);
        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: secured_password,
            email: req.body.email
        })
        const data = {//accessing data by using object id because it will be the fastest access
            user: {
                id: user.id
            }
        }
        const auth_token = jwt.sign(data, JWT_Secret);
        // console.log(jwtData);
        // res.json(user)
        res.json({ auth_token });


    } catch (error) {
        console.log(error.message);
        res.status(500).send('Some error occured');
    }
})

// Authinticating a User using : POST "/api/auth/login". No login required
// Use POST  not GET bcoz GET se URL me information chipakar aati hai and then your password won't be safe
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email:req.body.email });//returns true or falase //I am in (ES6>=) hence I can write {email} instead of {email: email} if both the names are same
        if (!user) {
            return res.status(400).json('Invalid Credentials'); // I will show this not invalid email. Bcoz I don't want to tell the user that what is incorrect as the user might be a hacker
        }
        const password_compare = await bcrypt.compare(req.body.password, user.password);//returns true or fasle
        if (!password_compare) {
            return res.status(400).json('Invalid Credentials'); // I will show this not invalid password. Bcoz I don't want to tell the user that what is incorrect as the user might be a hacker
        }
        const data = {//accessing data by using object id because it will be the fastest access
            user: {
                id: user.id
            }
        }
        const auth_token = jwt.sign(data, JWT_Secret);
        res.json({ auth_token });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error Occurred');
    }
})

module.exports = router;