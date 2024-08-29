const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const User = require('../models/User');
const Organization = require('../models/Organization');
const secret = process.env.SECRET_KEY;

router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(422).json({ error: "Please provide a valid name and password" });
    }

    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(422).json({ error: "Invalid name or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = await user.generateToken();
            return res.status(200).json({
                message: "Login successful",
                token,
                user
            });
        } else {
            return res.status(404).json({ error: "Invalid Credentials!" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/register', async (req, res) => {
    const { name, type, password, description, address, email } = req.body;

    if (!name || !password || !address || !email || (type === "charity" && !email) || (type === "organization" && !description)) {
        return res.status(422).json({ error: "Please add all required fields" });
    }

    try {
        if (type === "charity") {
            const existingUser = await User.findOne({ name });
            if (existingUser) {
                return res.status(422).json({ error: "User already exists with that name or email" });
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ name, email, address, password: hashedPassword });
            await user.save();
            const token = await user.generateToken();
            return res.json({
                message: "Registered Successfully",
                token,
                userId: user._id.toString(),
            });
        } else if (type === "organization") {
            const existingOrg = await Organization.findOne({ name });
            if (existingOrg) {
                return res.status(422).json({ error: "Organization already exists with that name" });
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const org = new Organization({ name, description, address, password: hashedPassword });
            await org.save();
            const token = await org.generateToken();
            return res.json({
                message: "Registered Successfully",
                token,
                orgId: org._id.toString(),
            });
        } else {
            return res.status(422).json({ error: "Please enter a valid user type" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


router.post('/send-notification', authMiddleware, async (req, res) => {
    const { title, message } = req.body;
    if (!title || !message) {
        return res.status(400).json({ error: 'Title and message are required' });
    }

    try {
        const encryptedTitle = encrypt(title);
        const encryptedMessage = encrypt(message);
        const noti = new Noti({
            title: encryptedTitle,
            message: encryptedMessage
        });

        const savedNoti = await noti.save();
        sendMail({
            to: process.env.GMAILH,
            subject: title,
            text: message
        });

        return res.status(200).json({ "Notification sent": savedNoti });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/get-notification', authMiddleware, async (req, res) => {
    try {
        const noti = await Noti.find();
        const decryptedNoti = noti.map(noti => {
            const decryptedTitle = noti.title && encryptData(decrypt(noti?.title?.encryptedData, noti?.title?.iv, noti?.title?.key));
            const decryptedMessage = encryptData(decrypt(noti?.message?.encryptedData, noti?.message?.iv, noti?.message?.key));

            return {
                id: noti._id.toString(),
                title: decryptedTitle,
                message: decryptedMessage
            }
        });
        return res.status(200).json({ "Notification": decryptedNoti });
    } catch (e) {
        console.error(e);
        return res.status(400).json({ "Error occured": e });
    }
});

router.get('/user', authMiddleware, (req, res) => {
    try {
        const userData = req.user;
        res.status(200).json({ msg: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;