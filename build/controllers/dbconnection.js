"use strict";
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log('Connected to the crunchbase database.');
    }
});
module.exports = db;
//# sourceMappingURL=dbconnection.js.map