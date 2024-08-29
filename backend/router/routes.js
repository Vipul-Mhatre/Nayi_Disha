const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const router = express.Router()


require("../db/connnection");
const User = require('../model/userSchema');
const Campaign = require('../model/campaignSchema');
const authenticate = require('../middleware/authenticate');

router.get('/' , (req,res) => {
    res.send("Backend Home Page");
})

router.get('/viewAllUsers', (req,res) =>{
    User.find()
        .then((users) =>{
            res.send(users)
        })
        .catch((err) => console.log(err))
})

router.get('/currentUser' ,authenticate, (req,res) => {
    res.status(200).send(req.rootUser)
})

router.get('/checkLoggedUser' , authenticate, (req,res) => {
    if (req.rootUser)
        return res.status(200).json({message: 'User is logged in', user: req.rootUser})
    else
        return res.status(401).json({message: 'No User Logged in'})
})

router.get('/profile' , authenticate , (req,res) => {
    return res.send(req.rootUser);
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

router.post('/logout' , (req,res) => {
    res.clearCookie("jwtoken", {path: "/",domain:"venturecrowd-server.vercel.app", httpOnly: true, secure: true, sameSite:"none" });
    res.status(200).json({message:"Logged out Successfully!"})
    return res.status(200).send('Logged out');
})

router.post('/deleteCampaign', authenticate, (req, res) => {
    // Delete the campaign from the Campaign collection
    Campaign.deleteOne({ _id: req.body._id })
        .then(() => {
            // After the campaign is deleted, remove it from the user's yourCampaigns array
            User.findOneAndUpdate(
                {_id:req.UserID}, 
                { $pull: { yourCampaigns: { 'campaign.campaign_id': req.body._id } } },
                { new: true }
            )
            .then((updatedUser)=>{console.log("User Updated")})
            .catch((e) => {console.log(e)})
        })
        .then(() => {
            console.log(`Deleted campaign with ID ${req.body._id}`);
            res.status(200).send("Deleted");
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

router.post('/checkCampaign' , authenticate , (req,res) => {
    console.log(req.body)
    User.findOne({_id:req.UserID , "yourCampaigns.campaign.title": req.body.title})
        .then((user)=>{
            res.status(200).send({maker: user , requester: req.rootUser})
        })
        .catch((e) => console.log(e))
})

router.get('/searchCampaigns' , (req,res) => {
    const { searchValue } = req.query
    console.log("Title to search: " , searchValue)
    Campaign.find({ $text : {
        $search : searchValue,
        $caseSensitive : false
    }})
        .then((campaigns)=>{
            if(campaigns){
                console.log("found campaign : ",campaigns)
                res.status(200).send(campaigns)
            }
            else{
                res.status(400).send("Error")
            }
        })
        .catch((e)=>console.log(e))
})

router.post('/getManyCampaigns' , (req,res) => {
    const list = req.body
    let c_list =[]
    list.map((item) =>{
        c_list.push(item.campaign.campaign_id)
    })
    // console.log(c_list)
    Campaign.find({ _id: {$in: c_list}})
        .then((campaigns)=>{
            if(campaigns){
                res.status(200).send(campaigns)
            }
            else{
                res.status(400).send("Error")
            }
        })
        .catch((e)=>console.log(e))
})

router.post('/getManyDonatedCampaigns' , (req,res) => {
    const list = req.body
    let c_list =[]
    let d_list =[]
    var c = []
    var d = []
    // console.log(list[0].campaign.campaign_id)
    
    // console.log(c_list)
    if(list.length == 0){
        return res.status(200).json({campaigns: [], donations: []})
    }
    else
    {
        list.map((item) =>{
            c_list.push(item.campaign.campaign_id)
            d_list.push(item.campaign.donation)
        })

        list.map((item) => {
            Campaign.findOne({ _id: item.campaign.campaign_id })
            .then((campaign)=>{
                if(campaign){
                    c.push(campaign);
                    d.push(item.campaign.donation)   
                }
                if(c.length === d_list.length && d.length === d_list.length){
                    return res.status(200).json({campaigns: c, donations: d})
                }
            })
            .catch((e)=>console.log(e))
        })
    }
})

router.post('/register' , (req , res) => {
    const { name , email , pwd , cpwd } = req.body
    
    //validation
    function validateEmail(email) {
        const regex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    if(!validateEmail(email)){
        return res.status(401).json({message: "Invalid Email"})
    }

    //Checking existing User
    User.findOne({email: email})
        .then( (userExist) => {
            if(userExist){
                return res.status(401).json({message: "Email already Exists"})
            }

            else if(pwd != cpwd){
                return res.status(401).json({message: "Confirm Password not equal"})
            }

            const user = new User({name , email, pwd, cpwd})
            
            user.save().then(() => {
                res.status(201).json({message: "User registered Succesfully"})
            }).catch((e) => res.status(500).json({message: "Failed to register"}))
            
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
        return res.status(401).json({error : "Please fill all the fields!"})
    }
    if(!validateEmail(email)){
        return res.status(401).json({error: "Invalid Email"})
    }

    //Checking existing User
    User.findOne({email : email})
        .then(async (userExist) => {      //userExist contains details of the found user or NULL value
            if(userExist){
                bcrypt.compare( pwd , userExist.pwd)
                    .then((isMatch) =>{
                        if(!isMatch)
                            res.status(401).json({message: "Wrong Password"})
                        else
                            res.status(200).json({message: "Login Successfull", loggedUser: userExist})
                    }).catch(e => console.log(e))

                const token = await userExist.generateAuthToken();
                console.log(token)
                
                //cookie
                res.cookie("jwtoken" , token , { 
                    expires: new Date(Date.now() + 3600000),
                    path: "/",
                    domain:"venturecrowd-server.vercel.app",
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                });
            }
            else
                res.status(401).json({message: "Couldnt find the User"})
        })
        .catch((e) => {
            console.log(e)
        })
})

router.post('/addCampaign' , authenticate , (req,res) => {
    const { name, title, description, towards, target, deadline, image } = req.body
    
    if( !name || !title || !description|| !towards || !target || !deadline || !image){
        res.status(400).json({error: "Pls Fill all the fields"})
    }

    //adds campaign to the db
    Campaign.findOne({title: title})
        .then((existingCampaign) => {
            if(existingCampaign){
                return res.status(422).json({message: "Campaign already Exists"})
            }
            else
            {
                const campaign = new Campaign({name, title, description, towards, target, deadline, image})
                campaign.save()
                .then(() => {
                    // res.status(201).json({message: "Campaign added Succesfully"})
                    console.log("Campaign added Succesfully")

                })
                .catch((e) => res.status(500).json({message: "Failed to add campaign"}))
            }
        
            })
        .catch((e) => {console.log(e)})

        //adds campaign id and title to the user db
        setTimeout(() => {
            Campaign.findOne({title: title})
            .then((campaign) => {
                console.log(campaign)
                if(campaign){
                    User.findOneAndUpdate(
                            {_id:req.UserID}, 
                            {$push: {yourCampaigns: {campaign:{campaign_id: campaign._id , title: campaign.title }}}} , 
                            { new: true }
                        )
                        .then((updatedUser) => {
                            res.status(201).json({message: "Campaign added Succesfully", updatedUser: updatedUser})
                            console.log("Added Campaign to the User database")
                        }) 
                        .catch((e)=>console.log(e))
                }
                else    
                    console.log("didnt update User")
            })
            .catch((e)=>console.log(e))
        },500)

})

router.post('/update' , (req,res) => {
    const { id, name, title, description, towards, target, deadline, image } = req.body
    
    if( !name || !title || !description|| !towards || !target || !deadline || !image){
        res.status(400).json({error: "Pls Fill all the fields"})
    }

    Campaign.updateOne({_id: id } , {
        name : name,
        title : title,
        description : description,
        towards : towards,
        target : target,
        deadline : deadline,
        image : image
    })
    .then((updatedCampaign)=>{res.status(201).json({message: "Campaign updated Succesfully", })})
    .catch((e)=>{
        console.log(e);
        res.status(500).json({message: "Failed to update your campaign"});
    })
})

router.post('/donate' , authenticate , (req,res) => {
    const { campaign , donation } = req.body
    Campaign.updateOne(
        {_id: campaign._id} , 
        {  
            amountCollected: campaign.amountCollected + Number(donation) , 
            $push: {donators:{donator:{_id: req.UserID, name: req.rootUser.name , donation: Number(donation)}}}
        }
        )
        .then(()=>{console.log(`donated ${donation} to ${campaign.title}`)})
        .catch((e)=>{console.log(e)})

    User.updateOne(
        {_id: req.UserID}, 
        {
            balance: req.rootUser.balance - Number(donation),
            $push: {donated_campaigns:{campaign: {campaign_id: campaign._id , donation: Number(donation) }}},
                
        }
        )
        .then((updatedUser)=>{res.status(201).json({message :`Successfully Donated $${donation} to ${campaign.title}`, updatedUser: updatedUser})})
        .catch((e)=>{console.log(e)})
})

module.exports = router
