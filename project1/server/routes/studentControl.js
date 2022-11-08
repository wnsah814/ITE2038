const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

router.post("/getStudent", (req, res) => {
    const queryString =
        "select student_id, password, S.name as student_name, S.major_id, L.lecturer_id, L.name as lecturer_name, S.year, S.status from student S join lecturer L on S.lecturer_id=L.lecturer_id where student_id=?;";

    connection.query(queryString, [req.body.studentID], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

router.post("/updateStudent", (req, res) => {
    const queryString = "update student set status=? where student_id=?;";

    connection.query(
        queryString,
        [req.body.status, req.body.studentID],
        (err, rows) => {
            if (err) throw err;
            res.send(rows);
        }
    );
});

router.post("/getGrade", (req, res) => {
    const queryString =
        "select C.course_id, C.name as course_name, C.credit, T.grade, T.year from takes T natural join course C where student_id=? order by year;";

    connection.query(queryString, [req.body.studentID], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

module.exports = router;
