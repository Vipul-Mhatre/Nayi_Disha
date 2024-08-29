const accountSid = process.env.AccSid;
const authToken = process.env.AuthToken;

const client = require('twilio')(accountSid, authToken);

const sendSMS = async (body) => {
    let msgOptions = {
        from: process.env.FromNum,
        to: process.env.ToNum,
        body
    };

    try {
        const message = await client.messages.create(msgOptions);
        console.log('Message sent:', message.sid);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};
module.exports = sendSMS;