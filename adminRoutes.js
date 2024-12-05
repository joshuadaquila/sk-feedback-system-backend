const express = require('express');
const axios = require('axios');
const db = require('./db');
require('dotenv').config();

const router = express.Router();

router.get('/generateReport', async (req, res) => {
  const eventId = req.query.eventId;

  // SQL query to fetch feedback content
  const sql = `
    SELECT f.content 
    FROM feedbacks f
    INNER JOIN user u ON f.userId = u.userId
    WHERE eventId = ?
  `;

  try {
    // Execute the SQL query and wait for the result
    const feedbacks = await new Promise((resolve, reject) => {
      db.query(sql, [eventId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Extract feedback content and format it as an array of strings
    const feedbackTexts = feedbacks.map(feedback => feedback.content);

    // Send the feedback content to the external API in the required format
    const sentimentResponse = await axios.post(
      'https://sentiment-api-1.onrender.com/predict',
      { texts: feedbackTexts } // Proper format: { texts: ["feedback1", "feedback2", ...] }
    );

    // Respond with the external API's response
    res.status(200).json({
      message: 'Sentiments processed successfully',
      data: sentimentResponse.data,
    });
  } catch (error) {
    console.error('Error:', error.message);

    // Handle errors appropriately
    res.status(500).json({
      message: 'Error processing sentiments',
      error: error.message,
    });
  }
});

router.get('/getRawFeedbacks', (req, res) => {
  const eventId = req.query.eventId;

  const sql = `
    SELECT f.*, u.* FROM feedbacks f
    INNER JOIN user u ON f.userId = u.userId
    WHERE f.eventId = ?
  `;

  db.query(sql, [eventId], (err, result) => {
    if (err) {
      console.error('Error fetching feedbacks:', err);
      return res.status(500).json({
        message: 'Error fetching feedbacks',
        error: err.message,
      });
    }

    res.status(200).json(result);
  });
});

module.exports = router;
