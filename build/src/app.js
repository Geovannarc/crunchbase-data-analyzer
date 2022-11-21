"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const app = express();
const port = 3000;
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use("/public", express.static(path.join(__dirname, '../../public')));
app.get('/', async (req, res) => {
    var conn = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'r00t',
        database: 'pinter'
    });
    try {
        let companies_categories = await conn.execute("SELECT companies.name as comp_name, categories.name as cat_name, year_founded, short_description, num_employees, last_funding_type, last_funding_at, funding_stage, continent, country, region, city from company_category JOIN companies on company_category.company_uuid = companies.uuid JOIN categories on company_category.category_id = categories.id");
        var comp_cat = JSON.parse(JSON.stringify(companies_categories[0]));
        var comp_cat_2 = {};
        comp_cat.forEach(row => {
            var name = row["comp_name"];
            var categ = row["cat_name"];
            if (comp_cat_2[name]) {
                comp_cat_2[name]["categories"].push(categ);
            }
            else {
                delete row["cat_name"];
                row["categories"] = [categ];
                comp_cat_2[name] = row;
            }
        });
        var values = Object.keys(comp_cat_2).map(function (key) {
            return comp_cat_2[key];
        });
        // let ranks = await conn.execute("SELECT companies.name as comp_name, crunchbase_rank, date_req from ranks JOIN companies on ranks.company_id = companies.uuid")
        // var rank_comp = JSON.parse(JSON.stringify(ranks[0]))
        // rank_comp.forEach(row => {
        //   var name = row["comp_name"];
        //   if (!comp_cat_2[name]["ranks"]){
        //     delete row["comp_name"]
        //     comp_cat_2[name]["ranks"] = [row]
        //   }
        //   else{
        //     delete row["comp_name"]
        //     comp_cat_2[name]["ranks"].push(row)
        //   }
        // });
        let result = await conn.execute("SELECT companies.country, count(companies.uuid) FROM companies GROUP BY companies.country");
        var companies_per_country = {};
        result = JSON.parse(JSON.stringify(result[0]));
        let total = 0;
        result.forEach(row => {
            total += row['count(companies.uuid)'];
        });
        result.forEach(row => {
            if (row['country'] != null) {
                companies_per_country[row['country'].replace(/ /g, '').toLowerCase().slice(0, 10)] = row['count(companies.uuid)'];
            }
        });
        console.log(companies_per_country);
        res.render('index.ejs', { mensagem: null, erro: null, comperc: JSON.stringify(companies_per_country), comp_cat: values });
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