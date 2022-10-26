import express = require("express");
import path = require("path");
const app = express();
const port = 3000;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use("/public", express.static(path.join(__dirname, '../../public')));

app.get('/', (req: express.Request, res: express.Response) => {
  res.render('index.ejs', { mensagem: null, erro: null });
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