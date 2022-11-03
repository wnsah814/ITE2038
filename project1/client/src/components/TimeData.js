import styles from "./TimeData.module.css";
const TimeData = ({ index, flexAmount, classObj }) => {
    // console.log(classObj);
    return (
        <div className={`flex${flexAmount}`}>
            {index === -1 ? (
                <div>{classObj[index]?.class_name}</div>
            ) : (
                <div className={styles.color}>
                    {classObj[index]?.class_name}
                </div>
            )}
        </div>
    );
};
export default TimeData;
