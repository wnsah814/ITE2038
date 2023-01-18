import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "./StudentStatus.module.css";

const StudentStatus = ({ studentId }) => {
    const [stuObj, setStuObj] = useState({});
    const [flag, setFlag] = useState(false);
    useEffect(() => {
        const getStudentStat = async () => {
            const res = await axios.post(
                "http://localhost:4000/api/getStudentData",
                {
                    studentId: studentId,
                }
            );
            const data = res.data;
            if (data === undefined || data === null) {
                console.log("불러온 데이터가 없습니다");
                setFlag(false);
            } else {
                setFlag(true);
                setStuObj(data);
            }
        };
        getStudentStat();
    }, [studentId]);

    const statusRef = useRef();
    const onStatusChange = () => {
        setStuObj((prev) => {
            let newObj = { ...stuObj };
            newObj.status = statusRef.current.value;
            return newObj;
        });
    };
    const changeStudentData = async () => {
        const res = await axios.post(
            "http://localhost:4000/api/updateStudent",
            {
                studentID: stuObj.student_id,
                status: stuObj.status,
            }
        );
        const data = res.data[0];
        console.log(data);
    };
    return (
        <div className={styles.container}>
            {flag ? (
                <>
                    <p>
                        <b> 이 름 </b> {stuObj?.student_name}(
                        {stuObj?.student_id})
                    </p>
                    <p>
                        <b>지도교수</b> {stuObj?.lecturer_name}(
                        {stuObj?.lecturer_id})
                    </p>
                    <p>
                        <b>성별</b> {stuObj.sex}
                    </p>
                    <p>
                        <b>전공</b> {stuObj.major_name}
                    </p>
                    <p>
                        <b>학년</b> {stuObj.year}
                    </p>
                    <select
                        className={styles.input}
                        ref={statusRef}
                        value={stuObj?.status}
                        onChange={onStatusChange}
                    >
                        <option value="0">재학</option>
                        <option value="1">휴학</option>
                        <option value="2">졸업</option>
                    </select>
                    <button
                        className={styles.button}
                        onClick={changeStudentData}
                    >
                        반영하기
                    </button>
                </>
            ) : (
                "해당 학번의 정보가 존재하지 않습니다"
            )}
        </div>
    );
};

export default StudentStatus;
