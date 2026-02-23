require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect to database
connectDB();

app.use(express.json()); // parse JSON bodies

app.get('/', (req, res) => {
  res.send('API running');
});

// mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// example endpoint (can remove after development)
app.get('/api/items', (req, res) => {
  res.json([{ id: 1, name: 'Item One' }]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));