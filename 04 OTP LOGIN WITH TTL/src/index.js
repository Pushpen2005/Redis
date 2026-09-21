import express from 'express';
import Redis from 'ioredis';

const app = express();
const port = 3009;
app.use(express.json());
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
    await redis.set(otpkey(phoneNumber),otp,'EX',50);
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

    const storedOtp = await redis.get(otpkey(phoneNumber));
    if(storedOtp !== otp) {
        return res.status(400).json({error: 'Invalid or expired OTP.'});
    }

    await redis.del(otpkey(phoneNumber));
    res.json({message: 'OTP verified successfully.'});
})

app.get('/otp/exists/:phoneNumber', async (req,res) => {
    const { phoneNumber } = req.params;
    if(!phoneNumber) {
        return res.status(400).json({error: 'Phone number is required.'});
    }

    const exists = await redis.exists(otpkey(phoneNumber));
    res.json({exists: exists === 1});
})
app.get('/otp/:phoneNumber/ttl', async (req,res) => {
    const ttl = await redis.ttl(otpkey(req.params.phoneNumber));
    res.json({ttl: ttl});
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
