const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

router.post("/login", (req, res) => {
    const id = req.body.userId;
    const pwd = req.body.userPassword;
    const isAdmin = req.body.isAdmin;
    let queryString =
        "select * from student where student_id=? and password=?;";
    if (isAdmin) {
        queryString = "select * from staff where staff_id=? and password=?;";
    }

    connection.query(queryString, [id, pwd], (err, rows) => {
        if (err) throw err;
        console.log(rows);
        const userObj = {
            job: "none",
            id: "none",
            name: "none",
            sex: "none",
        };

        if (rows[0] !== undefined) {
            if (isAdmin) {
                if (rows[0].level === 0) {
                    userObj.job = "admin";
                } else {
                    userObj.job = "lecturer";
                }
                userObj.id = rows[0].staff_id;
            } else {
                userObj.job = "student";
                userObj.id = rows[0].student_id;
            }
            userObj.name = rows[0].name;
            userObj.sex = rows[0].sex;
        }
        res.send(userObj);
    });
});
module.exports = router;
