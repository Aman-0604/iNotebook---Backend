const express= require('express');
const User = require('../models/User');
const router=express.Router();//express ke andar router hota hai

// Create a User using : POST "/api/auth/". No login
// Use POST  not GET bcoz GET se URL me information chipakar aati hai and then your password won't be safe
router.post('/',(req,res)=>{
    console.log(req.body);
    // Making a user 
    const user= User(req.body);
    user.save(); // Data now stored in the database (Open your MongoDb Compass to check)
    res.send(req.body);
})

module.exports= router;