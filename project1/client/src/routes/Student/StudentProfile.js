import { useEffect } from "react";
import styles from "./StudentProfile.module.css";
import profileImg from "assets/images/profile.png";
import lionImg from "assets/images/hyu_lion.jpg";
const StudentProfile = ({ setUserObj }) => {
    useEffect(() => {
        const title = "내 정보";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.background}>
                <img className={styles.lionImg} src={lionImg} alt="lion" />
            </div>
            <div className={styles.col}>
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
                            <h1>name</h1>
                            <h3>Student</h3>
                        </div>
                        <div className={styles.editProfile}>
                            <button className={styles.editBtn}>수정하기</button>
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
                                    <p>이름</p>
                                    <p>학번</p>
                                    <p>전공</p>
                                    <p>학년</p>
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
                                        <p>대충 시간표</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
