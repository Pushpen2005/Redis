import express from 'express';
import Redis from 'ioredis';

const app = express();
const port = 3009;

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const QUEUE_KEY = 'email:queue';

app.post('/email', async (req, res) => {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
        return res.status(400).json({ error: 'To, subject, and body are required.' });
    }

    const email = { to, subject, body };
    await redis.lpush(QUEUE_KEY, JSON.stringify(email));
    res.json({ message: 'Email added to queue successfully.' });
});

app.get('/email/next', async (req, res) => {
    const emailData = await redis.rpop(QUEUE_KEY);
    if (!emailData) {
        return res.status(404).json({ error: 'No emails in the queue.' });
    }

    const email = JSON.parse(emailData);
    res.json(email);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});