import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";

// 로그인 화면
const SignIn = ({ setUserObj }) => {
    useEffect(() => {
        const title = "로그인";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);

    // REF
    const idRef = useRef();
    const pwdRef = useRef();

    // 관리자 로그인
    const [checked, toggleCheck] = useState(false);
    const toggleChk = () => {
        toggleCheck((prev) => !prev);
    };

    const navigate = useNavigate();

    // 로그인 함수
    const handleSignIn = async (e) => {
        e.preventDefault();
        const uid = idRef.current.value;
        const upw = pwdRef.current.value;
        // 예외처리
        if (uid === "" || uid === undefined) {
            alert("Pleast enter your ID");
            idRef.current.focus();
            return false;
        }
        if (upw === "" || upw === undefined) {
            alert("Please enter your password");
            pwdRef.current.focus();
            return false;
        }
        // 로그인 하기
        const res = await axios.post("http://localhost:4000/api/login", {
            userId: uid,
            userPassword: upw,
            isAdmin: checked,
        });
        const data = res.data;
        if (data.job !== "none") {
            // 로그인 성공
            window.sessionStorage.setItem("job", res.data.job);
            window.sessionStorage.setItem("id", idRef.current.value);
            window.sessionStorage.setItem("name", res.data.name);
            window.sessionStorage.setItem("sex", res.data.sex);
            setUserObj(res.data);
            navigate("/");
        } else {
            // 로그인 실패
            alert("Wrong ID or password");
            navigate("/signin");
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.body}>
                    <div className={styles.title}>
                        <h2>한양대학교 로그인</h2>
                    </div>
                    <div>
                        <form className={styles.form} action="" method="post">
                            <div className={styles.input}>
                                <label
                                    htmlFor="userId"
                                    className={styles.label}
                                >
                                    User ID
                                </label>
                                <input
                                    ref={idRef}
                                    name="userId"
                                    type="text"
                                    id="userId"
                                    className={styles.control}
                                    placeholder="Enter Id"
                                />
                            </div>
                            <div className={styles.input}>
                                <label
                                    htmlFor="userPws"
                                    className={styles.label}
                                >
                                    User Password
                                </label>
                                <input
                                    ref={pwdRef}
                                    name="userPassword"
                                    type="password"
                                    id="userPwd"
                                    className={styles.control}
                                    placeholder="Enter Password"
                                />
                            </div>
                            <div className={styles.input}>
                                <div className={styles.checkContainer}>
                                    <input
                                        className={styles.checkbox}
                                        type="checkbox"
                                        name="admin"
                                        onChange={toggleChk}
                                        checked={checked}
                                    />
                                    <label
                                        className={styles.checkLabel}
                                        htmlFor="admin"
                                    >
                                        관리자
                                    </label>
                                </div>
                            </div>
                            <div className={styles.submitInput}>
                                <input
                                    type="submit"
                                    className={[
                                        styles.control,
                                        styles.submit,
                                    ].join(" ")}
                                    value={"SignIn"}
                                    onClick={handleSignIn}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SignIn;
