const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokens = [];

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Missing required fields');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        passwordHash
    });

    try {
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send(`Error registering user: ${error.message}`);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Missing required fields');
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
    }

    const accessToken = jwt.sign({ userId: user._id }, accessTokenSecret, { expiresIn: '20m' });
    const refreshToken = jwt.sign({ userId: user._id }, refreshTokenSecret);

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
});

router.post('/refresh', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).send('Refresh token required');
    }

    if (!refreshTokens.includes(token)) {
        return res.status(403).send('Invalid refresh token');
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid refresh token');
        }

        const accessToken = jwt.sign({ userId: user.userId }, accessTokenSecret, { expiresIn: '20m' });

        res.json({ accessToken });
    });
});

module.exports = router;
