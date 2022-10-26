const express = require("express");
const mysql = require("mysql");
const dbconfig = require("./config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);
const app = express();
// const PORT = process.env.PORT || 4000;

app.set("port", process.env.PORT || 3001);

// app.get("/", (req, res) => {
//     res.send("Root");
// });

// app.get("/users", (req, res) => {
//     connection.query("select * from time", (err, rows) => {
//         if (err) throw err;
//         console.log(rows);
//         res.send(rows);
//     });
// });

app.listen(app.get("port"), () => {
    console.log(`Server run : http://localhost:${app.get("port")}/`);
});
