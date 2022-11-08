import axios from "axios";
import ClassOlap from "components/Control/ClassOlap";
import MyClass from "components/Control/MyClass";
import RouteHelper from "components/RouteHelper";
import { useEffect, useRef, useState } from "react";
import styles from "./ClassControl.module.css";
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
    const [classes, setClasses] = useState([]);
    const [lecturers, setLecturers] = useState([]);

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

    // 수업 추가
    const iClassNo = useRef();
    const iCourseId = useRef();
    const iMajorId = useRef();
    const iYear = useRef();
    const iLecId = useRef(); // 교수 -> 자기꺼로 | 관리자 -> 교수아이디 추가
    const iPersonMax = useRef();
    const iOpened = useRef();
    const iRoomId = useRef();
    const iFirstDay = useRef();
    const iFirstStart = useRef();
    const iFirstEnd = useRef();
    const iSecondDay = useRef();
    const iSecondStart = useRef();
    const iSecondEnd = useRef();

    const insertClass = async () => {
        // 수용인원을 초과하는 지 확인한다.
        const res1 = await axios.post("http://localhost:4000/api/getRoomSize", {
            roomId: iRoomId.current.value,
            maxPerson: iPersonMax.current.value,
        });
        const data1 = res1.data;
        if (data1.status === "no") {
            alert(
                "수강 가능 인원수가 강의실 수용 가능 인원수를 초과하였습니다."
            );
            return;
        }

        let lecId = userObj.job === "admin" ? iLecId.current.value : userObj.id;
        const res = await axios.post("http://localhost:4000/api/insertClass", {
            classNo: iClassNo.current.value,
            courseId: iCourseId.current.value,
            majorId: iMajorId.current.value,
            year: iYear.current.value,
            lecturerId: lecId,
            personMax: iPersonMax.current.value,
            opened: iOpened.current.value,
            roomId: iRoomId.current.value,
        });
        const data = res.data;
        console.log(data);

        const res2 = await axios.post("http://localhost:4000/api/insertTime", {
            classId: data.insertId,
            firstDay: iFirstDay.current.value,
            firstStart: iFirstStart.current.value,
            firstEnd: iFirstEnd.current.value,
            secondDay: iSecondDay.current.value,
            secondStart: iSecondStart.current.value,
            secondEnd: iSecondEnd.current.value,
        });
        const data2 = res2.data;
        console.log(data2);
        alert("수업이 성공적으로 추가되었습니다");
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
    const classBeginTimeRange = [
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
    ];
    const classEndTimeRange = [
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
    ];
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
                            <div className={styles.container}>
                                <div className={styles.title}>
                                    <h3>수업 추가하기</h3>
                                </div>
                                <div className={styles.content}>
                                    <p>
                                        평일 18시 이후, 토요일 수업은 E-러닝으로
                                        분류됩니다.
                                    </p>
                                    <p>일요일 수업을 개설할 수 없습니다.</p>
                                    <input
                                        ref={iClassNo}
                                        className={styles.input}
                                        type={"text"}
                                        placeholder="class_no"
                                        required
                                    />
                                    <select
                                        className={styles.input}
                                        ref={iCourseId}
                                    >
                                        <option disabled>학수번호</option>
                                        {courses?.map((v, i) => (
                                            <option key={i} value={v.course_id}>
                                                {v.course_id}({v.name})
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.input}
                                        ref={iMajorId}
                                    >
                                        <option disabled>전공</option>
                                        {majors?.map((v, i) => (
                                            <option key={i} value={v.major_id}>
                                                {v.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.input}
                                        ref={iRoomId}
                                    >
                                        <option disabled>강의실</option>
                                        {rooms?.map((v, i) => (
                                            <option key={i} value={v.room_id}>
                                                {v.name}({v.room_no}호,
                                                수용가능:
                                                {v.occupancy})
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.input}
                                        ref={iYear}
                                    >
                                        <option disabled>학년</option>
                                        {[1, 2, 3, 4].map((v, i) => (
                                            <option key={i} value={v}>
                                                {v}학년
                                            </option>
                                        ))}
                                    </select>
                                    {userObj.job === "admin" ? (
                                        <select
                                            className={styles.input}
                                            ref={iLecId}
                                        >
                                            <option disabled>교강사</option>
                                            {lecturers.map((v, i) => (
                                                <option
                                                    key={i}
                                                    value={v.lecturer_id}
                                                >
                                                    {v.name}({v.lecturer_id})
                                                </option>
                                            ))}
                                        </select>
                                    ) : null}
                                    <input
                                        ref={iPersonMax}
                                        className={styles.input}
                                        type={"text"}
                                        placeholder="person_max"
                                        required
                                    />
                                    <input
                                        ref={iOpened}
                                        className={styles.input}
                                        type={"text"}
                                        placeholder="opened"
                                        required
                                    />
                                    <br />
                                    <select
                                        className={styles.input}
                                        ref={iFirstDay}
                                    >
                                        <option disabled>요일1</option>
                                        {[
                                            "월",
                                            "화",
                                            "수",
                                            "목",
                                            "금",
                                            "토",
                                        ].map((v, i) => (
                                            <option key={i} value={i}>
                                                {v}요일
                                            </option>
                                        ))}
                                        <option value={6}>원격(E-러닝)</option>
                                    </select>
                                    <select
                                        className={styles.input}
                                        ref={iFirstStart}
                                    >
                                        <option disabled>시작시간1</option>
                                        {classBeginTimeRange.map((v, i) => (
                                            <option key={i} value={i}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.input}
                                        ref={iFirstEnd}
                                    >
                                        <option disabled>종료시간1</option>
                                        {classEndTimeRange.map((v, i) => (
                                            <option key={i} value={i}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.input}
                                        ref={iSecondDay}
                                    >
                                        <option disabled>요일2</option>
                                        {[
                                            "월",
                                            "화",
                                            "수",
                                            "목",
                                            "금",
                                            "토",
                                        ].map((v, i) => (
                                            <option key={i} value={i}>
                                                {v}요일
                                            </option>
                                        ))}
                                        <option value={6}>원격(E-러닝)</option>
                                    </select>
                                    <select
                                        className={styles.input}
                                        ref={iSecondStart}
                                    >
                                        <option disabled>시작시간2</option>
                                        {classBeginTimeRange.map((v, i) => (
                                            <option key={i} value={i}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.input}
                                        ref={iSecondEnd}
                                    >
                                        <option disabled>종료시간2</option>
                                        {classEndTimeRange.map((v, i) => (
                                            <option key={i} value={i}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={insertClass}
                                        className={styles.button}
                                    >
                                        추가
                                    </button>
                                </div>
                            </div>

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
