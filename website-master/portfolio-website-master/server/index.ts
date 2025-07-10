const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const compression = require('compression');

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../public')));

// POST /api/send-email
app.post('/api/send-email', async (req, res) => {
    const { name, company, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.FOLIO_EMAIL || !process.env.FOLIO_PASSWORD) {
        console.error('FOLIO_EMAIL or FOLIO_PASSWORD environment variable is missing.');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // TLS
        auth: {
            user: process.env.FOLIO_EMAIL,
            pass: process.env.FOLIO_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    try {
        await transporter.verify();

        const info = await transporter.sendMail({
            from: `"${name}" <jezmmit@gmail.com>`,
            to: 'jsmmit029@gmail.com, jezmmit@gmail.com',
            subject: `${name} <${email}> ${company ? `from ${company}` : ''} submitted a contact form`,
            text: message,
        });

        console.log('Email sent:', info.messageId);
        res.json({ message: 'Email sent successfully' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
