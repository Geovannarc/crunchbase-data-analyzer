"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const app = express();
const port = 3000;
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'r00t',
    database: 'pinter'
});
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use("/public", express.static(path.join(__dirname, '../../public')));
app.get('/', async (req, res) => {
    connection.connect();
    try {
        var comp_pc = await connection.query("SELECT companies.country, count(companies.uuid) FROM companies GROUP BY companies.country", function (err, rows, fields) {
            var companies_per_country = {};
            if (err)
                throw err;
            let result = Object.values(JSON.parse(JSON.stringify(rows)));
            let total = 0;
            result.forEach(row => {
                total += row['count(companies.uuid)'];
            });
            result.forEach(row => {
                if (row['country'] != null) {
                    companies_per_country[row['country']] = row['count(companies.uuid)'] / total;
                }
            });
            connection.end();
            return companies_per_country;
        }).then((c) => {
            res.render('index.ejs', { mensagem: null, erro: null, comperc: JSON.stringify(c) });
        });
    }
    catch (error) {
        console.log(error);
    }
});
app.use((req, res, next) => {
    const err = new Error("Não encontrado");
    err["status"] = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if (err.status !== 500) {
        res.render("erro.ejs", { mensagem: err.message, erro: err });
    }
});
app.listen(port);
//# sourceMappingURL=app.js.map