import NavAdmin from "components/Menu/NavAdmin";
import NavCommon from "components/Menu/NavCommon";
import NavStudent from "components/Menu/NavStudent";
import { Link } from "react-router-dom";
import styles from "./LeftSide.module.css";

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
