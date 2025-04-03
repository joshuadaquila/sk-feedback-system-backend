const mysql = require('mysql2');  // Using mysql2 for better performance and connection pooling

// Configure MySQL connection pool with hardcoded credentials
const db = mysql.createPool({
  host: 'sql12.freesqldatabase.com',  // Host address
  user: 'sql12770988',  // Database user
  password: 'lu3XGPTAW9',  // Database password
  database: 'sql12770988',  // Database name
  port: 3306,  // Port for MySQL (default 3306)
  connectionLimit: 700,  // Max number of connections in the pool
  acquireTimeout: 30000, // Timeout for acquiring a connection (30 seconds)
  timeout: 60000,        // Timeout for query execution (1 minute)
  connectTimeout: 60000, // Timeout for initial connection (1 minute)
  charset: 'utf8mb4',    // Charset for the database
});

// Periodic connection ping to ensure the connection is active
setInterval(() => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection for ping:', err);
    } else {
      connection.ping((err) => {
        if (err) {
          console.error('Error pinging MySQL server:', err);
        } else {
          console.log('MySQL connection is active and healthy!');
        }
        connection.release(); // Always release the connection back to the pool
      });
    }
  });
}, 600000); // Ping every 10 minutes

// Log a success message when the initial connection is established
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error getting initial connection:', err);
  } else {
    console.log('MySQL connection established successfully!');
    connection.release(); // Always release the connection back to the pool
  }
});

module.exports = db;  // Export the pool for use in other parts of your app
