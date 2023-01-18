import axios from "axios";
import { useRef } from "react";
import styles from "./ClassAdd.module.css";

// 관라자 > 프로필 > 내 수업 관리
const ClassAdd = ({
    userObj,
    refreshData,
    majors,
    rooms,
    courses,
    lecturers,
}) => {
    // 수업 추가 Reference
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

    // 수업 추가하기
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

        // 수업 추가하기
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
        // console.log(data);

        // 수업시간 추가하기
        const res2 = await axios.post("http://localhost:4000/api/insertTime", {
            classId: data.insertId,
            firstDay: iFirstDay.current.value,
            firstStart: iFirstStart.current.value,
            firstEnd: iFirstEnd.current.value,
            secondDay: iSecondDay.current.value,
            secondStart: iSecondStart.current.value,
            secondEnd: iSecondEnd.current.value,
        });
        // const data2 = res2.data;
        // console.log(data2);
        alert("수업이 성공적으로 추가되었습니다");
        refreshData();
    };

    // 수업 시작 시간 제한
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

    // 수업 끝 시간 제한
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
        <div className={styles.container}>
            <div className={styles.title}>
                <h3>수업 추가하기</h3>
            </div>
            <div className={styles.content}>
                <div className={styles.text}>
                    <p>
                        ✔️평일 18시 이후, 토요일 수업은 E-러닝으로 분류됩니다.
                    </p>
                    <p>✔️일요일 수업을 개설할 수 없습니다.</p>
                </div>
                <div className={styles.dummy}>
                    {userObj.job === "admin" ? (
                        <select className={styles.input} ref={iLecId}>
                            <option disabled>교강사</option>
                            {lecturers.map((v, i) => (
                                <option key={i} value={v.lecturer_id}>
                                    {v.name}({v.lecturer_id})
                                </option>
                            ))}
                        </select>
                    ) : null}
                </div>
                <div className={styles.dummy}>
                    <input
                        ref={iClassNo}
                        className={styles.input}
                        type={"text"}
                        placeholder="class_no"
                        required
                    />
                    <select className={styles.input} ref={iCourseId}>
                        <option disabled>학수번호</option>
                        {courses?.map((v, i) => (
                            <option key={i} value={v.course_id}>
                                {v.course_id}({v.name})
                            </option>
                        ))}
                    </select>
                    <select className={styles.input} ref={iMajorId}>
                        <option disabled>전공</option>
                        {majors?.map((v, i) => (
                            <option key={i} value={v.major_id}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.dummy}>
                    <select className={styles.input} ref={iRoomId}>
                        <option disabled>강의실</option>
                        {rooms?.map((v, i) => (
                            <option key={i} value={v.room_id}>
                                {v.name}({v.room_no}호, 수용가능:
                                {v.occupancy})
                            </option>
                        ))}
                    </select>
                    <select className={styles.input} ref={iYear}>
                        <option disabled>학년</option>
                        {[1, 2, 3, 4].map((v, i) => (
                            <option key={i} value={v}>
                                {v}학년
                            </option>
                        ))}
                    </select>

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
                </div>

                <select className={styles.input} ref={iFirstDay}>
                    <option disabled>요일1</option>
                    {["월", "화", "수", "목", "금", "토"].map((v, i) => (
                        <option key={i} value={i}>
                            {v}요일
                        </option>
                    ))}
                    <option value={6}>원격(E-러닝)</option>
                </select>
                <select className={styles.input} ref={iFirstStart}>
                    <option disabled>시작시간1</option>
                    {classBeginTimeRange.map((v, i) => (
                        <option key={i} value={i}>
                            {v}
                        </option>
                    ))}
                </select>
                <select className={styles.input} ref={iFirstEnd}>
                    <option disabled>종료시간1</option>
                    {classEndTimeRange.map((v, i) => (
                        <option key={i} value={i}>
                            {v}
                        </option>
                    ))}
                </select>
                <select className={styles.input} ref={iSecondDay}>
                    <option disabled>요일2</option>
                    {["월", "화", "수", "목", "금", "토"].map((v, i) => (
                        <option key={i} value={i}>
                            {v}요일
                        </option>
                    ))}
                    <option value={6}>원격(E-러닝)</option>
                    <option value={7}>없음</option>
                </select>
                <select className={styles.input} ref={iSecondStart}>
                    <option disabled>시작시간2</option>
                    {classBeginTimeRange.map((v, i) => (
                        <option key={i} value={i}>
                            {v}
                        </option>
                    ))}
                </select>
                <select className={styles.input} ref={iSecondEnd}>
                    <option disabled>종료시간2</option>
                    {classEndTimeRange.map((v, i) => (
                        <option key={i} value={i}>
                            {v}
                        </option>
                    ))}
                </select>
                <button onClick={insertClass} className={styles.button}>
                    추가
                </button>
            </div>
        </div>
    );
};
export default ClassAdd;
