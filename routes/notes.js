const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const authToken = require('../middleware/auth');

router.get('/', authToken, async (req, res) => {
    try {
        const db = req.app.locals.db;

        let query = { userId: new ObjectId(req.user.userId) };

        const notes = await db.collection('notes').find(query).toArray();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

router.post('/', authToken, async (req, res) => {
    const { note } = req.body;
    const userId = req.user.userId;

    if (!note) {
        return res.status(400).json({ error: 'Note is required'});
    }

    if (userId && !ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId'})
    }
    
    
    try {
        const db = req.app.locals.db;

        const now = new Date();
        const pad = (num) => num.toString().padStart(2, '0');
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
    
        const currentTime = (`${hours}:${minutes}`);

        const result = await db.collection('notes').insertOne({
            note,
            created: currentTime,
            userId: new ObjectId(userId)
        });

        res.status(201).json({_id: result.insertedId, note, created: currentTime, userId: userId});
    } catch (err) {
        res.status(500).json({ error: 'Failed to post notes'})
    }
});

module.exports = router;