import { useNavigate } from "react-router-dom";
import styles from "./RouteHelper.module.css";
const RouteHelper = () => {
    const nav = useNavigate();
    const gotoLogin = () => {
        nav("/signin");
    };
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>로그인 후 사용해주세요</h1>
            </div>
            <div>
                <button className={styles.button} onClick={gotoLogin}>
                    로그인 하러 가기
                </button>
            </div>
        </div>
    );
};
export default RouteHelper;
