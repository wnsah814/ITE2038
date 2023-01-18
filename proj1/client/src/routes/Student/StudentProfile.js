import { useEffect, useState } from "react";
import styles from "./StudentProfile.module.css";
import profileImg from "assets/images/profile.png";
import lionImg from "assets/images/hyu_lion.jpg";
import TimeTable from "components/TimeTable";
import axios from "axios";
import RouteHelper from "components/RouteHelper";

// 학생 > 내정보
const StudentProfile = ({ userObj, setUserObj }) => {
    useEffect(() => {
        const title = "내 정보";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);
    // 학생 정보
    const [userData, setUserData] = useState({});
    useEffect(() => {
        const getStudentData = async () => {
            const res = await axios.post(
                "http://localhost:4000/api/getStudentData",
                {
                    studentId: userObj.id,
                }
            );
            const data = res.data;
            setUserData(data);
            console.log("data", data);
        };
        getStudentData();
    }, [userObj]);

    // 비밀번호 변경
    const changePassword = async () => {
        let presPwd = prompt("현재 비밀번호를 입력해주세요");
        if (presPwd === userData.password) {
            let newPwd = prompt("바꿀 비밀번호를 입력해주세요");
            let newPwdRe = prompt("바꿀 비밀번호를 다시 입력해주세요");
            if (newPwd === newPwdRe) {
                const res = await axios.post(
                    "http://localhost:4000/api/changeStudentPassword",
                    {
                        studentId: userData.student_id,
                        password: newPwd,
                    }
                );
                // const data = res.data;
                // console.log(data);
                alert("비밀번호를 변경하였습니다");
            } else {
                alert("입력한 비밀번호가 같지 않습니다.");
            }
        } else {
            alert("비밀번호가 올바르지 않습니다");
        }
    };
    return (
        <div className={styles.wrapper}>
            {userObj.job === "student" ? (
                <>
                    <div className={styles.background}>
                        <img
                            className={styles.lionImg}
                            src={lionImg}
                            alt="lion"
                        />
                    </div>
                    <div className={styles.profile}>
                        <div className={styles.top}>
                            <div className={styles.row}>
                                <div>
                                    <img
                                        className={styles.profileImg}
                                        src={profileImg}
                                        alt="Not Found"
                                    />
                                </div>
                                <div className={styles.shortProfile}>
                                    <h1>{userData.student_name}</h1>
                                    <h3>
                                        {userData.status === 0
                                            ? "재학생"
                                            : userData.status === 1
                                            ? "휴학생"
                                            : "졸업생"}
                                    </h3>
                                </div>
                                <div className={styles.editProfile}>
                                    <button
                                        onClick={changePassword}
                                        className={styles.editBtn}
                                    >
                                        비밀번호 변경
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.bottom}>
                            <div className={styles.row}>
                                <div className={styles.left}>
                                    <div className={styles.container}>
                                        <div className={styles.cbody}>
                                            <div className={styles.ctitle}>
                                                <h5>정보</h5>
                                            </div>
                                            <p>
                                                <b>이름</b>{" "}
                                                {userData.student_name}
                                            </p>
                                            <p>
                                                <b>학번</b>{" "}
                                                {userData.student_id}
                                            </p>
                                            <p>
                                                <b>성별</b> {userData.sex}
                                            </p>
                                            <p>
                                                <b>전공</b>{" "}
                                                {userData.major_name}
                                            </p>
                                            <p>
                                                <b>학년</b> {userData.year}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.container}>
                                        <div className={styles.cbody}>
                                            <div className={styles.ctitle}>
                                                <h5>지도교수</h5>
                                            </div>
                                            <p>
                                                <b>이름</b>{" "}
                                                {userData.lecturer_name}
                                            </p>
                                            <p>
                                                <b>학번</b>{" "}
                                                {userData.lecturer_id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.container}>
                                        <div className={styles.cbody}>
                                            <div className={styles.ctitle}>
                                                <h5>대충 어떤 정보</h5>
                                            </div>
                                            <p>대충 어떤 내용</p>
                                            <p>대충 어떤 내용</p>
                                            <p>대충 어떤 내용</p>
                                            <p>대충 어떤 내용</p>
                                            <p>대충 어떤 내용</p>
                                        </div>
                                    </div>
                                    <div className={styles.container}>
                                        <div className={styles.cbody}>
                                            <div className={styles.ctitle}>
                                                <h5>대충 어떤 정보</h5>
                                            </div>
                                            <p>대충 어떤 내용</p>
                                            <p>대충 어떤 내용</p>
                                            <p>대충 어떤 내용</p>
                                            <p>대충 어떤 내용</p>
                                            <p>대충 어떤 내용</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.right}>
                                    <div className={styles.container}>
                                        <div className={styles.cbody}>
                                            <div className={styles.ctitle}>
                                                <h5>시간표</h5>
                                            </div>
                                            <div className={styles.timetable}>
                                                <TimeTable userObj={userObj} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <RouteHelper />
            )}
        </div>
    );
};

export default StudentProfile;
