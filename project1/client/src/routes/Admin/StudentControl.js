import { useEffect } from "react";
import styles from "./StudentControl.module.css";
const StudentControl = () => {
    useEffect(() => {
        const title = "학생 관리";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);
    return (
        <div>
            <p>StudentControl</p>
            <p>휴학처리</p>
            <p>학생 시간표</p>
        </div>
    );
};
export default StudentControl;
