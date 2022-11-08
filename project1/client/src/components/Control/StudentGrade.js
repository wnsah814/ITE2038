import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./StudentGrade.module.css";
// 2018003125
const StudentGrade = ({ studentId }) => {
    const [stuGrade, setStuGrade] = useState([]);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        const getGrade = async () => {
            const res = await axios.post("http://localhost:4000/api/getGrade", {
                studentID: studentId,
            });
            const data = res.data;
            if (data[0] === undefined) {
                setFlag(false);
            } else {
                console.log(studentId, "의 grade", data);
                setFlag(true);
                setStuGrade(data);
            }
        };
        getGrade();
    }, [studentId]);
    return (
        <div>
            {flag ? (
                <div className={styles.table}>
                    <div className={styles.thead}>
                        <div className={styles.tr}>
                            <div className={styles.th}>학수번호</div>
                            <div className={styles.th}>교과목명</div>
                            <div className={styles.th}>학점</div>
                            <div className={styles.th}>등급</div>
                            <div className={styles.th}>년도</div>
                        </div>
                    </div>
                    <div className={styles.tbody}>
                        {stuGrade?.map((v) => (
                            <div className={styles.tr}>
                                <div className={styles.td}>{v?.course_id}</div>
                                <div className={styles.td}>
                                    {v?.course_name}
                                </div>
                                <div className={styles.td}>{v?.credit}</div>
                                <div className={styles.td}>{v?.grade}</div>
                                <div className={styles.td}>{v?.year}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                "해당 학번의 성적이 존재하지 않습니다"
            )}
        </div>
    );
};
export default StudentGrade;
