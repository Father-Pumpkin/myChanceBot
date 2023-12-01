const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    currentPoints: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = User;