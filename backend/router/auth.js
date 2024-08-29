const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

require("../db/connnection")
const User = require('../model/userSchema')
const Campaign = require('../model/campaignSchema')

router.get('/' , (req,res) => {
    res.send("Backend Home Page")
})

router.get('/viewAllUsers', (req,res) =>{
    User.find()
        .then((users) =>{
            res.send(users)
        })
        .catch((err) => console.log(err))
})

router.get('/allCampaigns' , (req,res) => {
    Campaign.find()
        .then((campaigns) => {
            res.send(campaigns)
        })
        .catch((e)=>{console.log(e)})
})

router.get('/getCampaign/:id' , (req,res) => { 
    Campaign.findOne({_id:req.params.id})
        .then((campaign) => {
            return res.status(200).send(campaign)
        })
        .catch((e)=>{console.log(e)})
})

router.post('/register' , (req , res) => {
    const { name , email , pwd , cpwd } = req.body
    
    //validation
    function validateEmail(email) {
        const regex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    if(!name || !email || !pwd || !cpwd){
        return res.status(422).json({error: "Please Fill all the fields"})
    }

    if(!validateEmail(email)){
        return res.status(400).json({error: "Invalid Email"})
    }

    //Checking existing User
    User.findOne({email: email})
        .then( (userExist) => {
            if(userExist){
                return res.status(422).json({error: "Email already Exists"})
            }

            else if(pwd != cpwd){
                return res.status(400).json({error: "Confirm Password not equal"})
            }

            const user = new User({name , email, pwd, cpwd})
            console.log("new user" , user)
            user.save().then(() => {
                res.status(201).json({message: "User registered Succesfully"})
                console.log("new user" , user)
            }).catch((e) => res.status(500).json({error: "Failed to register"}))
            
        })
        .catch( e => { console.log(e) })
})

router.post('/login' , (req , res) => {
    const { email , pwd } = req.body 
    // console.log(req.body)

    //validation
    function validateEmail(email) {
        const regex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }
    if(!email || !pwd){
        return res.status(400).json({error : "Please fill all the fields!"})
    }
    if(!validateEmail(email)){
        return res.status(400).json({error: "Invalid Email"})
    }

    //Checking existing User
    User.findOne({email : email})
        .then(async (userExist) => {      //userExist contains details of the found user or NULL value
            console.log(userExist)
            let token;
            if(userExist){
                bcrypt.compare( pwd , userExist.pwd)
                    .then((isMatch) =>{
                        if(!isMatch)
                            res.json({message: "Wrong Password"})
                        else
                            res.json({message: "Login Successfull"})
                    }).catch(e => console.log(e))

                const token = await userExist.generateAuthToken();
                console.log(token)
            }
            else
                res.json({message: "Couldnt find the User"})
        })
        .catch((e) => {
            console.log(e)
        })
})

router.post('/addCampaign' , (req,res) => {
    const { name, title, description , target, deadline, image } = req.body
    
    if( !name || !title || !description || !target || !deadline || !image){
        res.status(400).json({error: "Pls Fill all the fields"})
    }

    Campaign.findOne({title: title})
        .then((existingCampaign) => {
            if(existingCampaign){
                return res.status(422).json({error: "Campaign already Exists"})
            }

            console.log(req.body)
            const campaign = new Campaign({name, title, description , target, deadline, image})
            campaign.save()
                .then(() => {
                    res.status(201).json({message: "Campaign added Succesfully"})
                })
                .catch((e) => res.status(500).json({error: "Failed to add campaign"}))
        
            })
        .catch((e) => {console.log(e)})

})

router.post('/donate' , (req,res) => {
    const { campaign , donation } = req.body
    Campaign.updateOne({_id: campaign._id} , {amountCollected: campaign.amountCollected + Number(donation)})
        .then(()=>{res.status(200).json({message :`Donation of ${donation} was succesfull.`})})
        .catch((e)=>{console.log(e)})
})

module.exports = router