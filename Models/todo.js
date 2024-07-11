const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;

