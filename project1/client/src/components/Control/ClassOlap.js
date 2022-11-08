import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./ClassOlap.module.css";
const ClassOlap = () => {
    const [stat, setStat] = useState([]);

    useEffect(() => {
        const getStat = async () => {
            const res = await axios.post("http://localhost:4000/api/getOLAP");
            const data = res.data;

            console.log(data);
            setStat(data);
        };
        getStat();
    }, []);
    return (
        <div className={styles.table}>
            <div className={styles.thead}>
                <div className={styles.tr}>
                    {["학수번호", "교과목명", "수강생수", "통계"].map(
                        (v, i) => (
                            <div key={i} className={styles.th}>
                                {v}
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className={styles.tbody}>
                {stat.map((v, i) => (
                    <div key={i} className={styles.tr}>
                        <div className={styles.td}>{v.course_id}</div>
                        <div className={styles.td}>{v.course_name}</div>
                        <div className={styles.td}>{v.count}</div>
                        <div className={styles.td}>{v.diff}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ClassOlap;
