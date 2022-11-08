import styles from "./AdminProfile.module.css";
import { useEffect, useState } from "react";
import profileImg from "assets/images/profile.png";
import lionImg from "assets/images/hyu_lion.jpg";
import TimeTable from "components/TimeTable";
import axios from "axios";
import MyClass from "components/Control/MyClass";
import RouteHelper from "components/RouteHelper";
const AdminProfile = ({ userObj, setUserObj }) => {
    useEffect(() => {
        const title = "내 정보";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);
    const [staffData, setStaffData] = useState({});
    useEffect(() => {
        const getStaffData = async () => {
            const res = await axios.post(
                "http://localhost:4000/api/getStaffData",
                {
                    staffId: userObj.id,
                }
            );
            const data = res.data;
            setStaffData(data);
            console.log("data", data);
        };
        getStaffData();
    }, [userObj]);

    const changePassword = async () => {
        let presPwd = prompt("현재 비밀번호를 입력해주세요");
        if (presPwd === staffData.password) {
            let newPwd = prompt("바꿀 비밀번호를 입력해주세요");
            let newPwdRe = prompt("바꿀 비밀번호를 다시 입력해주세요");
            if (newPwd === newPwdRe) {
                const res = await axios.post(
                    "http://localhost:4000/api/changeStaffPassword",
                    {
                        staffId: staffData.staff_id,
                        password: newPwd,
                    }
                );
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
            {userObj.job === "admin" || userObj.job === "lecturer" ? (
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
                                    <h1>{staffData.staff_name}</h1>
                                    <h3>
                                        {userObj.job === "admin"
                                            ? "관리자"
                                            : "교수"}
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
                                                {staffData.staff_name}
                                            </p>
                                            <p>
                                                <b>학번</b> {staffData.staff_id}
                                            </p>
                                            <p>
                                                <b>성별</b> {staffData.sex}
                                            </p>
                                            <p>
                                                <b>전공</b>{" "}
                                                {staffData.major_name}
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
                                                {staffData.lecturer_name}
                                            </p>
                                            <p>
                                                <b>학번</b>{" "}
                                                {staffData.lecturer_id}
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
                                            {userObj.job === "lecturer" ? (
                                                <>
                                                    <div
                                                        className={
                                                            styles.ctitle
                                                        }
                                                    >
                                                        <h5>내 수업 관리</h5>
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.timetable
                                                        }
                                                    >
                                                        <MyClass
                                                            userObj={userObj}
                                                        />
                                                    </div>
                                                </>
                                            ) : null}
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

export default AdminProfile;
