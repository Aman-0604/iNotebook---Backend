const express= require('express');
const router=express.Router();//express ke andar router hota hai

router.get('/',(req,res)=>{
    res.json([]);//passing a null object
})

module.exports= router;