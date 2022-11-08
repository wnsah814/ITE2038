import { useNavigate } from "react-router-dom";
import styles from "./MiniProfile.module.css";
const MiniProfile = ({ userObj, setUserObj }) => {
    const navigate = useNavigate();
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
                    {/* <p>🔽🔽🔽</p> */}
                    <button className={styles.Btn} onClick={gotoSign}>
                        Sign In
                    </button>
                </div>
            )}
        </div>
    );
};

export default MiniProfile;
