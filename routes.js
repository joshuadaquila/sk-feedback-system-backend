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
    userType,
    password,
    createdAt,
    status
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO user (
        firstName, middleName, lastName, extensionName,
        birthday, purok, civilStatus, educationBackground, userName, userType,
        password, createdAt, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      firstName, middleName, lastName, extensionName,
      birthday, purok, civilStatus, educationBackground, userName, userType,
      hashedPassword, createdAt, status
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
        token,
      });
    } catch (err) {
      console.error('Error signing JWT:', err);
      res.status(500).json({ error: 'Error generating JWT token' });
    }
  });
});

module.exports = router;
