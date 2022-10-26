const { error } = require("console");
const express = require("express")
const app = express();
const port = 3000;
import db = require("../controllers/dbconnection");

interface Company {
    uuid : String;
    name : String;
    year_founded : String;
    short_description : String;
    num_employees : number;
    last_funding_type : String;
    last_funding_at : String;
    acquirer : String;
    announce_date : String;
    funding_stage : String;
    continent : String;
    country : String;
    region : String;
    city : String;
}

class Company{

    public static async listAll(): Promise<string[]> {
        let lists = await db.serialize(() => {
            db.each(`SELECT name
                     FROM companies ORDER BY name`, (err: { message: any; }, row: { name: string; }) => {
              if (err) {
                console.error(err.message);
              }
            });
        });
        return lists
    }
}

export = Company