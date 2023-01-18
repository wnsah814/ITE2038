import StudentGrade from "components/Control/StudentGrade";
import StudentStatus from "components/Control/StudentStatus";
import RouteHelper from "components/RouteHelper";
import TimeTable from "components/TimeTable";
import { useEffect, useRef, useState } from "react";
import styles from "./StudentControl.module.css";

// 관리자 > 학생관리
const StudentControl = ({ userObj }) => {
    useEffect(() => {
        const title = "학생 관리";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);

    // 엔터 했을 때 실행하게 해줌
    const onEnter = (e) => {
        if (e.key === "Enter") {
            getStudent();
        }
    };

    // 새로고침
    const refresh = () => {
        setStuId((prev) => statSidRef.current.value);
    };

    // 학생 정보 가져오기
    const statSidRef = useRef();
    const [stuId, setStuId] = useState("");
    const getStudent = () => {
        setStuId(statSidRef.current?.value);
    };

    // TODO
    // 1) 금학기 시간표 조회학생
    // 2) 성적 조회,
    // 3) 지도교수 조회,
    // 4) 재학/휴학/자퇴 등 상태 변경

    return (
        <div className={styles.wrapper}>
            {userObj.job === "admin" || userObj.job === "lecturer" ? (
                <div className={styles.contents}>
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <div>
                                <span>학번: </span>
                                <input
                                    ref={statSidRef}
                                    className={styles.input}
                                    type="number"
                                    placeholder="student_id"
                                    onKeyDown={onEnter}
                                />
                                <input
                                    onClick={getStudent}
                                    className={styles.button}
                                    type="submit"
                                    value={"조회하기"}
                                />
                                <button
                                    onClick={refresh}
                                    className={styles.button}
                                >
                                    새로고침
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.title}>
                            <h2>학생 정보 조회 및 변경</h2>
                        </div>
                        <div className={styles.content}>
                            {stuId === "" ? (
                                "학번을 입력해주세요"
                            ) : (
                                <StudentStatus studentId={stuId} />
                            )}
                        </div>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.title}>
                            <h2>금학기 시간표</h2>
                        </div>
                        <div className={styles.content}>
                            <div>
                                {stuId === "" ? (
                                    "학번을 입력해주세요"
                                ) : (
                                    <TimeTable studentId={stuId} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.title}>
                            <h2>성적 조회</h2>
                        </div>
                        <div className={styles.content}>
                            <div>
                                {stuId === "" ? (
                                    "학번을 입력해주세요"
                                ) : (
                                    <StudentGrade studentId={stuId} />
                                )}
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
export default StudentControl;
