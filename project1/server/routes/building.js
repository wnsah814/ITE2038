const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

router.post("/building", (req, res) => {
    const id = req.body.userId;
    const pwd = req.body.userPassword;
    const queryString =
        "select * from student where student_id=? and password=?;";
    connection.query(queryString, [id, pwd], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});
module.exports = router;
