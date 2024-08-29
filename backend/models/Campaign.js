const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    donors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    organization: { type: String, required: true },
    photo:{type:String},
    address:{type: String, required: true},
    totalAmtCollected: { type: String, required: true },
    ended: {type:Boolean, default: false}
});

const Campaign = mongoose.model("Campaign", campSchema);
module.exports = Campaign;