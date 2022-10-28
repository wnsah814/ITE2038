const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

router.get("/course", (req, res) => {
    connection.query("select * from course", (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});
module.exports = router;
