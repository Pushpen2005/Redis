import express from 'express';
import { emailQueue } from './queue.js';

const app = express();
const port = 3009;

app.use(express.json());

app.post('/email', async (req, res) => {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
        return res.status(400).json({
            error: 'To, subject, and body are required.'
        });
    }

    const email = { to, subject, body };

    await emailQueue.add('sendEmail', email);

    res.json({
        message: 'Email job added to the queue successfully.'
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});