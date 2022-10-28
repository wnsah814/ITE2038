const mysql = require("mysql");
const dbconfig = require("./config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);
connection.connect();

connection.query("select * from time", (err, rows, fields) => {
    if (err) throw err;
    console.log(rows);
});

connection.end();
