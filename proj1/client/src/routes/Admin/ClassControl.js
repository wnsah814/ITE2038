import axios from "axios";
import ClassOlap from "components/Control/ClassOlap";
import RouteHelper from "components/RouteHelper";
import { useEffect, useRef, useState } from "react";
import ClassAdd from "./ClassAdd";
import styles from "./ClassControl.module.css";

// 관리자 > 수업관리
const ClassControl = ({ userObj }) => {
    useEffect(() => {
        const title = " 수업 관리";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);
    const [refresh, setRefresh] = useState(false);
    const refreshData = () => {
        setRefresh((prev) => !prev);
    };
    const [majors, setMajors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const setting = async () => {
            console.log();
            const res1 = await axios.post(
                "http://localhost:4000/api/getMajors"
            );
            const data1 = res1.data;
            const res2 = await axios.post("http://localhost:4000/api/getRooms");
            const data2 = res2.data;
            const res3 = await axios.post(
                "http://localhost:4000/api/getCourses"
            );
            const data3 = res3.data;
            const res4 = await axios.post(
                "http://localhost:4000/api/getClasses"
            );
            const data4 = res4.data;
            const res5 = await axios.post(
                "http://localhost:4000/api/getLecturers"
            );
            const data5 = res5.data;

            setMajors(data1);
            setRooms(data2);
            setCourses(data3);
            setClasses(data4);
            setLecturers(data5);
        };
        setting();
    }, [refresh]);

    // 과목 추가
    const cCourseId = useRef();
    const cName = useRef();
    const cCredit = useRef();
    const insertCourse = async () => {
        const res = await axios.post("http://localhost:4000/api/insertCourse", {
            courseId: cCourseId.current.value,
            name: cName.current.value,
            credit: cCredit.current.value,
        });
        const data = res.data;
        console.log(data);
        alert("과목을 추가하였습니다.");
        refreshData();
    };

    // 과목 삭제
    const cdCourseId = useRef();
    const deleteCourse = async () => {
        const res = await axios.post("http://localhost:4000/api/deleteCourse", {
            courseId: cdCourseId.current.value,
        });
        const data = res.data;
        console.log(data);
        alert("과목을 삭제하였습니다.");
        refreshData();
    };

    // 수업 수정
    // const uClassId = useRef();
    // const uClassNo = useRef();
    // const uCourseId = useRef();
    // const uMajor
    // const [updateClassObj, setUpdateClassObj] = useState({});
    // const onTargetChange = async (e) => {
    //     console.log(e.target.value);
    //     const res = await axios.post("http://localhost:4000/api/getClassData", {
    //         classId: e.target.value,
    //     });
    //     const data = res.data;
    //     console.log(data);
    //     setUpdateClassObj(data);
    // };

    const updateClass = async () => {
        const res = await axios.post("http://localhost:4000/api/updateClass");
        const data = res.data;
        console.log(data);
        refreshData();
    };

    const dClassId = useRef();
    const deleteClass = async () => {
        const classIdSave = dClassId.current.value;

        const res = await axios.post("http://localhost:4000/api/deleteClass", {
            classId: classIdSave,
        });
        const data = res.data;
        console.log(data);
        refreshData();
    };

    //shortcut
    const removeApplied = async () => {
        const res = await axios.post("http://localhost:4000/api/deleteApplied");
        const data = res.data;
        console.log(data);
    };

    const removeWanted = async () => {
        const res = await axios.post("http://localhost:4000/api/deleteWanted");
        const data = res.data;
        console.log(data);
    };

    return (
        <div className={styles.wrapper}>
            {userObj.job === "admin" || userObj.job === "lecturer" ? (
                <>
                    <div className={styles.contents}>
                        <div className={styles.conatinersTitle}>
                            🔽과목 관리
                        </div>

                        <div className={styles.containers}>
                            <div className={styles.container}>
                                <div className={styles.title}>
                                    <h3>과목 추가하기</h3>
                                </div>
                                <div className={styles.content}>
                                    <input
                                        ref={cCourseId}
                                        className={styles.input}
                                        type="text"
                                        placeholder="course_id"
                                    />
                                    <input
                                        ref={cName}
                                        className={styles.input}
                                        type="text"
                                        placeholder="name"
                                    />
                                    <input
                                        ref={cCredit}
                                        className={styles.input}
                                        type="number"
                                        placeholder="credit"
                                    />
                                    <button
                                        onClick={insertCourse}
                                        className={styles.button}
                                    >
                                        추가
                                    </button>
                                </div>
                            </div>

                            <div className={styles.container}>
                                <div className={styles.title}>
                                    <h3>과목 삭제하기</h3>
                                </div>
                                <div className={styles.content}>
                                    <input
                                        ref={cdCourseId}
                                        className={styles.input}
                                        type="text"
                                        placeholder="course_id"
                                    />
                                    <button
                                        onClick={deleteCourse}
                                        className={styles.button}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.conatinersTitle}>
                            🔽수업 관리
                        </div>
                        <div className={styles.containers}>
                            <ClassAdd
                                userObj={userObj}
                                refreshData={refreshData}
                                majors={majors}
                                rooms={rooms}
                                courses={courses}
                                lecturers={lecturers}
                            />

                            {/* <div className={styles.container}>
                    <div className={styles.title}>
                    </div>

                    <div className={styles.content}>ㅎㅇ</div>
                </div> */}
                            {/* <div className={styles.container}>
                    <div className={styles.title}>
                        <h2>수업 수정하기</h2>
                    </div>

                    <div className={styles.content}>
                        <select
                            className={styles.input}
                            onChange={onTargetChange}
                        >
                            {classes.map((v, i) => (
                                <option key={i} value={v.class_id}>
                                    {v.course_id}-{v.class_id}
                                </option>
                            ))}
                        </select>
                        <button className={styles.button}>검색하기</button>

                        <br />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="class_no"
                            required
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="course_id"
                            required
                            value={updateClassObj.course_id}
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="major_id"
                            required
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="year"
                            required
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="person_max"
                            required
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="room_id"
                            required
                        />
                        <button onClick={updateClass} className={styles.button}>
                            반영
                        </button>
                    </div>
                </div> */}

                            <div className={styles.container}>
                                <div className={styles.title}>
                                    <h3>수업 삭제하기</h3>
                                </div>
                                <div className={styles.content}>
                                    <select
                                        ref={dClassId}
                                        className={styles.input}
                                    >
                                        {classes.map((v, i) => (
                                            <option key={i} value={v.class_id}>
                                                {v.course_id}-{v.class_id}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={deleteClass}
                                        className={styles.button}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.container}>
                            <div className={styles.title}>
                                <h2>OLAP</h2>
                            </div>
                            <div className={styles.content}>
                                <ClassOlap />
                            </div>
                        </div>

                        <div className={styles.container}>
                            <div className={styles.title}>
                                <h2>단축명령</h2>
                            </div>
                            <div className={styles.content}>
                                <button
                                    className={styles.button}
                                    onClick={removeApplied}
                                >
                                    수강 신청 기록 지우기
                                </button>
                                <button
                                    className={styles.button}
                                    onClick={removeWanted}
                                >
                                    수강 희망 기록 지우기
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <RouteHelper />
            )}
        </div>
    );
};
export default ClassControl;
