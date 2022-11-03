const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.js");
const connection = mysql.createConnection(dbconfig);

router.post("/getTakeData", async (req, res) => {
    let student_ids = new Array();
    const stuArr = [];
    const result = connection.query(
        "select distinct student_id from takes where year=2022",
        (err, result) => {
            if (err) throw err;
            console.log(result.length);
            for (let i = 0; i < result.length; ++i) {
                student_ids.push(result[i].student_id);
            }

            student_ids.forEach((stu_id) => {
                const studentObj = {
                    stu_id,
                    classes: [],
                };
                connection.query(
                    "select * from takes natural join course where year=2022 and student_id=?",
                    [stu_id],
                    (error, rows) => {
                        console.log(stu_id, "정보");
                        let totalCredit = 0;
                        let totalGrade = 0;
                        for (let j = 0; j < rows.length; ++j) {
                            let credit = rows[j].credit;
                            let grade = rows[j].grade;
                            totalCredit += credit;
                            totalGrade += credit * grade;
                            studentObj.classes.push([
                                rows.class_id,
                                credit,
                                grade,
                            ]);
                        }
                        studentObj.averageGrade = totalGrade / totalCredit;
                        stuArr.push(studentObj);
                    }
                );
            });
        }
    );
    res.send(stuArr);
});

router.post("/getClassData", (req, res) => {
    const queryString = "select * from class";

    connection.query(queryString, (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

module.exports = router;
