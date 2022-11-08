import axios from "axios";
import ApplyBtn from "components/ApplyBtn";
import WishBtn from "components/WishBtn";
import { useEffect, useRef, useState } from "react";
import styles from "./Enrollment.module.css";
import showTime from "assets/js/timeParse";
import RouteHelper from "components/RouteHelper";

const Handbook = ({ userObj }) => {
    const [refresh, setRefresh] = useState(false);
    const refreshData = () => {
        setRefresh((prev) => !prev);
    };
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
    const searchClass = async () => {
        const res = await axios.post("http://localhost:4000/api/getClass", {
            class_id: hb_classID.current.value,
            course_id: hb_courseID.current.value,
            name: hb_name.current.value,
            year: yearSelected,
        });
        const data = res.data;
        if (data) {
            // console.log(res.data);
            setResult(res.data);
            setCnt(res.data.length);
        } else {
            setResult({});
            setCnt(0);
        }
    };
    const ths = [
        "신청",
        "희망",
        "수업번호",
        "학수번호",
        "교과목명",
        "교강사",
        "수업시간",
        "학점",
        "수강/정원",
        "강의실",
        "년도",
    ];

    useEffect(() => {
        searchClass();
    }, [refresh]);
    return (
        <div className={styles.wrapper}>
            {userObj.job === "student" ? (
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
                        <button
                            className={styles.button}
                            onClick={resetControl}
                        >
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
                                                  <ApplyBtn
                                                      refreshData={refreshData}
                                                      vector={v}
                                                      userObj={userObj}
                                                  />
                                              </div>
                                              <div className={styles.td}>
                                                  <WishBtn
                                                      refreshData={refreshData}
                                                      vector={v}
                                                      userObj={userObj}
                                                  />
                                              </div>
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
                                                  {v.credit}
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
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <RouteHelper />
            )}
        </div>
    );
};
export default Handbook;
