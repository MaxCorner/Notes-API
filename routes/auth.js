require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ error: 'Missing username or password' });

    const db = req.app.locals.db;

    try {
        const existingUser = await db.collection('users').findOne({ username });
        
        if (existingUser)
            return res.status(400).json({ error: 'Username taken'});

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await db.collection('users').insertOne({
            username,
            passwordHash,
        });

        res.status(201).json({ message: 'User created', userId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const db = req.app.locals.db;

    try {
        const user = await db.collection('users').findOne({ username });

        if (!user)
            return res.status(401).json({ error: 'Invalid credentails' });

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid)
            return res.status(401).json({ error: 'Invalid credentails' });

        const token = JWT.sign(
            {
                userId: user._id.toString(),
                username: user.username
            },
            JWT_KEY
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;