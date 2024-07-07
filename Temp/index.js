const express = require('express');

const app = express();

app.use(express.json());
const path = require('path');

app.get('/', (req, res) => {
    try {
        res.send('Welcome');
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }
});

app.post('/submit', (req, res) => {
    try {
        res.json(req.body);
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }
});

app.put('/edit', (req, res) => {
    try {
        const { name, age, color } = req.query;
        res.json({ name, age, color });
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }
});

app.delete('/delete/:id', (req, res) => {
    try {
        const { id } = req.params;
        res.send(`Deleted id: ${id}`);
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }
});

app.get('/download', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'Files', 'file.txt');
        res.download(filePath);
    } catch (error) {
        res.status(500).send(`${error.message}`);
    }
});

app.listen(4000, () => {
    console.log(`Server running on port ${PORT}`);
});