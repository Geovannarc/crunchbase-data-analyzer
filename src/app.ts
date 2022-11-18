import express = require("express");
import path = require("path");
import mysql = require('mysql');

const app = express();
const port = 3000;

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'r00t',
  database : 'pinter' 
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use("/public", express.static(path.join(__dirname, '../../public')));

app.get('/', async (req: express.Request, res: express.Response) => {
  connection.connect();
  try {
    var comp_pc = await connection.query("SELECT companies.country, count(companies.uuid) FROM companies GROUP BY companies.country",
    function(err, rows, fields) {
      var companies_per_country = {}
      if (err) throw err;
      let result = Object.values(JSON.parse(JSON.stringify(rows)));
      let total = 0;
      
      result.forEach(row => {
        total += row['count(companies.uuid)']
      });
      result.forEach(row => {
        if (row['country'] != null){
          companies_per_country[row['country']] = row['count(companies.uuid)']/total;
        }
      });
      connection.end();
      return companies_per_country
    })
    res.render('index.ejs', { mensagem: null, erro: null, comperc: JSON.stringify(comp_pc)})
  } catch (error) {
    console.log(error);
  }
});

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const err = new Error("Não encontrado");
	err["status"] = 404;
	next(err);
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500);
  if (err.status !== 500) {
    res.render("erro.ejs",{ mensagem: err.message, erro: err });
  } 
});

app.listen(port);