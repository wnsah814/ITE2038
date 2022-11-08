const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

// 학생 데이터 가져오기
router.post("/getStudentData", (req, res) => {
    const id = req.body.studentId;
    let queryString =
        "select S.password, student_id, S.name as student_name, S.sex, M.name as major_name, S.lecturer_id, L.name as lecturer_name, status, year from student S join major M on S.major_id=M.major_id join lecturer L on S.lecturer_id=L.lecturer_id where student_id=?;";

    connection.query(queryString, [id], (err, rows) => {
        res.send(rows[0]);
    });
});

// 학생 비밀번호 변경
router.post("/changeStudentPassword", (req, res) => {
    const id = req.body.studentId;
    const pw = req.body.password;
    let queryString = "update student set password=? where student_id=?;";

    connection.query(queryString, [pw, id], (err, rows) => {
        res.send(rows);
    });
});

// 관리자 데이터 가져오기
router.post("/getStaffData", (req, res) => {
    const id = req.body.staffId;
    let queryString =
        "select S.staff_id, password, S.name as staff_name, S.sex, level, L.lecturer_id, M.name as major_name from staff S left join lecturer L on S.staff_id=L.lecturer_id left join major M on L.major_id=M.major_id where staff_id=?;";

    connection.query(queryString, [id], (err, rows) => {
        res.send(rows[0]);
    });
});

// 관리자 비밀번호 변경
router.post("/changeStaffPassword", (req, res) => {
    const id = req.body.staffId;
    const pw = req.body.password;
    let queryString = "update staff set password=? where staff_id=?;";

    connection.query(queryString, [pw, id], (err, rows) => {
        res.send(rows);
    });
});

module.exports = router;
