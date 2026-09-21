import express from 'express';
import Redis from 'ioredis';

const app = express();
const port = 3000;

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

function otpkey(phoneNumber) {
    return `otp:${phoneNumber}`;
}

app.post('/otp', async (req,res) => {
    const { phoneNumber } = req.body;
    if(!phoneNumber) {
        return res.status(400).json({error: 'Phone number is required.'});
    }

    const otp = Math.floor(100000 +Math.random() * 900000).toString();
    await redis.set(otpkey(phoneNumber),otp,'EX',30);
    res.json({
        message: `OTP sent to ${phoneNumber}. It will expire in 30 seconds.`,
        otp: otp    
    })
})

app.post('/verify', async (req,res) => {
    const {phoneNumber,otp } = req.body;
    if(!phoneNumber || !otp) {
        return res.status(400).json({error: 'Phone number and OTP are required.'});
    }

    const storedOtp
