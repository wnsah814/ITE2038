const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

router.post("/getClass", (req, res) => {
    const reqObj = {
        class_id: req.body.class_id,
        course_id: req.body.course_id,
        name: req.body.name,
        year: req.body.year,
    };
    let where = ` where opened=${reqObj.year}`;
    if (reqObj.class_id === "") {
        if (reqObj.course_id === "") {
            if (reqObj.name === "") {
                // 1
            } else {
                // 2
                where += ` and class_name like "%${reqObj.name}%"`;
            }
        } else {
            where += ` and course_id="${reqObj.course_id}"`;
            if (reqObj.name === "") {
                // 3
            } else {
                where += ` and class_name like "%${reqObj.name}%"`;
            }
        }
    } else {
        where += ` and class_id=${reqObj.class_id}`;
        if (reqObj.course_id === "") {
            if (reqObj.name === "") {
                // 7
            } else {
                //8
                where += ` and class_name like "%${reqObj.name}%"`;
            }
        } else {
            where += ` and course_id="${reqObj.course_id}"`;
            if (reqObj.name === "") {
                // 5
            } else {
                where += ` and class_name like "%${reqObj.name}%"`;
                //6
            }
        }
    }
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
    select * from total" +
        where +
        " order by class_name;";

    // console.log(`query: ${queryString}`);
    connection.query(queryString, (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

module.exports = router;
