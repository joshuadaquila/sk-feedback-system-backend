const mysql = require('mysql2');

// Create a connection pool
const db = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12765606',
  password: 'x9a6md7bd7',
  database: 'sql12765606',
  waitForConnections: true,    // Ensures that the pool will wait for a connection before throwing an error
  connectionLimit: 10,         // Max number of connections
  queueLimit: 0                // No limit on waiting connections
});

// Optional: Test connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
  connection.release();  // Release the connection back to the pool
});

module.exports = db;  // Exporting the pool as db
