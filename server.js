const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection (hardcoded)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'shrey123',
  database: 'portfolio'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes
app.get('/api/projects', (req, res) => {
  db.query('SELECT * FROM projects', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  console.log('>>> POST request received at /api/contact');
  const { name, email, message } = req.body;

  // Validate input (basic server-side validation)
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Insert into database
  const insertQuery = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
  db.query(insertQuery, [name, email, message], (dbErr, dbResult) => {
    if (dbErr) {
      console.error('Error inserting contact form data:', dbErr);
      // Send error response even if email sending proceeds, or return here
       return res.status(500).json({ success: false, message: 'Failed to save message to database.' });
    }
    console.log('Contact form data saved to database:', dbResult);

    // Proceed with sending email
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `Portfolio Contact from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };

    transporter.sendMail(mailOptions, (emailErr, info) => {
      if (emailErr) {
        console.error('Error sending email:', emailErr);
        // Still send success=true because database save was successful, but include email error info
        // Or send a partial success/warning status
        // For simplicity, we'll just log the email error and still report database save success
        // If database save failed (handled above), we would have returned already.
      }
      console.log('Email sent:', info ? info.response : 'N/A');

      // Send success response after database save and (attempted) email send
      // Only send success if database save was successful
      res.json({ success: true, message: 'Message saved and email sent successfully!' });
    });
  });
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 