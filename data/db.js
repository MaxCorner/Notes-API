require('dotenv').config();

const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URL)

let db;

async function connectToDB() {
    await client.connect();
    db = client.db();
}

function getDB() {
    if (!db) throw new Error('Data Base not connected!');
    return db;
}

module.exports = { connectToDB, getDB }