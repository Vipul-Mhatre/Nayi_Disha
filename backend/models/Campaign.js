const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    donors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    organization: { type: String, required: true }
});

const Campaign = mongoose.model("Campaign", campSchema);
module.exports = Campaign;