const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import database connection
const userRoutes = require('./routes');
const adminRoutes = require('./adminRoutes')

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);
app.use('/admin', adminRoutes)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
