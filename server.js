const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connecting to database
connectDB();

app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));
