const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

router.get("/student", (req, res) => {
    connection.query("select * from student", (err, rows) => {
        if (err) throw err;
        res.send(rows);
        // console.log(rows);
    });
});
module.exports = router;
