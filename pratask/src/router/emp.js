const express = require('express');
const router = new express.Router();
const empModel = require('../models/registers');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

router.use(express.urlencoded({extended: false}))

router.get('/userlist', auth, (req,res)=>{
   
    empModel.find({},(err,result)=>{
        res.render('userlist',{user: result})
    })
})

router.get('/userdetails', auth, (req,res)=>{
   
    empModel.find({},(err,result)=>{
        res.render('userdetails',{user: result})
    })
})

router.get('/logout', auth, async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((currentelement)=>{
            return currentelement.token !== req.token
        })
        req.tokens = []
        res.clearCookie('jwt')
        console.log('logout successful')
        await req.user.save()
        res.render('login',{})
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/', (req,res)=>{
    res.render('register',{})
})

router.get('/login', (req,res)=>{
    res.render('login',{})
})

router.post('/', async(req, res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confpassword;

        if(password === cpassword){
            const empregister = new empModel({
                username:req.body.uname,
                email:req.body.email,
                password:password,
                usertype:req.body.user_type
            })
            // console.log(`the success part ${empregister}`)
            const usertoken  = await empregister.generateAuthToken();
            // console.log(`the usertoken part ${usertoken}`)

            res.cookie('jwt', usertoken, { 
                expires: new Date(Date.now() + ''),
                httpOnly: true
            })

            const register = await empregister.save();
            res.status(201).render('login',{}) 
        }else{
            res.send('Password are not matching')
        }

    }catch(error){
        res.status(400).send(error)
        console.log(error)
    }
})

router.post('/login',async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await empModel.findOne({email:email})
        const ismatch = await bcrypt.compare(password, useremail.password);

        const usertoken  = await useremail.generateAuthToken();
            // console.log(`the usertoken part ${usertoken}`)

        res.cookie('jwt', usertoken, { 
            expires: new Date(Date.now() + ''),
            httpOnly: true
        })
       
        if(useremail.usertype === "2"){
            res.redirect('userlist')
        }else{
            res.render('login',{})
        }

        if(ismatch){
            
        }else{
            res.send('invalid password Details')
        }
    }catch(err){
        res.status(400).send('invalid login Details')
        console.log(err)
    }
})

module.exports = router;