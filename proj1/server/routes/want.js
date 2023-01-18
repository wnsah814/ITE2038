const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

// 이미 희망과목에 담았는 지 확인
router.post("/getDidWanted", (req, res) => {
    const queryString =
        "select count(*) as wanted from wanted where (student_id, class_id) = (?, ?);";
    connection.query(
        queryString,
        [req.body.studentId, req.body.classId],
        (err, rows) => {
            if (err) throw err;
            res.send(rows);
        }
    );
});

// 희망과목에 추가
router.post("/addWant", (req, res) => {
    const student_id = req.body.student_id;
    const class_id = req.body.class_id;

    // console.log(">>>", student_id, class_id);

    const queryString = "insert into wanted(student_id,class_id) values(?, ?);";

    connection.query(queryString, [student_id, class_id], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

//희망 취소
router.post("/cancelWant", (req, res) => {
    const student_id = req.body.student_id;
    const class_id = req.body.class_id;

    const queryString =
        "delete from wanted where (student_id,class_id) = (?, ?);";

    connection.query(queryString, [student_id, class_id], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

// 희망과목 목록 가져오기
router.post("/getwant", (req, res) => {
    const student_id = req.body.student_id;

    console.log(">>>", student_id);

    const queryString =
        "with \
    cls_crs(class_id, class_no, course_id, major_id, year, lecturer_id, person_max, opened, room_id, class_name, credit) as ( \
        select class_id, class_no, course_id, major_id, year, lecturer_id, person_max, opened, room_id, name, credit \
        from class \
        natural join course \
    ), \
    class_lec(class_id, class_no, course_id, major_id, year, person_max, opened, room_id, class_name, credit, lecturer_name) as ( \
        select class_id, class_no, course_id, C.major_id, year, person_max, opened, room_id, class_name, credit, name \
        from cls_crs as C  \
        join lecturer as L \
        on C.lecturer_id = L.lecturer_id \
    ), \
    room_building(building_id, room_id, room_no, building_name) as ( \
        select building_id, room_id, room_no, name \
        from room \
        natural join building \
    ), \
    CLRB(class_id, class_no, course_id, major_id, year, person_max, opened, room_no, class_name, credit, lecturer_name, building_name) as ( \
        select class_id, class_no, course_id, major_id, year, person_max, opened, room_no, class_name, credit, lecturer_name, building_name \
        from class_lec \
        natural join room_building \
    ), \
    totTime(class_id, begin1, end1, begin2, end2) as ( \
        select t1.class_id, t1.begin, t1.end, t2.begin, t2.end \
        from time as t1 \
        left join time as t2 \
        on t1.period < t2.period and t1.class_id=t2.class_id \
        where t1.period=1 \
    ), \
    total(class_id, class_no, course_id, major_id, year, taking, person_max, opened, class_name, credit, lecturer_name, room_no, building_name, begin1, end1, begin2, end2) as ( \
        select CLRB.class_id, class_no, course_id, major_id, year, (select count(*) from applied as A where A.class_id=totTime.class_id), person_max, opened, class_name, credit, lecturer_name, room_no, building_name, begin1, end1, begin2, end2 \
        from CLRB \
        natural left join totTime \
    ) \
    select * from total where class_id in (select class_id from wanted where student_id=?) order by class_name;";
    connection.query(queryString, [student_id], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

module.exports = router;
