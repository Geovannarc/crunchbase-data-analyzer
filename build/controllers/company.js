"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Company = require("../models/company");
async function listAll() {
    return await Company.listAll();
}
listAll().then(res => {
    console.log(res);
}).catch(e => {
    throw e.message;
});
//# sourceMappingURL=company.js.map