import {connection} from './queue.js';
import {Worker} from 'bullmq';

const worker = new Worker('emailQueue', async job => {
    const {to, subject, body} = job.data;
    console.log(`Sending email to: ${to}, subject: ${subject}, body: ${body}`);
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Email sent to: ${to}`);
}, { connection });

worker.on('completed', job => {
    console.log(`Job completed with result: ${job.returnvalue}`);
});

worker.on('failed', (job, err) => {
    console.error(`Job failed with error: ${err.message}`);
});

