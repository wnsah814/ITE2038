const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

router.post("/getOLAP", (req, res) => {
    const queryString =
        "with \
    take_with_name as ( \
        select * \
        from takes \
        natural join course \
    ), \
    std_avg(student_id, avg_credit) as ( \
        select student_id, sum(grade * credit) / sum(credit) \
        from take_with_name where grade != 0.5 and year=2022 group by student_id \
    ) \
    select T.course_id, C.name as course_name , count(*) as count, avg(avg_credit - grade) as diff \
    from takes as T \
    join std_avg AS SA \
    on T.student_id=SA.student_id \
    join course as C \
    on T.course_id= C.course_id \
    where year=2022 \
    group by course_id \
    order by diff desc \
    limit 10;";
    connection.query(queryString, (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});
module.exports = router;
