const express = require("express");
const router = express.Router();
const Todo = require("../Models/todo");
const fs = require('fs');
const path = require('path');

router.get('/todos', async (req, res) => {
    try {
        console.log("sefsefsefseferf");
        const todos = await Todo.find();
        console.log(todos);
        res.json(todos);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

router.get('/todos/:id', async (req, res) => {
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

router.post('/create', async (req, res) => {
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

router.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const todo = await Todo.findOneAndUpdate({ id }, { title, content }, { new: true });
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.json(todo);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

router.delete('/todos/:id', async (req, res) => {
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

router.get('/download', async (req, res) => {
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

module.exports = router;
