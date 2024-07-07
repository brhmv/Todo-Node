const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const port = 3000;
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

const todoSchema = new mongoose.Schema({
    id: { type: String },
    title: { type: String },
    content: { type: String }
});

const Todo = mongoose.model('Todo', todoSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/todos', async (req, res) => {
    try {
        console.log("Fetching todos");

        console.log(Todo.length);
        const todos = await Todo.find();
        console.log("Todos fetched", todos);

        res.json(todos);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.get('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOne({ id });
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.json(todo);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.post('/create', async (req, res) => {
    try {
        const { title, content } = req.body;

        const newTodo = new Todo({
            title,
            content
        });

        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const todo = await Todo.findOne({ id });
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        if (title) todo.title = title;
        if (content) todo.content = content;
        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOneAndDelete({ id });
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.send('Todo deleted');
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.get('/download', async (req, res) => {
    try {
        const todos = await Todo.find();
        const filePath = path.join(__dirname, 'todos.txt');
        const fileContent = todos.map(todo => `ID: ${todo.id}, Title: ${todo.title}, Content: ${todo.content}`).join('\n');
        fs.writeFileSync(filePath, fileContent);
        res.download(filePath);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});