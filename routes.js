const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db'); 
require('dotenv').config();
const axios = require('axios')
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

  const sql = 'SELECT * FROM user WHERE userName = ? AND status = "active"';
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

      // Now update the lastLogin field in the user table
      const updateSql = 'UPDATE user SET lastLogin = CURRENT_TIMESTAMP WHERE userId = ?';
      db.query(updateSql, [user.userId], (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error updating lastLogin:', updateErr);
          return res.status(500).json({ error: 'Error updating last login time' });
        }

        // Respond with success message and token
        res.status(200).json({
          message: 'Login successful!',
          role: user.userType,
          userId: user.userId,
          token,
        });
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

router.get('/getProfile', async (req, res) => {
  try {
    // console.log("Starting /getProfile request");

    // Extract and log the token
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.error("No Authorization header provided");
      return res.status(401).json({ error: 'No Authorization header provided' });
    }

    // console.log("Authorization header received:", authHeader);

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error("No token provided in Authorization header");
      return res.status(401).json({ error: 'No token provided' });
    }

    // console.log("Extracted token:", token);

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err.message);
        return res.status(403).json({ error: 'Invalid token' });
      }

      console.log("Token successfully verified. Decoded payload:", decoded);

      // Log the SQL query and parameters
      const sql = 'SELECT * FROM user WHERE userId = ?';
      // console.log("Executing SQL query:", sql, "with parameter:", decoded.userId);

      db.query(sql, [decoded.userId], (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: 'Database error' });
        }

        // console.log("Query results:", results);

        if (results.length === 0) {
          console.warn("No user found with userId:", decoded.userId);
          return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        // console.log("User data retrieved:", user);

        res.json({
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          address: user.address,
          purok: user.purok,
          profilePic: user.profilePic || 'https://via.placeholder.com/150',
        });
        // console.log("Profile data sent to client");
      });
    });
  } catch (error) {
    console.error("Unexpected error in /getProfile:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/getNotifications', async (req, res) => {
  const sql = `SELECT * FROM notification`;

  // Execute the query to fetch notifications
  db.query(sql, (err, results) => {
    if (err) {
      // Log the error and send a 500 status if there's a database error
      console.error('Error fetching notifications:', err);
      return res.status(500).json({ error: 'Database error while fetching notifications' });
    }

    // If there are results, send them back as a JSON response
    return res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications: results
    });
  });
});


router.post('/addEvent', async (req, res) => {
  const { eventName, description, place, userId, startDate, endDate } = req.body;

  console.log(req.body);

  // Check for missing fields
  if (!eventName || !description || !place || !userId || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // SQL query to insert the event
  const sql = `INSERT INTO events (eventName, description, place, userId, startDate, endDate)
               VALUES (?, ?, ?, ?, ?, ?)`;

  // Insert event into the database
  db.query(sql, [eventName, description, place, userId, startDate, endDate], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Prepare the notification data
    const notification = {
      eventId: results.insertId,  // Store the event ID so that we know which event the notification relates to
      app_id: "26afd8bc-bd56-4ff1-804c-8490b49d4d2d", // OneSignal app ID
      headings: { "en": "New event is added. Check it out!" },
      contents: { "en": eventName },
      included_segments: "Total Subscriptions", // Send notification to all users, or you can customize it
      data: {}
    };

    // SQL query to insert the notification into the notifications table
    const notificationSql = `INSERT INTO notification (content, type)
                             VALUES (?, ?)`;

    // Insert notification into the database
    db.query(notificationSql, [
      JSON.stringify(notification.contents),
      "event"
    ], (err, notificationResults) => {
      if (err) {
        console.error('Error inserting notification into database:', err);
        return res.status(500).json({ error: 'Error inserting notification' });
      }

      console.log('Notification inserted into database:', notificationResults);

      // Now, send the notification via OneSignal
      const notificationPayload = {
        app_id: notification.app_id,
        headings: notification.headings,
        contents: notification.contents,
        included_segments: notification.included_segments,
        data: notification.data
      };

      const options = {
        method: 'POST',
        url: 'https://onesignal.com/api/v1/notifications',  // OneSignal API endpoint
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'Authorization': `Basic os_v2_app_e2x5rpf5kzh7dacmqsiljhknfw2bfbzk3pmeovvnxwbmull6orajzbjwxdyinuj6yclfrcjxi7qfeondrhtfg2qi2zgilwvm4lzydwi` // Replace with your OneSignal REST API Key
        },
        data: notificationPayload
      };

      axios(options)
        .then(response => {
          console.log('Notification sent via OneSignal:', response.data);
        })
        .catch(error => {
          console.error('Error sending notification:', error);
        });

      // Return response to the client
      return res.status(200).json({ message: 'Event added, notification stored, and push notification sent successfully', eventId: results.insertId });
    });
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

router.get('/getAllUsers', async (req, res) => {
  const sql = `
    SELECT *
    FROM user
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    

    return res.status(200).json(results);
  });
});


router.get('/getFeedbackByEvent/:eventId', async (req, res) => {
  const { eventId } = req.params;

  const sql = `
    SELECT 
      f.*
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

router.post('/CreateAnnouncements', async (req, res) => {
  try {
    const { title, description, audience = "All", userId } = req.body; 
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    

    const notification = {
      "app_id": "26afd8bc-bd56-4ff1-804c-8490b49d4d2d", // OneSignal app ID
      "headings": { "en": "Announcement" },
      "contents": { "en": title },
      "included_segments": "Total Subscriptions", // Send notification to all users, or you can customize it
      "data": {}
    };

    const sql = `
      INSERT INTO Announcement (title, description, audience, status, userId) 
      VALUES (?, ?, ?, 'active',?)
    `;
    db.query(sql, [title, description, audience, userId], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to create announcement" });
      }
      
      const options = {
        method: 'POST',
        url: 'https://onesignal.com/api/v1/notifications', // Correct OneSignal API endpoint
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'Authorization': `Basic os_v2_app_e2x5rpf5kzh7dacmqsiljhknfw2bfbzk3pmeovvnxwbmull6orajzbjwxdyinuj6yclfrcjxi7qfeondrhtfg2qi2zgilwvm4lzydwi` // Replace with your OneSignal REST API Key
        },
        data: notification
      };
  
      // Make API call to send notification
      axios(options)
        .then(response => {
          console.log('Notification sent:', response.data);
        })
        .catch(error => {
          console.error('Error sending notification:', error);
        });
  
      res.status(201).json({
        message: "Announcement created successfully!",
        announcementId: result.insertId,
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});


router.get('/getAnnouncements', async (req, res) => {
  const sql = `
    SELECT a.*, u.userName 
    FROM announcement a
    LEFT JOIN user u ON a.userId = u.userId;

`; 


  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No announcements found' });
    }
    
    return res.status(200).json({ announcements: results });
  });
});


router.delete('/deleteAnnouncement/:announcementId', async (req, res) => {
  const { announcementId } = req.params;  
  if (!announcementId) {
    return res.status(400).json({ error: "Announcement ID is required" });
  }

  try {
    const sql = "DELETE FROM Announcement WHERE announcementId = ?";  

    db.query(sql, [announcementId], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to delete announcement" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Announcement not found" });
      }

      res.status(200).json({ message: "Announcement deleted successfully!" });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});


router.delete('/deleteEvent/:eventId', async (req, res) => {
  const { eventId } = req.params; 

  if (!eventId) {
    return res.status(400).json({ error: "Event ID is required" });
  }

  try {
    const sql = "DELETE FROM Events WHERE eventId = ?";  

    db.query(sql, [eventId], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to delete event" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.status(200).json({ message: "Event deleted successfully!" });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});



module.exports = router;
