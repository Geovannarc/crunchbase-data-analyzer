"use strict";
const { error } = require("console");
const express = require("express");
const app = express();
const port = 3000;
const db = require("../controllers/dbconnection");
class Rank {
    static async listAll() {
        let list;
        let sql = `SELECT id, crunchbase_rank, date_req, company_id, company.name FROM rank
            inner join company on rank.company_id = company.id
           ORDER BY date_req`;
        list = await db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                list.push(row);
            });
            return (list || []);
        });
        return list;
    }
}
module.exports = Rank;
//# sourceMappingURL=rank.js.map