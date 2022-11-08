import styles from "./TimeData.module.css";
const TimeData = ({ index, flexAmount, classObj }) => {
    // console.log(classObj);
    return (
        <div className={`timeTd flex${flexAmount}`}>
            {index === -1 ? (
                <div>{classObj[index]?.class_name}</div>
            ) : (
                <div className={`color color${index}`}>
                    <span className={styles.title}>
                        {classObj[index]?.class_name}
                    </span>
                    <span>{classObj[index]?.lecturer_name}</span>
                    <span>
                        {classObj[index]?.building_name}{" "}
                        {classObj[index]?.room_no}
                    </span>
                </div>
            )}
        </div>
    );
};
export default TimeData;
