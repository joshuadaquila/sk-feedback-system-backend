const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db'); 
require('dotenv').config();

const router = express.Router();

router.post('/createAccount', async (req, res) => {
  const {
    userId,
    firstName,
    middleName,
    lastName,
    extensionName,
    birthday,
    purok,
    civilStatus,
    educationBackground,
    userName,
    userType, // userType will have a default value 'user', so it can be optional
    password,
    status,
    gender,
  } = req.body;

  try {
    // If userType is not provided, default it to 'user'
    const finalUserType = userType || 'user';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use current timestamp for createdAt if not provided
    const createdAt = new Date();  // This will provide the current timestamp

    const sql = `
      INSERT INTO user (
        firstName, middleName, lastName, extensionName,
        birthday, purok, civilStatus, educationBackground, userName, userType,
        password, createdAt, status, gender
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      firstName, middleName, lastName, extensionName,
      birthday, purok, civilStatus, educationBackground, userName, userType,
      hashedPassword, createdAt, status, gender
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create account' });
        return;
      }
      res.status(201).json({ message: 'Account created successfully!' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error hashing password' });
  }
});


router.get('/getTest', async (req, res) => {
  console.log("Hello World");
  res.send("Hello World");
});

router.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  console.log(userName, password);

  if (!userName || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const sql = 'SELECT * FROM user WHERE userName = ?';
  db.query(sql, [userName], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = results[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const payload = {
      userId: user.userId,
      userName: user.userName,
      role: user.userType,
    };

    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
        message: 'Login successful!',
        role: user.userType,
        userId: user.userId,
        token,
      });
    } catch (err) {
      console.error('Error signing JWT:', err);
      res.status(500).json({ error: 'Error generating JWT token' });
    }
  });
});

router.post('/addEvent', async (req, res) => {
  const { eventName, description, place, userId, startDate, endDate } = req.body;

  console.log(req.body)

  // Ensure all required fields are provided
  if (!eventName || !description || !place || !userId || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // SQL query to insert the event
  const sql = `INSERT INTO events (eventName, description, place, userId, startDate, endDate)
               VALUES (?, ?, ?, ?, ?, ?)`;

  // Perform the insertion
  db.query(sql, [eventName, description, place, userId, startDate, endDate], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json({ message: 'Event added successfully', eventId: results.insertId });
  });
});

router.get('/getAllEvents', async (req, res) => {
  const sql = 'SELECT e.*, u.* FROM events e INNER JOIN user u ON e.userId = u.userId'; 

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No events found' });
    }
    return res.status(200).json({ events: results });
  });
});

router.post("/CreateAnnouncements", async (req, res) => {
  const { title, description, audience } = req.body;

  // Ensure required fields are provided
  if (!title || !description || !audience) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const createdAt = new Date();  // Use current timestamp for createdAt if not provided
  
  const sql = `INSERT INTO Announcements (title, description, audience, createdAt, status) 
               VALUES (?, ?, ?, ?, 'active')`;

  db.query(sql, [title, description, audience, createdAt], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create announcement' });
    }
    return res.status(201).json({ message: 'Announcement created successfully!', announcementId: result.insertId });
  });
});



module.exports = router;
