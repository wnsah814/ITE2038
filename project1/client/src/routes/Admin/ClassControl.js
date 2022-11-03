import axios from "axios";
import { useEffect } from "react";
import styles from "./ClassControl.module.css";
const ClassControl = () => {
    useEffect(() => {
        const title = " 수업 관리";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);
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

    const getClassData = async () => {
        const res = await axios.post("http://localhost:4000/api/getClassData");
        const data = res.data;

        console.log(data);
    };
    const getTakeData = async () => {
        const res = await axios.post("http://localhost:4000/api/getTakeData");
        const data = res.data;

        console.log(data);
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.contents}>
                <div className={styles.container}>
                    <div className={styles.title}>
                        <h2>수업 추가하기</h2>
                    </div>
                    <div className={styles.content}>
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="class_no"
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="course_id"
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="major_id"
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="year"
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="person_max"
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="room_id"
                        />
                        <input
                            className={styles.button}
                            type="submit"
                            value="추가"
                        />
                    </div>
                </div>

                <div className={styles.container}>
                    <div className={styles.title}>
                        <h2>수업 수정하기</h2>
                    </div>
                    <div className={styles.content}>
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="class_no"
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="course_id"
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="major_id"
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="year"
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="person_max"
                        />
                        <input
                            className={styles.input}
                            type={"text"}
                            placeholder="room_id"
                        />
                        <input
                            className={styles.button}
                            type="submit"
                            value="추가"
                        />
                    </div>
                </div>

                <div className={styles.container}>
                    <div className={styles.title}>
                        <h2>수업 삭제하기</h2>
                    </div>
                    <div className={styles.content}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="class_id"
                        />
                        <input
                            className={styles.button}
                            type="submit"
                            value="추가"
                        />
                    </div>
                </div>

                <div className={styles.container}>
                    <div className={styles.title}>
                        <h2>OLAP</h2>
                    </div>
                    <div className={styles.content}>
                        <button
                            className={styles.button}
                            onClick={getClassData}
                        >
                            getClassData
                        </button>
                        <button className={styles.button} onClick={getTakeData}>
                            getTakeData
                        </button>
                        <div className={styles.olap}>
                            <span>OLAP</span>
                        </div>
                    </div>
                </div>

                <div className={styles.container}>
                    <div className={styles.title}>
                        <h2>내 수업 현황</h2>
                    </div>
                    <div className={styles.content}>
                        <p>추가해봥</p>
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
        </div>
    );
};
export default ClassControl;
