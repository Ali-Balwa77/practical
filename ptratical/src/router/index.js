const express = require('express');
const router = new express.Router();
const registerModel = require('../models/registers');
// const jwt = require('jsonwebtoken');

router.use(express.urlencoded({ extended: false }))

router.get('/', (req, res) => {


    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/', async (req, res) => {
    try {
        const username = req.body.user_name;
        const email = req.body.email;
        const password = req.body.password;
        const phone = req.body.phone_number;
        const confirm_password = req.body.confirm_passoword;
        if(phone&&email&&password){
            if(password === confirm_password){
                if(password.length>=6){
                    if(email === registerModel.findOne({email:email})){
                        res.send('Email is already Exists')
                    }
                    if(phone === registerModel.findOne({phone:phone})){
                       res.send('Mobile number is already Exists')
                   }
                   const registerUser = new registerModel({
                       username:username,
                       email:email,
                       password:password,
                       phone:phone,
                   })
                   const usertoken =await registerUser.generateAuthToken()
                //    const register = await registerUser.save();
                   if(usertoken){
                       res.render('login')
                   }
                }
                else{
                    res.send("password must be have 6 chracter")
                }
                 
            }else{
                res.send("password & confirm password not match!")
            }
        }else{
            res.send("phone,email and password is required!")
        }

    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }
})

router.post('/login', async (req, res) => {
    try {
        const email_phone = req.body.email_phone;
        const password = req.body.password;

        const check = await registerModel.find({or:[{email:email_phone},{phone:email_phone}]})
        const usertoken =await chekc.generateAuthToken()
        console.log(usertoken);

        if(password===check[0]['password'] && email_phone==check[0]['email'] || email_phone==check[0]['phone']){
            res.send(tokens)
        }else{
            res.send('wrong Details')
        }

        
        
        
    } catch (err) {
        res.status(400).send('invalid login Details')
    }
})

module.exports = router;