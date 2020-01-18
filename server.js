const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extened: false }));

app.get('/', (req, res) => res.send('REST Api Running'));

// Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/transactions', require('./routes/api/transactions'));
app.use('/api/receivers', require('./routes/api/receivers'));
app.use('/api/plaid', require('./routes/api/plaid'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
