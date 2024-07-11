const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const port = 3000;
const todoRoutes = require("./Routes/todoRoutes");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

app.use("/api/v1/todos", todoRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});