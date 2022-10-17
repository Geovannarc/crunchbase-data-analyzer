const { error } = require("console");
const express = require("express")
const app = express();
const port = 3000;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.ejs', { mensagem: (error.status === 404 ? null : (error.message || "Ocorreu um erro desconhecido")), erro: error });
});

app.listen(port);