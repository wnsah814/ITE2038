import styles from "./TimeEData.module.css";
// E러닝 수업 단위
const TimeEData = ({ index, classObj }) => {
    console.log(classObj);
    return (
        <div className={styles.container}>
            <span className={styles.name}>{classObj[index].class_name}</span>
            <span className={styles.lec}>{classObj[index].lecturer_name}</span>
        </div>
    );
};
export default TimeEData;
