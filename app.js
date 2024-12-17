const fs = require('fs');
const path = require('path');

const ics = require('ics');
require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const nodemailer = require('nodemailer');
// ... other imports

const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const transporter = require('./emailService'); // Import the transporter
const crypto = require('crypto'); // For generating secure tokens

const app = express();


const PORT = 3000;
function createEvent(event, callback) {
    ics.createEvent({
        start: event.start,
        end: event.end,
        title: event.title,
        description: event.description,
        location: event.location
    }, (error, value) => {
        callback(error, value);
    });
}

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./reservations.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the reservations database.');
        db.run(`CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            start_date TEXT,
            end_date TEXT,
            name TEXT,
            email TEXT,
            phone TEXT,
            message TEXT,
            status TEXT,
            token TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Reservations table is ready.');
            }
        });
    }
});

// Utility function to generate a secure token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// POST reservation
app.post('/api/reservations', (req, res) => {
    console.log('Received reservation POST request:', req.body);
    const { startDate, endDate, name, email, phone, message } = req.body;
    if (!startDate || !endDate || !name || !email || !phone) {
        console.log('Missing required fields in reservation.');
        return res.status(400).json({ error: 'Missing required fields.' });
    }
    const token = generateToken(); // Generate a unique token for action links
    const sql = `INSERT INTO reservations (start_date, end_date, name, email, phone, message, status, token) 
                 VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`;
    db.run(sql, [startDate, endDate, name, email, phone, message, token], function(err) {
        if (err) {
            console.error('Error inserting reservation:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`Reservation inserted with ID: ${this.lastID}`);
        
        // Generate ICS file
        const event = {
            start: startDate.split('-').map(Number), // e.g., [2024, 12, 25]
            end: endDate.split('-').map(Number),
            title: `Rezervace: ${name}`,
            description: `Rezervační údaje:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
        };

        createEvent(event, (error, value) => {
            if (error) {
                console.error('Chyba při vytváření události v kalendáři:', error);
                value = null; // No ICS attachment if error occurs
            }

            // Send email notification to admin
            const acceptUrl = `http://localhost:${PORT}/api/reservations/${this.lastID}/accept?token=${token}`;
            const declineUrl = `http://localhost:${PORT}/api/reservations/${this.lastID}/decline?token=${token}`;

            const mailOptions = {
                from: 'holubkevin455@gmail.com',       // Sender address
                to: 'holubkevin455@gmail.com',      // Admin's email address
                subject: 'Nová rezervace přijata',
                html: `
                    <h3>Detaily nové rezervace</h3>
                    <p><strong>Jméno:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Tel. číslo:</strong> ${phone}</p>
                    <p><strong>Datum příjezdu:</strong> ${startDate}</p>
                    <p><strong>Datum odjezdu:</strong> ${endDate}</p>
                    <p><strong>Zpráva:</strong> ${message}</p>
                    <p>
                        <a href="${acceptUrl}">Přijmout rezervaci</a> | 
                        <a href="${declineUrl}">Zamítnout rezervaci</a>
                    </p>
                    <p>Zapomocí odkazů můžete přijmout nebo odmítnout rezervaci od ${name}</p>
                `,
                icalEvent: {
                    filename: 'reservation.ics',
                    method: 'REQUEST',
                    content: value, // Attach the ICS file content
                },
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Chyba při odesíláni emailu email:', error);
                } else {
                    console.log('Email poslán: ' + info.response);
                }
            });

            res.json({ 
                message: 'Rezervace přijata. Potvrzení pošleme emailem.', 
                id: this.lastID 
            });
        });
    });
});

// ... rest of your routes ...
app.get('/', (req, res) => {
    res.send('Vítejte v rezervačním systému Chaty');
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// GET accept reservation
app.get('/api/reservations/:id/accept', (req, res) => {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('Missing token.');
    }

    const verifySql = `SELECT token, status, name, email, start_date, end_date, message FROM reservations WHERE id = ?`;
    db.get(verifySql, [id], (err, row) => {
        if (err) {
            console.error('Error fetching reservation:', err.message);
            return res.status(500).send('Internal Server Error');
        }
        if (!row) {
            return res.status(404).send('Reservation not found.');
        }
        if (row.token !== token) {
            return res.status(403).send('Invalid token.');
        }
        if (row.status !== 'pending') {
            return res.status(400).send(`Reservation is already ${row.status}.`);
        }

        const updateSql = `UPDATE reservations SET status='accepted' WHERE id=?`;
        db.run(updateSql, [id], function(err) {
            if (err) {
                console.error('Error updating reservation:', err.message);
                return res.status(500).send('Internal Server Error');
            }
            if (this.changes === 0) {
                return res.status(404).send('Reservation not found.');
            }
            console.log(`Reservation ID ${id} accepted.`);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: row.email, // Send to user's email
                subject: 'Vaše rezervace byla přijmuta',
                text: `Milý/Milá ${row.name}, Vaše rezervace byla přijmuta. Děkujeme za rezervaci a tešíme se na Váš pobyt v naší chatě.`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Chyba při odesíláni emailu:', error);
                } else {
                    console.log('Email o přijmutí rezervace odeslán:', info.response);
                }
            });
            // You can continue with sending response or sending emails here
            res.send('Rezervace přijmuta a email odeslán.');
        });
    });
});

// app.js (or your main server file)

// ... existing imports and setup

// GET decline reservation
app.get('/api/reservations/:id/decline', (req, res) => {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('Missing token.');
    }

    // Verify the token
    const verifySql = `SELECT token, status, name, email FROM reservations WHERE id = ?`;
    db.get(verifySql, [id], (err, row) => {
        if (err) {
            console.error('Error fetching reservation:', err.message);
            return res.status(500).send('Internal Server Error');
        }
        if (!row) {
            return res.status(404).send('Reservation not found.');
        }
        if (row.token !== token) {
            return res.status(403).send('Invalid token.');
        }
        if (row.status !== 'pending') {
            return res.status(400).send(`Reservation is already ${row.status}.`);
        }

        // Update the reservation status to 'declined'
        const updateSql = `UPDATE reservations SET status='declined' WHERE id=?`;
        db.run(updateSql, [id], function(err) {
            if (err) {
                console.error('Error updating reservation:', err.message);
                return res.status(500).send('Internal Server Error');
            }
            if (this.changes === 0) {
                return res.status(404).send('Reservation not found.');
            }
            console.log(`Reservation ID ${id} declined.`);

            // Send decline email to user
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: row.email, // Send to user's email
                subject: 'Vaše rezervace byla zamítnuta',
                text: `Milý/Milá ${row.name}, s lítostí vám oznamujeme, že Vaše rezervace byla zamítnuta, pravděpodobně nám přišly dvě rezervace na stejný datum zároveň. Můžete zkusit se kouknout na stránku znovu a zarezervovat jiné dny. Děkujeme a přejeme hezký den.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Chyba při odesíláni emailu o zamítnutí rezervace:', error);
                } else {
                    console.log('Email o zamítnutí rezervace byl odeslán:', info.response);
                }
            });

            res.send('Rezervace byla zamítnuta a email byl odeslán.');
        });
    });
});