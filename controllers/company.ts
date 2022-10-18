import Company = require("../models/company");


async function listAll():Promise<string[]> {
    return await Company.listAll()
}

listAll().then(res => {
    console.log(res)
}).catch( e => {
    throw e.message
})

