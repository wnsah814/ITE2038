const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

router.post("/insertClass", (req, res) => {
    const queryString = "delete from wanted where wanted_id >= 0;";

    connection.query(queryString, (err, rows) => {
        if (err) throw err;
        console.log("deleted all wanted");
        res.send(rows);
    });
});

router.post("/updateClass", (req, res) => {
    const queryString = "delete from wanted where wanted_id >= 0;";

    connection.query(queryString, (err, rows) => {
        if (err) throw err;
        console.log("deleted all wanted");
        res.send(rows);
    });
});

router.post("/deleteClass", (req, res) => {
    const queryString = "delete from applied where applied_id >= 0;";

    connection.query(queryString, (err, rows) => {
        if (err) throw err;
        console.log("deleted all applied");
        res.send(rows);
    });
});

module.exports = router;
