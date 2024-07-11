const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(express.json());

router.get('/', authenticateJWT, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.userId });
        res.json(todos);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOne({ userId: req.user.userId, _id: id });
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.json(todo);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

router.post('/', authenticateJWT, async (req, res) => {
    try {
        const { title, content } = req.body;

        const newTodo = new Todo({
            userId: req.user.userId,
            title,
            content
        });

        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const todo = await Todo.findOne({ userId: req.user.userId, _id: id });
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

router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOneAndDelete({ userId: req.user.userId, _id: id });
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.send('Todo deleted');
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

module.exports = router;
