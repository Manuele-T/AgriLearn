const Datastore = require('nedb');
const path = require('path');

// Initialize the crops database
const cropsDB = new Datastore({ filename: path.join(__dirname, '../database/Crops.db'), autoload: true });

// Export the database instance
module.exports = cropsDB;
