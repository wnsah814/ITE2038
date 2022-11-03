import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./Applied.module.css";
const Basket = ({ userObj, setUserObj }) => {
    useEffect(() => {
        const title = "신청내역";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);

    const ths = [
        "수업번호",
        "학수번호",
        "교과목명",
        "교강사",
        "수업시간",
        "수강/정원",
        "강의실",
        "년도",
    ];

    const [myClass, setMyClass] = useState({});
    const [cnt, setCnt] = useState(0);
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

    const getAppliedClass = () => {
        console.log(userObj.id, "my id");
        axios
            .post("http://localhost:4000/api/getapplied", {
                student_id: userObj.id,
            })
            .then((res) => {
                if (res.data[0]) {
                    console.log(res.data);
                    setMyClass(res.data);
                    setCnt(res.data.length);
                } else {
                    setMyClass({});
                    setCnt(0);
                    console.log("no data");
                }
            });
    };
    useEffect(() => {
        getAppliedClass();
    }, []);
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
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
                            ? myClass.map((v, i) => (
                                  <tr key={i} className={styles.tr}>
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
                                      </td>
                                      <td className={styles.td}>
                                          {v.person_max}
                                      </td>
                                      <td className={styles.td}>
                                          {v.building_name +
                                              " " +
                                              v.building_id}
                                      </td>
                                      <td className={styles.td}>{v.opened}</td>
                                  </tr>
                              ))
                            : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Basket;
