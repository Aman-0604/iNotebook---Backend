const express = require('express');
const User = require('../models/User');
const router = express.Router();//express ke andar router hota hai
const { body, validationResult } = require('express-validator');

// Create a User using : POST "/api/auth/createUser". No login
// Use POST  not GET bcoz GET se URL me information chipakar aati hai and then your password won't be safe
router.post('/createUser', [
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({ min: 5 }),
],async(req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Check whether the user with this email already exists
        try {
            let user=await User.findOne({email: req.body.email});
            if (user) {
                return res.status(400).json({error:'Sorry a user with this email already exists'});
            }
            // Create a new user
            user=await User.create({
                name: req.body.name,
                password:req.body.password,
                email:req.body.email
            })
            res.json(user)
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Some error occured');
        }
})

module.exports = router;