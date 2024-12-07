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
    status,
    gender,
  } = req.body;

  try {
    const finalUserType = userType || 'user';
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date();

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

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']; 
  if (!token) return res.status(403).send('Token is required');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = decoded; 
    next();
  });
};

router.get('/getProfile', verifyToken, async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1]; 
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const verifyToken = (req, res, next) => {
      const token = req.headers['authorization']; 
      if (!token) {
        console.log("No token provided");
        return res.status(403).send('Token is required');
      }
    
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log("Invalid token:", err);
          return res.status(403).send('Invalid token');
        }
        console.log("Decoded Token:", decoded); 
        req.user = decoded; 
        next();
      });
    };
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      
      const sql = 'SELECT * FROM user WHERE userId = ?';
      db.query(sql, [decoded.userId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        res.json({
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          address: user.address,
          purok: user.purok,
          profilePic: user.profilePic || 'https://via.placeholder.com/150',
        });
      });
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Server error');
  }
});

router.post('/addEvent', async (req, res) => {
  const { eventName, description, place, userId, startDate, endDate } = req.body;

  console.log(req.body)
  if (!eventName || !description || !place || !userId || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = `INSERT INTO events (eventName, description, place, userId, startDate, endDate)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [eventName, description, place, userId, startDate, endDate], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json({ message: 'Event added successfully', eventId: results.insertId });
  });
});

router.post('/addFeedback', async (req, res) => {
  const { userId, eventId, content } = req.body;

  console.log(req.body)
  const sql = `INSERT INTO feedbacks (userId, eventId, content, status)
               VALUES (?, ?, ?, ?)`;
  db.query(sql, [userId, eventId, content, "active"], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json({ message: 'Feedback added successfully', eventId: results.insertId });
  });
});

router.get('/getFeedback', async (req, res) => {
  const sql = `
    SELECT 
      CASE 
        WHEN e.startDate > NOW() THEN 'upcoming'
        WHEN e.startDate <= NOW() AND e.endDate >= NOW() THEN 'ongoing'
        ELSE 'past'
      END AS category,
      COUNT(f.feedbackId) AS feedbackCount
    FROM feedbacks f
    JOIN events e ON f.eventId = e.eventId
    WHERE f.status = 'active'
    GROUP BY category;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    const feedbackCounts = results.reduce((acc, row) => {
      acc[row.category] = row.feedbackCount;
      return acc;
    }, { upcoming: 0, ongoing: 0, past: 0 });

    return res.status(200).json(feedbackCounts);
  });
});

router.get('/getFeedbackByEvent/:eventId', async (req, res) => {
  const { eventId } = req.params;

  const sql = `
    SELECT 
      f.content,
      f.userId
    FROM feedbacks f
    WHERE f.eventId = ? AND f.status = 'active'
    ORDER BY f.createdAt DESC;
  `;

  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json({ feedbacks: results });
  });
});


// router.post('/user/checkFeedback', (req, res) => {
//   const { userId, eventId } = req.query;

//   if (!userId || !eventId) {
//     return res.status(400).json({ message: 'userId and eventId are required' });
//   }

//   const sql = 'SELECT COUNT(*) AS count FROM feedbacks WHERE userId = ? AND eventId = ?';
//   db.query(sql, [userId, eventId], (err, results) => {
//     if (err) {
//       console.error('Error checking feedback:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     const feedbackExists = results[0].count > 0;
//     res.json({ exists: feedbackExists });
//   });
// });


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
  if (!title || !description || !audience) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const createdAt = new Date();
  
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
