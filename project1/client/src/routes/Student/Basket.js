import axios from "axios";
import ApplyBtn from "components/ApplyBtn";
import WishBtn from "components/WishBtn";
import { useEffect, useState } from "react";
import styles from "./Basket.module.css";
import showTime from "assets/js/timeParse";
import RouteHelper from "components/RouteHelper";

// 학생 > 희망과목
const Basket = ({ userObj, setUserObj }) => {
    useEffect(() => {
        const title = "희망수업";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);
    // 새로고침
    const [refresh, setRefresh] = useState(false);
    const refreshData = () => {
        setRefresh((prev) => !prev);
    };
    // 테이블 구분자
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
    // 내 희망과목
    const [myClass, setMyClass] = useState({});
    const [cnt, setCnt] = useState(0);
    // 내 희망과목 가져오기
    const getWantedClass = async () => {
        console.log(userObj.id, "my id");
        const res = await axios.post("http://localhost:4000/api/getwant", {
            student_id: userObj.id,
        });
        const data = res.data;
        if (data) {
            console.log(res.data);
            setMyClass(res.data);
            setCnt(res.data.length);
        } else {
            setMyClass({});
            setCnt(0);
            console.log("no data");
        }
    };
    useEffect(() => {
        getWantedClass();
    }, [userObj, refresh]);
    return (
        <div className={styles.wrapper}>
            {userObj.job === "student" ? (
                <div className={styles.container}>
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
                                ? myClass.map((v, i) => (
                                      <div key={i} className={styles.tr}>
                                          <div className={styles.td}>
                                              <ApplyBtn
                                                  vector={v}
                                                  userObj={userObj}
                                                  refreshData={refreshData}
                                              />
                                          </div>
                                          <div className={styles.td}>
                                              <WishBtn
                                                  vector={v}
                                                  userObj={userObj}
                                                  refreshData={refreshData}
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
                                              {/* {`\n${myClass[i].begin1}`} */}
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
            ) : (
                <RouteHelper />
            )}
        </div>
    );
};

export default Basket;
