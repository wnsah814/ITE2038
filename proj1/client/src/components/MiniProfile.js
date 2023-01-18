import { useNavigate } from "react-router-dom";
import styles from "./MiniProfile.module.css";
const MiniProfile = ({ userObj, setUserObj }) => {
    // 네비게이터
    const navigate = useNavigate();

    // 로그아웃
    const handleLogout = () => {
        console.log("handleLogout");
        window.sessionStorage.clear(); // 세션 삭제
        console.log(window.sessionStorage.getItem("id"));
        setUserObj({
            job: "none",
            id: "none",
            name: "none",
            sex: "none",
        });
        navigate("/");
    };

    // 로그인 페이지 이동
    const gotoSign = () => {
        navigate("/signin");
    };
    return (
        <div className={styles.container}>
            {userObj.job !== "none" ? (
                <div>
                    <p>{userObj.id}</p>
                    <button className={styles.Btn} onClick={handleLogout}>
                        Sign Out
                    </button>
                </div>
            ) : (
                <div>
                    <button className={styles.Btn} onClick={gotoSign}>
                        Sign In
                    </button>
                </div>
            )}
        </div>
    );
};

export default MiniProfile;
