const mongoose = require('mongoose')

require('../db/connnection')

const campaignSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    towards:{
        type: String,
        required: true
    },
    target:{
        type: Number,
        required: true
    },
    deadline:{
        type: Date,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    amountCollected:{
        type: Number,
        default: 0
    },
    donators:[
        {
            donator: {
                _id:{
                    type: mongoose.Schema.ObjectId,
                    ref: "USER"
                },
                name:{
                    type: String,
                    ref: "USER"
                },
                donation:{
                    type: Number
                }
            }
        }
    ]
    
})

campaignSchema.index({title: 'text' , towards: 'text'}) 
const Campaign = mongoose.model('CAMPAIGN' , campaignSchema)

module.exports = Campaign