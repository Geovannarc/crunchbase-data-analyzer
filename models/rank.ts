const { error } = require("console");
const express = require("express")
const app = express();
const port = 3000;
import db = require("../controllers/dbconnection");

interface Rank{
    id : String;
    crunchbase_rank : Number;
    date_req : Date;
    company_id : String
}

class Rank{
    public static async listAll(): Promise<Rank[] | null> {
		let list: Rank[];

        let sql = `SELECT id, crunchbase_rank, date_req, company_id, company.name FROM rank
            inner join company on rank.company_id = company.id
           ORDER BY date_req`;

        list = await db.all(sql, [], (err: any, rows: any[]) => {
            if (err) {
                throw err;
            }
            rows.forEach((row: Rank) => {
                list.push(row)
            });
            return (list || []);
        });

        return list;
    }
}

export = Rank;