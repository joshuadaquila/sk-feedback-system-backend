const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12765606',
  password: 'x9a6md7bd7',
  database: 'sql12765606'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

module.exports = db;
