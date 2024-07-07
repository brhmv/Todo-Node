const express = require('express');
const app = express();
const port = 3000;
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

let todos = [
    { id: uuidv4(), title: 'Learn Express', content: 'Study the basics of Express.js' },
    { id: uuidv4(), title: 'Learn CRUD', content: 'Create, Read, Update,Delete' },
    { id: uuidv4(), title: 'Learn Middleware', content: 'Learn  middleware functions in Express.js' }
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/todos', (req, res) => {
    try {
        res.json(todos);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.get('/todos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const todo = todos.find(item => item.id === id);
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.json(todo);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.post('/create', (req, res) => {
    try {
        const { title, content } = req.body;
        const newTodo = {
            id: uuidv4(),
            title,
            content
        };
        todos.push(newTodo);
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.put('/todos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const todo = todos.find(item => item.id === id);
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        if (title) todo.title = title;
        if (content) todo.content = content;
        res.json(todo);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.delete('/todos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const index = todos.findIndex(item => item.id === id);
        if (index === -1) {
            return res.status(404).send('Todo not found');
        }
        todos.splice(index, 1);
        res.send('Todo deleted');
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.get('/download', (req, res) => {
    try {
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
