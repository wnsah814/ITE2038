import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "./MyClass.module.css";
const MyClass = ({ userObj }) => {
    const [myClass, setMyClass] = useState();
    const [refresh, setRefresh] = useState(false);
    const refreshData = () => {
        setRefresh((prev) => !prev);
    };

    const getMyClass = async () => {
        const res = await axios.post("http://localhost:4000/api/getMyClasses", {
            lecturerId: userObj.id,
        });
        const data = res.data;
        console.log("myclass", data);
        setMyClass(data);
    };

    useEffect(() => {
        getMyClass();
    }, [refresh, userObj]);

    const [classObj, setClassObj] = useState({});

    const classIdRef = useRef();
    // const yearRef = useRef();
    const sizeRef = useRef();
    const sidRef = useRef();

    const searchMyClass = async () => {
        const res = await axios.post("http://localhost:4000/api/getClassData", {
            classId: classIdRef.current.value,
            // year: yearRef.current.value,
        });
        const data = res.data;
        console.log("classdata", data);
        sizeRef.current.value = data.person_max;
        setClassObj(data);
    };

    const increase = async () => {
        if (classIdRef.current.value === "0") {
            alert("수업을 먼저 선택해주세요");
            return;
        }
        console.log(classIdRef.current.value);
        const res = await axios.post(
            "http://localhost:4000/api/increaseOccupancy",
            {
                newMax: sizeRef.current.value,
                classId: classIdRef.current.value,
            }
        );

        const data = res.data;
        if (data?.status === "no") {
            alert(data?.msg);
        }
        console.log(data);
    };

    // 수강 허용
    const allowClass = async () => {
        if (classIdRef.current.value === "0") {
            alert("수업을 먼저 선택해주세요");
            return;
        }
        // 강의실 최대 수 확인해주기
        const sizeCheck = await axios.post(
            "http://localhost:4000/api/getClassSize",
            {
                classId: classIdRef.current.value,
            }
        );
        const check0 = sizeCheck.data;
        if (check0.status === "no") {
            alert("실패:강의실 수용 인원수 초과");
            return;
        }
        // 재수강이 불가능 한 지 검사한다 (B0 이상일 경우 불가능)
        const applyCheck1 = await axios.post(
            "http://localhost:4000/api/appC1",
            {
                studentId: sidRef.current.value,
                courseId: classObj.course_id,
            }
        );
        const check1 = applyCheck1.data;
        if (check1.status === "no") {
            alert("재수강 불가능 학점");
            return;
        }

        // 18학점 이상 신청하는 지
        const applyCheck3 = await axios.post(
            "http://localhost:4000/api/appC3",
            {
                studentId: sidRef.current.value,
                credit: classObj.credit,
            }
        );
        const check3 = applyCheck3.data;
        if (check3.status === "no") {
            console.log(check3.result);
            alert("최대 신청 가능학점을 초과하였습니다.");
            return;
        }
        // 시간이 겹치는 지
        const applyCheck4 = await axios.post(
            "http://localhost:4000/api/appC4",
            {
                studentId: sidRef.current.value,
                begin1: classObj.begin1,
                end1: classObj.end1,
                begin2: classObj.begin2,
                end2: classObj.end2,
            }
        );
        const check4 = applyCheck4.data;
        if (check4.status === "no") {
            alert("수업시간이 겹칩니다");
            return;
        }
        // 정원이 다 찼는 지는 확인하지 않는다.
        const res = await axios.post("http://localhost:4000/api/apply", {
            student_id: sidRef.current.value,
            class_id: classObj.class_id,
        });

        const data = res.data;
        if (data) {
            alert("수강 허용 작업을 성공하였습니다");
            console.log(data);
        } else {
            alert("수강 허용 실패");
            console.log("no data");
        }
        // refreshData();
    };
    return (
        <div className={styles.container}>
            <div>
                <div className={styles.content}>
                    <span>내 수업 선택 </span>
                    <select className={styles.input} ref={classIdRef}>
                        <option value="0">
                            2022년 수업만 선택 가능합니다.
                        </option>
                        {myClass?.map((v, i) => (
                            <option key={i} value={v.class_id}>
                                {v.course_id}-{v.class_id}
                            </option>
                        ))}
                    </select>
                    <button onClick={searchMyClass} className={styles.button}>
                        조회하기
                    </button>
                </div>
                <br />
                <hr />

                {/* <select className={styles.input} ref={yearRef}>
                    <option disabled>년도 선택</option>
                    {[2022, 2021, 2020, 2019].map((v, i) => (
                        <option key={i} value={v}>
                            {v}년
                        </option>
                    ))}
                </select> */}
                <div className={styles.content}>
                    <h2>수업 증원하기</h2>
                    <input
                        ref={sizeRef}
                        className={styles.input}
                        type="number"
                        placeholder="최대 학생 수"
                    />

                    <button className={styles.button} onClick={increase}>
                        반영
                    </button>
                </div>

                <div className={styles.content}>
                    <h2>수강허용</h2>
                    <input
                        ref={sidRef}
                        className={styles.input}
                        type="number"
                        placeholder="학생 학번"
                    />
                    <button onClick={allowClass} className={styles.button}>
                        반영
                    </button>
                </div>
            </div>
        </div>
    );
};
export default MyClass;
