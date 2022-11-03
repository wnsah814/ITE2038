import axios from "axios";
import ApplyBtn from "components/ApplyBtn";
import WishBtn from "components/WishBtn";
import { useEffect, useRef, useState } from "react";
import styles from "./Enrollment.module.css";

const Handbook = ({ userObj }) => {
    const hb_classID = useRef();
    const hb_courseID = useRef();
    const hb_name = useRef();

    useEffect(() => {
        const title = "수강신청";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);

    const [cnt, setCnt] = useState(0);
    const [result, setResult] = useState({});
    const [yearSelected, setYearSelected] = useState(2022);
    const onYearChange = (e) => {
        setYearSelected(e.target.value);
    };
    const resetControl = () => {
        hb_classID.current.value = "";
        hb_courseID.current.value = "";
        hb_name.current.value = "";
    };
    const searchClass = () => {
        axios
            .post("http://localhost:4000/api/getClass", {
                class_id: hb_classID.current.value,
                course_id: hb_courseID.current.value,
                name: hb_name.current.value,
                year: yearSelected,
            })
            .then((res) => {
                if (res.data[0]) {
                    console.log(res.data);
                    setResult(res.data);
                    setCnt(res.data.length);
                } else {
                    setResult({});
                    setCnt(0);
                }
            });
    };
    const ths = [
        "수강신청",
        "희망신청",
        "수업번호",
        "학수번호",
        "교과목명",
        "교강사",
        "수업시간",
        "수강/정원",
        "강의실",
        "년도",
    ];
    const showTime = (start1, end1, start2, end2) => {
        let time = "";
        if (start1 === null || start1 === undefined || start1 === "") {
            time = "정보없음";
            return time;
        } else if (start1 === "NO") {
            time = "E-러닝";
            return time;
        } else {
            time += showOneTime(start1, end1);
        }
        if (start2) {
            time += "\n";
            time += showOneTime(start2, end2);
        }
        return time;
    };

    const showOneTime = (start, end) => {
        const day_start = new Date(start);
        const day_end = new Date(end);
        day_start.setTime(day_start.getTime() + 9 * 60 * 60 * 1000);
        day_end.setTime(day_end.getTime() + 9 * 60 * 60 * 1000);
        const weeks = [
            "일요일",
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
        ];
        const timeStr = `${weeks[day_start.getUTCDay()]} ${day_start
            .getUTCHours()
            .toString()
            .padStart(2, "0")}:${day_start
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")} - ${day_end
            .getUTCHours()
            .toString()
            .padStart(2, "0")}:${day_end
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")}`;
        return timeStr;
    };

    useEffect(() => {
        searchClass();
    }, []);
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.searchOption}>
                    <input
                        ref={hb_classID}
                        className={styles.input}
                        type="number"
                        placeholder="수업번호"
                    />
                    <input
                        ref={hb_courseID}
                        className={styles.input}
                        type="text"
                        placeholder="학수번호"
                    />
                    <input
                        ref={hb_name}
                        className={styles.input}
                        type="text"
                        placeholder="교과목명"
                    />
                    <select
                        name="year"
                        onChange={onYearChange}
                        value={yearSelected}
                    >
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                    </select>
                    <button className={styles.button} onClick={searchClass}>
                        검색
                    </button>
                    <button className={styles.button} onClick={resetControl}>
                        초기화
                    </button>
                </div>
                <div className={styles.resultTable}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr className={styles.tr}>
                                {ths.map((th, i) => (
                                    <th className={styles.th} key={i}>
                                        {th}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {cnt !== 0
                                ? result.map((v, i) => (
                                      <tr key={i} className={styles.tr}>
                                          <td className={styles.td}>
                                              <ApplyBtn
                                                  vector={v}
                                                  userObj={userObj}
                                              />
                                          </td>
                                          <td className={styles.td}>
                                              <WishBtn
                                                  vector={v}
                                                  userObj={userObj}
                                              />
                                          </td>
                                          <td className={styles.td}>
                                              {v.class_no}
                                          </td>
                                          <td className={styles.td}>
                                              {v.course_id}
                                          </td>
                                          <td className={styles.td}>
                                              {v.class_name}
                                          </td>
                                          <td className={styles.td}>
                                              {v.lecturer_name}
                                          </td>
                                          <td className={styles.td}>
                                              {showTime(
                                                  v.begin1,
                                                  v.end1,
                                                  v.begin2,
                                                  v.end2
                                              )}
                                              {/* {`\n${result[i].begin1}`} */}
                                          </td>
                                          <td className={styles.td}>
                                              {v.person_max}
                                          </td>
                                          <td className={styles.td}>
                                              {v.building_name +
                                                  " " +
                                                  v.building_id}
                                          </td>
                                          <td className={styles.td}>
                                              {v.opened}
                                          </td>
                                      </tr>
                                  ))
                                : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default Handbook;
