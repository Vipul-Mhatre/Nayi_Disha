const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config({path: '../config.env'})

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    pwd:{
        type: String,
        required: true
    },
    cpwd:{
        type: String,
        required: true
    },
    balance:{
        type: Number,
        default: 10000000
    },
    donated_campaigns:[
        {
            campaign:{
                campaign_id:{
                    type: mongoose.Schema.ObjectId,
                    ref: "CAMPAIGN"
                },
                donation:{
                    type: Number,
                    default: 0
                }
            }
        }
    ],
    yourCampaigns:[
        {
            campaign:{
                campaign_id:{
                    type: mongoose.Schema.ObjectId,
                    ref: "CAMPAIGN"
                },
                title:{
                    type: String,
                    ref: "CAMPAIGN"
                }
            }
        }
    ],
    tokens:[
        {
            token:{
                type: String,
                required: true
            }
        }
    ],
})

userSchema.pre('save', async function(next) {
    // console.log("Inside pre-save")
    if(this.isModified('pwd')){               //this references instance 'userSchema'
        this.pwd = await bcrypt.hash(this.pwd , 12)
        this.cpwd = await bcrypt.hash(this.pwd , 12)
    }
    next()
})

//token generation
userSchema.methods.generateAuthToken = async function() {
    const newToken = jwt.sign({_id : this._id}, process.env.SECRET_KEY)
    this.tokens = this.tokens.concat({token : newToken})
    this.save();
    return newToken;
}

const User = mongoose.model('USER' , userSchema)

module.exports = User

