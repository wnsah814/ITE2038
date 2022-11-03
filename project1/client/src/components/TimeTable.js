import axios from "axios";
import { useEffect, useState } from "react";
import TimeData from "./TimeData";
import styles from "./TimeTable.module.css";
const TimeTable = ({ userObj }) => {
    const [timeTable, setTimeTable] = useState([]);
    const [classObj, setClassObj] = useState();
    // const [timeArray, setTimeArray] = useState(
    //     new Array(7).fill(0).map(() => new Array(0))
    // );
    const addClassToTable = (timeArr, i, b, e) => {
        const begin = new Date(new Date(b).getTime() + 9 * 60 * 60 * 1000);

        const end = new Date(new Date(e).getTime() + 9 * 60 * 60 * 1000);

        const diff = end.getTime() - begin.getTime();
        let cnts = diff / (30 * 60 * 1000);
        let row = begin.getUTCDay();
        let hr = 2 * (begin.getUTCHours() - 8);
        let mi = begin.getUTCMinutes() / 30;

        console.log("data: ", cnts, row, hr, mi);

        let newData = { start_idx: hr + mi, counts: cnts, course_index: i }; //class_id, counts(flexAmount)
        timeArr[row].push(newData);
    };

    const makeTimeTable = (myAppliedClass) => {
        const myClass = myAppliedClass;
        console.log("timetable을 만듭니다");
        let timeArr = new Array(7).fill(0).map(() => new Array(0));
        console.log("inital timeArr: ", timeArr);

        for (let i = 0; i < myClass.length; ++i) {
            const v = myClass[i];
            if (v.begin === "NO") continue; // 미지정 강좌
            // 18시 이상인 경우도 처리해 둘 것
            // 함수를 만들어서 (begin, end) 로 시행할 것
            if (v?.begin1 !== undefined) {
                addClassToTable(timeArr, i, v.begin1, v.end1);
            }
            if (v?.begin2 !== undefined) {
                addClassToTable(timeArr, i, v.begin2, v.end2);
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
            for (let rest = it; rest < 20; ++rest) {
                timetable[day].push([-1, 1]); //class_id, count
            }
        }

        console.log("수정된 timetable", timetable);
        setTimeTable(timetable);
    };

    const getAppliedClass = async () => {
        try {
            console.log(userObj.id, "의 수강 정보를 불러옵니다.");
            const response = await axios.post(
                "http://localhost:4000/api/getapplied",
                {
                    student_id: userObj.id,
                }
            );

            const myAppliedClass = response.data;
            console.log("my >>", myAppliedClass);
            if (myAppliedClass.length === 0) {
                console.log("받아온 수강신청 데이터가 없습니다");
            } else {
                console.log("myAppliedClass >>", myAppliedClass);
                setClassObj(myAppliedClass);
                makeTimeTable(myAppliedClass);
            }
        } catch (e) {
            console.log("Err >>", e);
        }
    };

    useEffect(() => {
        console.log("userObj 정보가 변경되었습니다");
        getAppliedClass();
    }, [userObj]);

    return (
        <div className={styles.timetable}>
            <div id="index" className={styles.day}>
                <div className={styles.dayName}></div>
                {[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                ].map((v, i) => (
                    <div key={i} className={styles.oneBlock}>
                        {v}교시
                    </div>
                ))}
            </div>
            <div id="mon" className={styles.day}>
                <div className={styles.dayName}>월</div>
                <div className={styles.classes}>
                    {timeTable[1]?.map((v) => (
                        <TimeData
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
                    {timeTable[2]?.map((v) => (
                        <TimeData
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
                    {timeTable[3]?.map((v) => (
                        <TimeData
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
                    {timeTable[4]?.map((v) => (
                        <TimeData
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
                    {timeTable[5]?.map((v) => (
                        <TimeData
                            index={v[0]}
                            flexAmount={v[1]}
                            classObj={classObj}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimeTable;
