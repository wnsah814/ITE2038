const express = require("express");
const mysql = require("mysql");
const dbconfig = require("./config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

const path = require("path");
const exp = require("constants");

const app = express();

const dir_base = "../build";
const dir_url = dir_base + "/index.html";

app.set("port", process.env.PORT || 4000);

app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use(express.static(path.join(__dirname, dir_base)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, dir_url));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, dir_url));
});
// app.get("/", (req, res) => {
//     res.send("Root");
// });

app.get("/test", (req, res) => {
    res.json({ name: "junmo" });
});

app.get("/time", (req, res) => {
    connection.query("select * from time", (err, rows) => {
        if (err) throw err;
        console.log(rows);
        res.send(rows);
    });
});

app.listen(app.get("port"), () => {
    console.log(`Server run : http://localhost:${app.get("port")}/`);
});
