const { Sequelize } = require('sequelize');

// Initialize SQLite with Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Path to SQLite file
});

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
