import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
const port = 3000;


const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get('/', async (req, res) => {
    const reply = await redis.ping();
    res.send(`Redis replied with: ${reply}`);
})

app.get('/mongo', async (req, res) => {
    const url = process.env.MONGO_URL || 'mongodb://localhost:27017/test';
    try {
        await mongoose.connect(url);
        res.send('Connected to MongoDB');
    } catch (error) {
        res.status(500).send(`Error connecting to MongoDB: ${error.message}`);
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 