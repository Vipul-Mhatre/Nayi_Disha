const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const User = require('../models/User');
const Organization = require('../models/Organization');
const Campaign = require('../models/Campaign');
const Noti = require('../models/Notification');
const nodemailer = require('nodemailer');
const sendSMS = require('./sender');
const secret = process.env.SECRET_KEY;

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GPASSWORD
    },
    pool: true,
    rateLimit: true,
    maxConnections: 5,
    maxMessages: 100,
    tls: {
        rejectUnauthorized: false
    }
});

const sendMail = async (options) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL,
            to: options.to,
            subject: options.title,
            text: "Hello world?",
            html: `<b>${options.subject}</b>`,
            attachments: options.attachments
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const encryptData = (data) => {
    return AES.encrypt(data, secret).toString();
};


router.post('/login', async (req, res) => {
    const { name, email, type, password } = req.body;

    if (!password) {
        return res.status(422).json({ error: "Please provide a valid email and password" });
    }

    let user = "";

    try {
        if (type === "user") {
            if (!email) { return res.status(422).json({ error: "Please provide a valid email" }); }
            user = await User.findOne({ email });
        } else {
            if (!name) { return res.status(422).json({ error: "Please provide a valid name" }); }
            user = await Organization.findOne({ name });
        }
        if (!user) {
            return res.status(422).json({ error: "Invalid email or password" });
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
    const { name, type, password, description, address, email, phone } = req.body;

    if (!name || !password || !address || (type === "charity" && !email) || (type === "organization" && (!description || !phone))) {
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
            const org = new Organization({ name, description, address, password: hashedPassword, phone });
            await org.save();
            const token = await org.generateToken();
            return res.json({
                message: "Registered Successfully",
                token,
                orgId: org._id.toString(),
            }).then(()=>{
                sendSMS
            })
        } else {
            return res.status(422).json({ error: "Please enter a valid user type" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/create-campaign', authMiddleware(Organization), async (req, res) => {
    const { name, description, donors, photo, totalAmtCollected, address } = req.body;
    const org = req.user;
    if (!name || !description || !address) {
        return res.status(422).json({ error: "Please add all required fields" });
    }
    const amt = totalAmtCollected ? totalAmtCollected : 0;
    try {
        const campaign = new Campaign({ name, description, donors, address, photo, organization: org._id, totalAmtCollected: amt });
        console.log(campaign);
        await campaign.save();
        return res.status(200).json({message:"Campaign started successfully"})
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

router.patch('/update-campaign/:id', authMiddleware(Organization), async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const campaign = await Campaign.findById(id);
        if (!campaign) return res.status(404).json({ error: "Campaign not found" });
        await Campaign.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, useFindAndModify: false }
        );
        return res.status(200).json({ "Fields updated": updateFields });
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.get('/get-campaign/:id', authMiddleware(Organization || User), async (req, res) => {
    const { id } = req.params;
    try {
        const campaign = await Campaign.findById(id);
        return res.status(200).json({ campaign });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

router.get('/get-campaigns', async (req, res) => {
    try {
        const campaign = await Campaign.find();
        return res.status(200).json({ campaign });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

router.patch('/end-campaign/:id', authMiddleware(Organization), async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const campaign = await Campaign.findById(id);
        if (!campaign) return res.status(404).json({ error: "Campaign not found" });
        await Campaign.findByIdAndUpdate(
            id,
            { ended: true },
            { new: true, useFindAndModify: false }
        );
        return res.status(200).json({ message:"Campaign Ended Successfully !!!" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal Server Error" })
    }
})


router.post('/send-notification', async (req, res) => {
    const { title, message } = req.body;
    if (!title || !message) {
        return res.status(400).json({ error: 'Title and message are required' });
    }

    try {
        const noti = new Noti({
            title,
            message
        });

        const savedNoti = await noti.save();
        sendSMS(message);
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
        console.log(noti);
        return res.status(200).json({ "Notification": noti });
    } catch (e) {
        console.error(e);
        return res.status(400).json({ "Error occured": e });
    }
});

router.get('/ongoing-campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find();  
        let camp_arr = [];  
        for (const campaign of campaigns) {
            if (campaign.ended === false) {
                camp_arr.push(campaign);  
            }
        }

        return res.status(200).json({ campaigns: camp_arr });  
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal Server Error" });  
    }
});

router.patch('/donate', authMiddleware(User), async (req, res) => {
    const { amount, BcampaignId, campaignId, hash } = req.body;
    const userId = req.user._id;

    try {
        // Validate input
        if (!amount || !BcampaignId || !campaignId || !hash) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Ensure amount is a number
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        // Validate and convert campaignId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(campaignId)) {
            return res.status(400).json({ error: "Invalid campaign ID" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        const donation = { amount: numericAmount, BcampaignId, campaignId, hash };
        user.donations.push(donation);
        campaign.donors.push(userId);

        await user.save();
        await campaign.save();

        return res.status(200).json({ message: "Donation recorded successfully" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/donations', authMiddleware(User), async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user.donations);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.patch('/complete-donation', authMiddleware(Organization), async (req, res) => {
    const { hash, charityId, amount } = req.body;
    const orgId = req.user._id;

    try {
        // Input validation
        if (!hash || !charityId || !amount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Find the organization
        const organization = await Organization.findById(orgId);
        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }


        organization.phone = 1234567890;

        // Create the completion object
        const completion = {
            hash,
            charityId,
            amount
        };

        // Add the completion to the organization's completions array
        organization.completions.push(completion);

        // Save the updated organization
        await organization.save();

        return res.status(200).json({ message: "Donation completion recorded successfully", completion });
    } catch (error) {
        console.error('Error completing donation:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/completions', async (req, res) => {
    try {
        const organization = await Organization.find();

        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        console.log(organization[0].completions);

        return res.status(200).json(organization[0].completions);
    } catch (error) {
        console.error("Error fetching completions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.patch('/verify-completion/:id', authMiddleware(User), async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; // Assuming user authentication is verified with `authMiddleware`

    try {
        // Find the specific organization
        const organization = await Organization.findOne({ 'completions._id': id });
        if (!organization) {
            return res.status(404).json({ message: "Organization or completion not found" });
        }

        // Find the specific completion
        const completion = organization.completions.id(id);
        if (!completion) {
            return res.status(404).json({ message: "Completion not found" });
        }

        // Mark the completion as verified
        completion.verified = true;

        // Save the updated organization
        await organization.save();

        return res.status(200).json({ message: "Completion verified successfully", completion });
    } catch (e) {
        console.error('Error verifying completion:', e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



router.get('/organization/campaigns', authMiddleware(Organization), async (req, res) => {
    try {
        const organizationId = req.user._id; 
        const organization = await Organization.findById(organizationId).populate('campaigns').lean();
        if (!organization || organization.campaigns.length === 0) {
            return res.status(404).json({ error: "No campaigns found for this organization." });
        }
        const detailedCampaigns = organization.campaigns.map(campaign => ({
            name: campaign.name,
            description: campaign.description,
            totalAmtCollected: campaign.totalAmtCollected,
            ended: campaign.ended,
            donors: campaign.donors,
        }));

        return res.status(200).json(detailedCampaigns);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/organization/donors', authMiddleware(Organization), async (req, res) => {
    try {
        const users = await User.find();
        const donors = users.filter(user => user.donations.length > 0);
        return res.status(200).json({ donors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.patch('/complete-donation', authMiddleware(Organization), async (req, res) => {
    const userId = req.user._id;
    try {
        const { charityId, amount, hash } = req.body;
        const organization = await Organization.findById(req.userID);

        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }
        const newCompletion = {
            charityId,
            amount,
            hash,
            donorId:userId,
        };

        organization.completions.push(newCompletion);

        await organization.save();

        return res.status(200).json({ message: "Donation completion recorded successfully", completions: organization.completions });
    } catch (error) {
        console.error("Error completing donation:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



router.get('/get-all-users', authMiddleware(Organization),async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ users });
    } catch (e) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

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