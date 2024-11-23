const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
console.log('Database path:', dbPath);

try {
    fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
    console.log('Database file is accessible.');
} catch (error) {
    console.error('Database file is not accessible:', error.message);
}

// Initialize SQLite with Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, 'database.sqlite'), // Absolute path to the database file
    logging: console.log, // Optional: Log SQL queries for debugging
});

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
