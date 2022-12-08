"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const app = express();
const port = 3000;
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use("/public", express.static(path.join(__dirname, '../../public')));
app.get('/home', function (req, res) {
    res.render("home.ejs", { res: res });
});
app.get('/', async (req, res) => {
    var conn = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'r00t',
        database: 'pinter'
    });
    try {
        var comp_cat_2 = {};
        let companies = await conn.execute(`SELECT name, year_founded, short_description, num_employees,
     last_funding_type, last_funding_at, funding_stage, continent,country, region, city FROM companies`);
        companies = JSON.parse(JSON.stringify(companies[0]));
        companies.forEach(row => {
            var name = row["name"];
            delete row["name"];
            comp_cat_2[name] = row;
        });
        let companies_categories = await conn.execute(`SELECT companies.name as comp_name, categories.name as cat_name
     from company_category JOIN companies on company_category.company_uuid = companies.uuid
      JOIN categories on company_category.category_id = categories.id`);
        var comp_cat = JSON.parse(JSON.stringify(companies_categories[0]));
        comp_cat.forEach(row => {
            var name = row["comp_name"];
            var categ = row["cat_name"];
            if (comp_cat_2[name]["categories"]) {
                comp_cat_2[name]["categories"].push(categ);
            }
            else {
                comp_cat_2[name]["categories"] = [categ];
                comp_cat_2[name]["comp_name"] = name;
            }
        });
        var meses = {
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        };
        var top_10_month = {};
        for (let mes = 8; mes < 13; mes++) {
            let rank_month = await conn.execute(`
      SELECT companies.name as comp_name, MIN(crunchbase_rank) as cbr from ranks JOIN companies on ranks.company_id = companies.uuid
		    WHERE MONTH(date_req) = ?
		    GROUP BY companies.name
        ORDER BY MIN(crunchbase_rank)`, [mes]);
            rank_month = JSON.parse(JSON.stringify(rank_month[0]));
            rank_month.forEach(row => {
                if (!top_10_month[meses[mes]]) {
                    top_10_month[meses[mes]] = [[row["comp_name"], row["cbr"]]];
                }
                else {
                    if (top_10_month[meses[mes]].length < 10)
                        top_10_month[meses[mes]].push([row["comp_name"], row["cbr"]]);
                }
            });
        }
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
        let sims = await conn.execute(`select c1.name as c1_name, c2.name as c2_name, score from similars
    join companies as c1 on c1.uuid = similars.company_1_uuid
    join companies as c2 on c2.uuid = similars.company_2_uuid;`);
        sims = JSON.parse(JSON.stringify(sims[0]));
        sims.forEach(sim => {
            let nome_1 = sim["c1_name"];
            let nome_2 = sim["c2_name"];
            let score = sim["score"].toFixed(3);
            if (comp_cat_2[nome_1] != null) {
                if (comp_cat_2[nome_1]["similarities"] == null) {
                    comp_cat_2[nome_1]["similarities"] = [[nome_2, score]];
                }
                else {
                    comp_cat_2[nome_1]["similarities"].push([nome_2, score]);
                }
            }
        });
        var years = {};
        for (const [key, value] of Object.entries(comp_cat_2)) {
            let year = comp_cat_2[key]["year_founded"];
            if (year != null) {
                if (years[year] == null) {
                    years[year] = 1;
                }
                else {
                    years[year] += 1;
                }
            }
        }
        res.render('index.ejs', { mensagem: null, erro: null,
            comperc: JSON.stringify(companies_per_country), comp_cat: comp_cat_2,
            top: top_10_month, years: JSON.stringify(years) });
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