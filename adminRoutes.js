const express = require('express');
const axios = require('axios');
const db = require('./db');
require('dotenv').config();

const router = express.Router();

router.get('/generateReport', async (req, res) => {
  const eventId = req.query.eventId;

  // Base SQL query to fetch feedback content
  let sql = `
    SELECT f.content 
    FROM feedbacks f
    INNER JOIN user u ON f.userId = u.userId
  `;

  // If eventId is provided, add a WHERE condition to filter by eventId
  const queryParams = [];
  if (eventId) {
    sql += ' WHERE eventId = ?';
    queryParams.push(eventId);
  }

  try {
    // Execute the SQL query and wait for the result
    const feedbacks = await new Promise((resolve, reject) => {
      db.query(sql, queryParams, (err, result) => {
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
      'http://127.0.0.1:5000/predict',
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

router.get('/generateEventReport', async (req, res) => {
  const eventId = req.query.eventId;

  // Base SQL query to fetch event details and feedback content
  let sql = `
    SELECT e.*, f.content, f.eventId
    FROM feedbacks f
    INNER JOIN user u ON f.userId = u.userId
    INNER JOIN events e ON e.eventId = f.eventId
  `;

  // If eventId is provided, add a WHERE condition to filter by eventId
  const queryParams = [];
  if (eventId) {
    sql += ' WHERE f.eventId = ?';
    queryParams.push(eventId);
  }

  try {
    // Execute the SQL query and wait for the result
    const results = await new Promise((resolve, reject) => {
      db.query(sql, queryParams, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // If no feedbacks are found for the given eventId, handle the case
    if (results.length === 0) {
      return res.status(404).json({
        message: 'No feedback found for this event.',
      });
    }

    // Extract event details (only the first row contains event details)
    const eventDetails = results[0]; // The first row should contain event details
    const eventIdFromDetails = eventDetails.eventId; // Extract eventId from the event details row

    // Map all feedback content along with the corresponding eventId
    const feedbacksWithEventId = results.map(feedback => ({
      eventId: feedback.eventId,  // Event ID from feedback
      content: feedback.content,  // Feedback content
    }));

    // Extract all feedback content and map them into an array of strings
    // const feedbackTexts = feedbacksWithEventId.map(feedback => feedback.content);

    // Include the eventId in the data sent to the sentiment analysis API
    const sentimentRequestData = {
      // eventId: eventIdFromDetails,  // Use eventId from the eventDetails
      texts: feedbacksWithEventId,         // Include the feedback content
    };

    // Send the feedback content and eventId to the external API for sentiment analysis
    const sentimentResponse = await axios.post(
      'http://127.0.0.1:5000/predictEvent',
      sentimentRequestData  // Send the eventId and feedback texts
    );

    // Respond with the event details and the sentiment analysis data
    res.status(200).json({
      message: 'Sentiments processed successfully',
      eventDetails: eventDetails,  // Send event details
      feedbacks: feedbacksWithEventId,    // Send feedbacks with eventId
      sentimentData: sentimentResponse.data,  // Sentiment analysis result
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
