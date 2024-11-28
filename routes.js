const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db'); 

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
    educBgId,
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
        userId, firstName, middleName, lastName, extensionName,
        birthday, purok, civilStatus, educBgId, userName, userType,
        password
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId, firstName, middleName, lastName, extensionName,
      birthday, purok, civilStatus, educBgId, userName, userType,
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

module.exports = router;
