const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('./db.sqlite3', (err: { message: any; }) => {
    if (err) {
      console.error(err.message);
    }else{
        console.log('Connected to the crunchbase database.');
    }
});

export = db
