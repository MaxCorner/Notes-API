const express = require('express');
const router = express.Router();

const authToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/dashboard', authToken, isAdmin, async (req, res) => {
    try {
        const db = req.app.locals.db;

        const users = await db.collection('users').find().toArray();
        const notes = await db.collection('notes').find().toArray();

        res.json({
            message: `Welcome, ${req.user.username} to the Admin Dashboard!`,
            users,
            notes,
        });
    } catch (err) {
        consolele.log(err);
        res.status(500).json({ error: 'Failed to load Admin Dashboard' });
    }
});

module.exports = router;