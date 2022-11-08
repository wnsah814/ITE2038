const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

router.post("/getMyClasses", (req, res) => {
    const queryString =
        "select * from class where lecturer_id=? and opened=2022";
    console.log(req.body.lecturerId);
    connection.query(queryString, [req.body.lecturerId], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

router.post("/getClassData", (req, res) => {
    const queryString =
        "select * from class natural join course where class_id=?;";

    connection.query(queryString, [req.body.classId], (err, rows) => {
        if (err) throw err;
        res.send(rows[0]);
    });
});

router.post("/getClassSize", (req, res) => {
    const queryString =
        "select (select count(*) from applied where class_id=?) as appliedAmount, (select person_max from class where class_id=?) as max_person, (select occupancy from room where room_id=(select room_id from class where class_id=?)) as occupancy;";

    connection.query(
        queryString,
        [req.body.classId, req.body.classId, req.body.classId],
        (err, rows) => {
            if (rows[0].appliedAmount < rows[0].max_person) {
                res.send({ status: "ok" });
            } else if (rows[0].max_person + 1 < rows[0].occupancy) {
                res.send({ status: "ok" });
            } else {
                res.send({ status: "no" });
            }
        }
    );
});

router.post("/increaseOccupancy", (req, res) => {
    const queryString =
        "select (select count(*) from applied where class_id=?) as appliedAmount, (select person_max from class where class_id=?) as max_person, (select occupancy from room where room_id=(select room_id from class where class_id=?)) as occupancy;";
    const newSize = req.body.newMax;
    connection.query(
        queryString,
        [req.body.classId, req.body.classId, req.body.classId],
        (err, rows) => {
            if (rows[0].appliedAmount > newSize) {
                res.send({
                    status: "no",
                    msg: "현재 수강중인 학생 수 보다 낮은 수를 입력하셨습니다.",
                });
            } else if (newSize > rows[0].occupancy) {
                res.send({
                    status: "no",
                    msg: `강의실 수용 가능 인원 수 ${rows[0].occupancy}보다 큰 수를 입력하셨습니다.`,
                });
            } else {
                connection.query(
                    "update class set person_max=? where class_id=?;",
                    [newSize, req.body.classId],
                    (error, result) => {
                        res.send(result);
                    }
                );
                // res.send({
                //     status: "ok",
                //     msg: "수강 가능 인원 수를 조정하였습니다.",
                // });
            }
        }
    );
});

module.exports = router;
