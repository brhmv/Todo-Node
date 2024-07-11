const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const port = 3000;
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require('./routes/authRoutes');
dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

app.use("/todos", todoRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});