import AppRouter from "components/Router";
import MiniProfile from "./MiniProfile";
import styles from "./RightSide.module.css";

const RightSide = ({ userObj, setUserObj }) => {
    const showProfile = () => {
        document.querySelector("#profileContainer").style.display = "block";
    };

    const hideProfile = () => {
        document.querySelector("#profileContainer").style.display = "none";
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.headerContainer}>
                <div className={styles.headerItem}>
                    <p>무엇을 넣을까요</p>
                </div>
                <div
                    onMouseEnter={showProfile}
                    onMouseLeave={hideProfile}
                    className={styles.headerItemRightmost}
                >
                    <p>Profile</p>
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
