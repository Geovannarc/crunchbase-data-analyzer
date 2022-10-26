"use strict";
const { error } = require("console");
const express = require("express");
const app = express();
const port = 3000;
const db = require("../controllers/dbconnection");
class Company {
    static async listAll() {
        let lists = await db.serialize(() => {
            db.each(`SELECT name
                     FROM companies ORDER BY name`, (err, row) => {
                if (err) {
                    console.error(err.message);
                }
            });
        });
        return lists;
    }
}
module.exports = Company;
//# sourceMappingURL=company.js.map