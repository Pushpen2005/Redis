import express from 'express';
import Redis from 'ioredis';

const app = express();
const port = 3009;

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json());

//JSON
app.post('/user/:id/json', async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({ message: 'User profile cached successfully.' });
});

app.get('/user/:id/json', async (req, res) => {
    const userProfile = await redis.get(`user:${req.params.id}:json`);
    if (!userProfile) {
        return res.status(404).json({ error: 'User profile not found in cache.' });
    }
    res.json(JSON.parse(userProfile));
});
//HASH

app.post('/user/:id/hash', async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({ message: 'User profile cached successfully.' });
});

app.get('/user/:id/hash', async (req, res) => {
    const userProfile = await redis.hgetall(`user:${req.params.id}:hash`);
    if (Object.keys(userProfile).length === 0) {
        return res.status(404).json({ error: 'User profile not found in cache.' });
    }
    res.json(userProfile);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});