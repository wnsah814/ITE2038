const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

/* 과목 (Course) 관리 */
router.post("/insertCourse", (req, res) => {
    const queryString =
        "insert into course (course_id, name, credit) values(?, ?, ?);";

    connection.query(
        queryString,
        [req.body.courseId, req.body.name, req.body.credit],
        (err, rows) => {
            res.send(rows);
        }
    );
});

router.post("/deleteCourse", (req, res) => {
    const queryString = "delete from course where course_id=?;";

    connection.query(queryString, [req.body.courseId], (err, rows) => {
        res.send(rows);
    });
});

/* 수업 (Class) 관리 */
/* 조건 */
router.post("/getMajors", (req, res) => {
    const queryString = "select * from major order by name";
    connection.query(queryString, (err, rows) => {
        res.send(rows);
    });
});

router.post("/getCourses", (req, res) => {
    const queryString = "select * from course";
    connection.query(queryString, (err, rows) => {
        res.send(rows);
    });
});

router.post("/getRooms", (req, res) => {
    const queryString = "select * from room natural join building;";
    connection.query(queryString, (err, rows) => {
        res.send(rows);
    });
});

router.post("/getClasses", (req, res) => {
    const queryString = "select * from class natural join course;";
    connection.query(queryString, (err, rows) => {
        res.send(rows);
    });
});

router.post("/getLecturers", (req, res) => {
    const queryString = "select * from lecturer;";
    connection.query(queryString, (err, rows) => {
        res.send(rows);
    });
});

router.post("/getRoomSize", (req, res) => {
    const queryString = "select occupancy from room where room_id=?;";
    connection.query(queryString, [req.body.roomId], (err, rows) => {
        if (rows[0].occupancy >= req.body.maxPerson) {
            res.send({ status: "ok" });
        } else {
            res.send({ status: "no" });
        }
    });
});

router.post("/insertClass", (req, res) => {
    const queryString =
        "insert into class (class_no, course_id, major_id, year, lecturer_id, person_max, opened, room_id) values(?, ?, ?, ?, ?, ?, ?, ?);";

    connection.query(
        queryString,
        [
            req.body.classNo,
            req.body.courseId,
            req.body.majorId,
            req.body.year,
            req.body.lecturerId,
            req.body.personMax,
            req.body.opened,
            req.body.roomId,
        ],
        (err, rows) => {
            if (err) throw err;
            console.log(rows);
            res.send(rows);
        }
    );
});
router.post("/insertTime", (req, res) => {
    const firstDay = req.body.firstDay;
    const firstStart = req.body.firstStart;
    const firstEnd = req.body.firstEnd;
    const secondDay = req.body.secondDay;
    const secondStart = req.body.secondStart;
    const secondEnd = req.body.secondEnd;

    let secondSkip = false;
    console.log(
        firstDay,
        firstStart,
        firstEnd,
        secondDay,
        secondStart,
        secondEnd
    );
    let firstB, firstE, secondB, secondE;
    if (firstDay === "6") {
        firstB = new Date("1900-01-06T05:30:00.000Z");
        firstE = new Date("1900-01-06T06:30:00.000Z");
        console.log("원격");
    } else {
        firstB = new Date("1900-01-01T05:30:00.000Z");
        firstB.setUTCDate(firstB.getUTCDate() + firstDay * 1);
        firstB.setUTCHours(firstStart / 2);
        if (firstStart % 2 === 0) {
            firstB.setUTCMinutes(0);
        } else {
            firstB.setUTCMinutes(30);
        }
        firstE = new Date("1900-01-01T05:30:00.000Z");
        firstE.setUTCDate(firstE.getUTCDate() + firstDay * 1);
        firstE.setUTCHours(firstEnd / 2);
        if (firstEnd % 2 === 0) {
            firstE.setUTCMinutes(0);
        } else {
            firstE.setUTCMinutes(30);
        }
        console.log(firstB, firstE);
    }
    if (secondDay === "7") {
        secondSkip = true;
    } else if (secondDay === "6") {
        secondB = new Date("1900-01-06T05:30:00.000Z");
        secondE = new Date("1900-01-06T06:30:00.000Z");
        console.log("원격");
    } else {
        secondB = new Date("1900-01-01T05:30:00.000Z");
        secondB.setUTCDate(secondB.getUTCDate() + secondDay * 1);
        secondB.setUTCHours(secondStart / 2);
        if (secondStart % 2 === 0) {
            secondB.setUTCMinutes(0);
        } else {
            secondB.setUTCMinutes(30);
        }
        secondE = new Date("1900-01-01T05:30:00.000Z");
        secondE.setUTCDate(secondE.getUTCDate() + secondDay * 1);
        secondE.setUTCHours(secondEnd / 2);
        if (secondEnd % 2 === 0) {
            secondE.setUTCMinutes(0);
        } else {
            secondE.setUTCMinutes(30);
        }
        console.log(secondB, secondE);
    }

    let queryString = "";
    if (secondSkip) {
        queryString =
            "insert into time(class_id, period, begin, end) values(?,1,?,?)";
        connection.query(
            queryString,
            [req.body.classId, firstB, firstE],
            (err, rows) => {
                if (err) throw err;
                console.log(rows);
                res.send(rows);
            }
        );
    } else {
        queryString =
            "insert into time(class_id, period, begin, end) values(?,1,?,?), (?,2,?,?)";
        connection.query(
            queryString,
            [
                req.body.classId,
                firstB,
                firstE,
                req.body.classId,
                secondB,
                secondE,
            ],
            (err, rows) => {
                if (err) throw err;
                console.log(rows);
                res.send(rows);
            }
        );
    }
});

// 과목 수정

router.post("/updateClass", (req, res) => {
    const queryString = "select * from class;";

    connection.query(queryString, (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

// router.post("/deleteTime", (req, res) => {
//     const queryString = "delete from time where class_id=?;";

//     connection.query(queryString, [req.body.classId * 1], (err, rows) => {
//         if (err) throw err;
//         res.send(rows);
//     });
// });

router.post("/deleteClass", (req, res) => {
    const queryString = "delete from class where class_id=?;";

    connection.query(queryString, [req.body.classId * 1], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

module.exports = router;
