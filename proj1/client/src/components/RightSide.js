import AppRouter from "components/Router";
import MiniProfile from "./MiniProfile";
import styles from "./RightSide.module.css";

// 사이트의 오른쪽 부분
const RightSide = ({ userObj, setUserObj }) => {
    // 오른쪽 위 부분에 마우스를 올려두는 경우 미니 프로필을 보이게 한다
    const showProfile = () => {
        document.querySelector("#profileContainer").style.display = "block";
    };
    // 마우스가 영역을 벗어나면 감춘다
    const hideProfile = () => {
        document.querySelector("#profileContainer").style.display = "none";
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.headerContainer}>
                <div className={styles.headerItem}>
                    <p>2022년 서울캠퍼스 수강신청</p>
                </div>
                <div
                    onMouseEnter={showProfile}
                    onMouseLeave={hideProfile}
                    className={styles.headerItemRightmost}
                >
                    <p>{userObj.name === "none" ? "SIGN IN" : userObj.name}</p>
                    <div style={{ display: "none" }} id="profileContainer">
                        <MiniProfile
                            userObj={userObj}
                            setUserObj={setUserObj}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.titleContainer}>
                <h4 id="maintitle">title</h4>
            </div>
            <div className={styles.contentContainer}>
                <AppRouter userObj={userObj} setUserObj={setUserObj} />
            </div>
        </div>
    );
};

export default RightSide;
