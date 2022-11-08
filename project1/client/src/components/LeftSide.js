import NavAdmin from "components/Menu/NavAdmin";
import NavCommon from "components/Menu/NavCommon";
import NavStudent from "components/Menu/NavStudent";
import { Link } from "react-router-dom";
import styles from "./LeftSide.module.css";

// 사이트의 왼쪽 부분(메뉴 부분)
// 로고 부분을 누르면 홈페이지로 이동한다.
// 로그인한 계정의 job을 통해 보여지는 정보를 조정한다
const LeftSide = ({ userObj, setUserObj }) => {
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <Link to={"/"}>
                    <span id={styles.logo}>HYU</span>
                </Link>
            </div>
            <div className={styles.wrapper}>
                <NavCommon />
                {userObj.job === "student" ? <NavStudent /> : null}
                {userObj.job === "admin" || userObj.job === "lecturer" ? (
                    <NavAdmin />
                ) : null}
            </div>
        </div>
    );
};

export default LeftSide;
