import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "./Handbook.module.css";
import showTime from "assets/js/timeParse";

// 공통 > 수강편람
const Handbook = () => {
    const hb_classID = useRef();
    const hb_courseID = useRef();
    const hb_name = useRef();

    useEffect(() => {
        const title = "수강편람";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);

    const [cnt, setCnt] = useState(0);
    const [result, setResult] = useState({});

    // 년도 설정
    const [yearSelected, setYearSelected] = useState(2022);
    const onYearChange = (e) => {
        setYearSelected(e.target.value);
    };

    // 초기화
    const resetControl = () => {
        hb_classID.current.value = "";
        hb_courseID.current.value = "";
        hb_name.current.value = "";
    };

    // 검색함수
    const searchClass = async () => {
        const res = await axios.post("http://localhost:4000/api/getClass", {
            class_id: hb_classID.current.value,
            course_id: hb_courseID.current.value,
            name: hb_name.current.value,
            year: yearSelected,
        });
        const data = res.data;
        if (data[0]) {
            console.log(res.data);
            setResult(res.data);
            setCnt(res.data.length);
        } else {
            setResult({});
            setCnt(0);
        }
    };

    // 테이블 구분자
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

    useEffect(() => {
        searchClass();
    }, []);
    return (
        // className={styles.}
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
                        className={styles.input}
                        name="year"
                        onChange={onYearChange}
                    >
                        <option value="2022" selected={yearSelected === 2022}>
                            2022
                        </option>
                        <option value="2021" selected={yearSelected === 2021}>
                            2021
                        </option>
                        <option value="2020" selected={yearSelected === 2020}>
                            2020
                        </option>
                        <option value="2019" selected={yearSelected === 2019}>
                            2019
                        </option>
                    </select>
                    {/* <input
                        
                        className={styles.input}
                        type="option"
                        placeholder="교과목명"
                    /> */}
                    <button className={styles.button} onClick={searchClass}>
                        검색
                    </button>
                    <button className={styles.button} onClick={resetControl}>
                        초기화
                    </button>
                </div>
                <div className={styles.resultTable}>
                    <div className={styles.table}>
                        <div className={styles.thead}>
                            <div className={styles.tr}>
                                {ths.map((th, i) => (
                                    <div className={styles.th} key={i}>
                                        {th}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.tbody}>
                            {cnt !== 0
                                ? result.map((v, i) => (
                                      <div key={i} className={styles.tr}>
                                          <div className={styles.td}>
                                              {v.class_no}
                                          </div>
                                          <div className={styles.td}>
                                              {v.course_id}
                                          </div>
                                          <div className={styles.td}>
                                              {v.class_name}
                                          </div>
                                          <div className={styles.td}>
                                              {v.lecturer_name}
                                          </div>
                                          <div className={styles.td}>
                                              {showTime(
                                                  v.begin1,
                                                  v.end1,
                                                  v.begin2,
                                                  v.end2
                                              )}
                                              {/* {`\n${result[i].begin1}`} */}
                                          </div>
                                          <div className={styles.td}>
                                              {v.taking}/{v.person_max}
                                          </div>
                                          <div className={styles.td}>
                                              {v.building_name +
                                                  " " +
                                                  v.room_no}
                                              호
                                          </div>
                                          <div className={styles.td}>
                                              {v.opened}
                                          </div>
                                      </div>
                                  ))
                                : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Handbook;
