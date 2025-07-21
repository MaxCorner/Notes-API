require('dotenv').config();

const express = require('express');
const { connectToDB, getDB } = require('./data/db');
const app = express();
const PORT = 1234;
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

connectToDB().then(() => {
    app.locals.db = getDB();

    app.get('/', (req, res) => {
        res.send('Welcome to the Scheduler API!')
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err)
});