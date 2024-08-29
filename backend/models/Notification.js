const mongoose = require("mongoose");
const NotiSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '30d' } 
    }
});
const Noti = mongoose.model('Noti', NotiSchema);
module.exports = Noti;