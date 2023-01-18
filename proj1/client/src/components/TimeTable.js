import axios from "axios";
import { useEffect, useState } from "react";
import TimeData from "./TimeData";
import TimeEData from "./TimeEData";
import styles from "./TimeTable.module.css";

// 수업시간표 component
const TimeTable = ({ userObj, studentId }) => {
    const [flag, setFlag] = useState(false); // 표시 할 지 여부 (수강중인 수업이 없다면 테이블 표시 안함)
    const [timeTable, setTimeTable] = useState([]); // 시간표 데이터
    const [eLearning, setELearning] = useState([]); // 이러닝 데이터
    const [classObj, setClassObj] = useState(); // 수강중인 수업

    const addClassToTable = (timeArr, i, b, e) => {
        const begin = new Date(new Date(b).getTime() + 9 * 60 * 60 * 1000);
        const end = new Date(new Date(e).getTime() + 9 * 60 * 60 * 1000);

        const diff = end.getTime() - begin.getTime();
        let cnts = diff / (30 * 60 * 1000); // (차이)교시 구하기
        let row = begin.getUTCDay(); // 요일
        let hr = 2 * (begin.getUTCHours() - 8); // 시작 교시
        let mi = begin.getUTCMinutes() / 30; // 시작교시 조정값
        let newData = { start_idx: hr + mi, counts: cnts, course_index: i }; //class_id, counts(flexAmount)
        timeArr[row].push(newData);
    };

    const checkValid = (beginDate, idx) => {
        // beginDate와 courseIdx를 인자로 갖는 함수
        if (beginDate === "NO") {
            console.log("미지정 강좌");
            return false;
        }
        const begin = new Date(beginDate);
        if (begin.getUTCDay() === 7) {
            // 일요일
            alert("수업 시간에 오류가 있습니다(일요일)");
            return false;
        } else if (begin.getUTCDay() === 6) {
            // 토요일
            console.log(idx, "토요일");
            setELearning((prev) => [...prev, { courseIdx: idx }]);
            return false;
        } else if (begin.getUTCHours() >= 18) {
            // 평일 18시 이후
            console.log(idx, "18시 이후");
            setELearning((prev) => [...prev, { courseIdx: idx }]);
            return false;
        }
        return true;
    };

    // 내 수강신청 정보를 바탕으로 시간표 데이터를 만든다.
    const makeTimeTable = (myAppliedClass) => {
        const myClass = myAppliedClass;
        let timeArr = new Array(7).fill(0).map(() => new Array(0));

        for (let i = 0; i < myClass.length; ++i) {
            const v = myClass[i];
            if (v.begin1 !== null && v.begin1 !== undefined) {
                if (checkValid(v.begin1, i)) {
                    addClassToTable(timeArr, i, v.begin1, v.end1);
                }
            }
            if (v.begin2 !== null && v.begin2 !== undefined) {
                if (checkValid(v.begin2, i)) {
                    addClassToTable(timeArr, i, v.begin2, v.end2);
                }
            }
        }

        //start index 기준 정렬
        for (let it = 0; it < timeArr.length; ++it) {
            timeArr[it].sort((a, b) => a.start_idx - b.start_idx);
        }

        let timetable = new Array(7).fill(0).map(() => new Array(0));
        for (let day = 0; day < 7; ++day) {
            let it = 0;
            for (
                let classCount = 0;
                classCount < timeArr[day].length;
                ++classCount
            ) {
                let c = timeArr[day][classCount].counts;
                let i = timeArr[day][classCount].course_index;
                let s = timeArr[day][classCount].start_idx;

                for (let k = 0; k < s - it; ++k) {
                    timetable[day].push([-1, 1]);
                }
                it += s - it + c;
                timetable[day].push([i, c]);
            }
            for (let rest = it; rest < 24; ++rest) {
                timetable[day].push([-1, 1]); //class_id, count
            }
        }
        // 만든 시간표 데이터를 저장한다.
        setTimeTable(timetable);
    };

    // 수강중인 수업을 가져온다.
    const getAppliedClass = async () => {
        let wonderId = userObj?.id;
        if (studentId !== undefined) {
            wonderId = studentId;
        }
        try {
            // console.log(wonderId, "의 수강 정보를 불러옵니다.");
            const response = await axios.post(
                "http://localhost:4000/api/getApplied",
                {
                    student_id: wonderId,
                }
            );

            const myAppliedClass = response.data;
            // console.log("my >>", myAppliedClass);
            if (myAppliedClass.length === 0) {
                // console.log("받아온 수강신청 데이터가 없습니다");
                setFlag(false);
            } else {
                setFlag(true);
                // console.log("myAppliedClass >>", myAppliedClass);
                setClassObj(myAppliedClass);
                makeTimeTable(myAppliedClass);
            }
        } catch (e) {
            console.log("Err >>", e);
        }
    };

    useEffect(() => {
        console.log("userObj 정보가 변경되었습니다", userObj);
        getAppliedClass();
    }, [userObj, studentId]);

    // 수업 교시 시간단위로
    // const timeRange = [
    //     "8:00",
    //     "8:30",
    //     "9:00",
    //     "9:30",
    //     "10:00",
    //     "10:30",
    //     "11:00",
    //     "11:30",
    //     "12:00",
    //     "12:30",
    //     "13:00",
    //     "13:30",
    //     "14:00",
    //     "14:30",
    //     "15:00",
    //     "15:30",
    //     "16:00",
    //     "16:30",
    //     "17:00",
    //     "17:30",
    //     "18:00",
    //     "18:30",
    // ];
    return (
        <>
            {flag ? (
                <div className={styles.timetable}>
                    <div className={styles.nonE}>
                        <div id="index" className={styles.day}>
                            <div className={styles.dayName}>교시</div>
                            <div className={styles.classes}>
                                {[
                                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                                    14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                                ].map((v, i) => (
                                    <div key={i} className={styles.oneBlock}>
                                        {v}교시
                                        {/* {timeRange[i]} ~ {timeRange[i + 1]} */}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div id="mon" className={styles.day}>
                            <div className={styles.dayName}>월</div>
                            <div className={styles.classes}>
                                {timeTable[1]?.map((v, i) => (
                                    <TimeData
                                        key={i}
                                        index={v[0]}
                                        flexAmount={v[1]}
                                        classObj={classObj}
                                    />
                                ))}
                            </div>
                        </div>
                        <div id="tue" className={styles.day}>
                            <div className={styles.dayName}>화</div>
                            <div className={styles.classes}>
                                {timeTable[2]?.map((v, i) => (
                                    <TimeData
                                        key={i}
                                        index={v[0]}
                                        flexAmount={v[1]}
                                        classObj={classObj}
                                    />
                                ))}
                            </div>
                        </div>
                        <div id="wed" className={styles.day}>
                            <div className={styles.dayName}>수</div>
                            <div className={styles.classes}>
                                {timeTable[3]?.map((v, i) => (
                                    <TimeData
                                        key={i}
                                        index={v[0]}
                                        flexAmount={v[1]}
                                        classObj={classObj}
                                    />
                                ))}
                            </div>
                        </div>
                        <div id="thur" className={styles.day}>
                            <div className={styles.dayName}>목</div>
                            <div className={styles.classes}>
                                {timeTable[4]?.map((v, i) => (
                                    <TimeData
                                        key={i}
                                        index={v[0]}
                                        flexAmount={v[1]}
                                        classObj={classObj}
                                    />
                                ))}
                            </div>
                        </div>
                        <div id="fri" className={styles.day}>
                            <div className={styles.dayName}>금</div>
                            <div className={styles.classes}>
                                {timeTable[5]?.map((v, i) => (
                                    <TimeData
                                        key={i}
                                        index={v[0]}
                                        flexAmount={v[1]}
                                        classObj={classObj}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.ELearning}>
                        {eLearning.map((v, i) => (
                            <TimeEData
                                key={i}
                                index={v.courseIdx}
                                classObj={classObj}
                            ></TimeEData>
                        ))}
                    </div>
                </div>
            ) : (
                "해당 학번의 시간표가 존재하지 않습니다"
            )}
        </>
    );
};

export default TimeTable;
