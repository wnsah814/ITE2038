const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

// 재수강 가능 여부
router.post("/appC1", (req, res) => {
    const queryString =
        "select count(*) cnt from takes where student_id=? and grade >= 3.0 and course_id=?";
    connection.query(
        queryString,
        [req.body.studentId, req.body.courseId],
        (err, rows) => {
            // console.log(rows[0].cnt);
            if (rows[0].cnt !== 0) {
                res.send({ status: "no" }); // 해당 과목의 성적을 B0이상 받은 적이 있다면
            } else {
                res.send({ status: "ok" });
            }
        }
    );
});

// 정원 다 찼는지 확인
router.post("/appC2", (req, res) => {
    const queryString =
        "select person_max, (select count(*) from applied where class_id=?) as cnt \
        from class \
        where class_id=?;";
    connection.query(
        queryString,
        [req.body.classId, req.body.classId],
        (err, rows) => {
            if (rows[0].person_max > rows[0].cnt) {
                res.send({ status: "ok" });
            } else {
                res.send({ status: "no" });
            }
        }
    );
});

// 18학점 이상 신청중인지
router.post("/appC3", (req, res) => {
    const queryString =
        "select sum(credit) as sum from applied natural join class natural join course where student_id=?;";
    connection.query(queryString, [req.body.studentId], (err, rows) => {
        console.log(rows);
        console.log(req.body.credit * 1);
        if (rows[0].sum === null || rows[0].sum + req.body.credit * 1 <= 18) {
            res.send({ status: "ok" });
        } else {
            res.send({
                status: "no",
                result: rows[0].sum + req.body.credit * 1,
            });
        }
    });
});

/* 시간 만드는 함수 */
const setOneDay = (timeArr, startDate, endDate) => {
    let start = getIndex(startDate);
    let end = getIndex(endDate);
    if (start[0] === 6 || start[0] >= 21) {
        return; // 토요일, 평일 18시 이후 => E-러닝 스킵
    }
    for (let i = start[1]; i < end[1]; ++i) {
        timeArr[start[0]][i] = 1;
    }
};

const getIndex = (time) => {
    if (time === "NO") {
        // 미지정
        return [6, 0]; // 토요일(E러닝) 취급 //
    }
    const date = new Date(time);
    date.setTime(date.getTime() + 9 * 60 * 60 * 1000);
    const day = date.getUTCDay();
    let index = (date.getUTCHours() - 8) * 2;
    if (date.getUTCMinutes() === 30) {
        index++;
    }
    return [day, index];
};

// 시간 겹치는 지 확인
// 부분함수-겹치는 지 확인해준다
const checkDate = (timeArr, beginDate, endDate) => {
    let begin = getIndex(beginDate);
    let end = getIndex(endDate);
    let flag = true;
    for (let i = begin[1]; i < end[1]; ++i) {
        if (timeArr[begin[0]][i] === 1) {
            flag = false;
        }
    }
    return flag;
};
router.post("/appC4", (req, res) => {
    console.log(req.body.begin1);
    const queryString =
        "select * from applied natural join time where student_id=?;";
    connection.query(queryString, [req.body.studentId], (err, rows) => {
        let timeArr = new Array(7).fill(0).map((v) => new Array(24).fill(0));
        console.log(rows);
        for (let i = 0; i < rows.length; ++i) {
            setOneDay(timeArr, rows[i].begin, rows[i].end);
        }
        let result =
            checkDate(timeArr, req.body.begin1, req.body.end1) &&
            checkDate(timeArr, req.body.begin2, req.body.end2);
        if (result) {
            res.send({ status: "ok" });
        } else {
            res.send({ status: "no" });
        }
    });
});

// 이미 신청했는지
router.post("/getDidApplied", (req, res) => {
    const queryString =
        "select count(*) as applied from applied where (student_id, class_id) = (?, ?);";
    connection.query(
        queryString,
        [req.body.studentId, req.body.classId],
        (err, rows) => {
            res.send(rows);
        }
    );
});

// 신청한 정보
router.post("/getApplied", (req, res) => {
    const student_id = req.body.student_id;

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
    select *, (select count(*) from takes T where T.course_id=total.course_id and T.student_id=2021092379) as taken from total where class_id in (select class_id from applied where student_id=?) order by class_name;";
    connection.query(queryString, [student_id], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

// 수강신청
router.post("/apply", (req, res) => {
    const student_id = req.body.student_id;
    const class_id = req.body.class_id;

    console.log(">>>", student_id, class_id);

    const queryString =
        "insert into applied(student_id,class_id) values(?, ?);";

    connection.query(queryString, [student_id, class_id], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

// 수강취소
router.post("/cancelApply", (req, res) => {
    const student_id = req.body.student_id;
    const class_id = req.body.class_id;

    const queryString =
        "delete from applied where (student_id,class_id) = (?, ?);";

    connection.query(queryString, [student_id, class_id], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

module.exports = router;
