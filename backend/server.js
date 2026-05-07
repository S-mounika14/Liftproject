const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Store OTP temporarily (in-memory)
let otpStore = {};

// Email config (using  my  Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "2080tecnologiesprivatelimited@gmail.com",
        pass: "venfmxsplagdpyhd",
    },
});

//  Send OTP
app.post("/send-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000
        };

        await transporter.sendMail({
            from: '"Lift App" <2080tecnologiesprivatelimited@gmail.com>',
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}`
        });

        return res.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log("SEND OTP ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
});


//verify otp
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (!otpStore[email]) {
        return res.json({ success: false, message: "OTP not found" });
    }

    if (Date.now() > otpStore[email].expiresAt) {
        delete otpStore[email];
        return res.json({ success: false, message: "OTP expired" });
    }

    if (otpStore[email].otp === otp) {
        delete otpStore[email];
        return res.json({ success: true });
    } else {
        return res.json({ success: false, message: "Invalid OTP" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});