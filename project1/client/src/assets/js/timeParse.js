const showTime = (start1, end1, start2, end2) => {
    let time = "";
    if (start1 === null || start1 === undefined || start1 === "") {
        time = "정보없음";
        return time;
    } else if (start1 === "NO") {
        time = "미지정";
        return time;
    } else {
        time += showOneTime(start1, end1);
    }
    if (start2) {
        time += "\n";
        time += showOneTime(start2, end2);
    }
    return time;
};

const showOneTime = (start, end) => {
    const day_start = new Date(start);
    const day_end = new Date(end);
    day_start.setTime(day_start.getTime() + 9 * 60 * 60 * 1000);
    day_end.setTime(day_end.getTime() + 9 * 60 * 60 * 1000);
    const weeks = [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
    ];
    if (day_start.getUTCDay() === 6 || day_start.getUTCHours() >= 18) {
        return "E-러닝";
    }
    const timeStr = `${weeks[day_start.getUTCDay()]} ${day_start
        .getUTCHours()
        .toString()
        .padStart(2, "0")}:${day_start
        .getUTCMinutes()
        .toString()
        .padStart(2, "0")} - ${day_end
        .getUTCHours()
        .toString()
        .padStart(2, "0")}:${day_end
        .getUTCMinutes()
        .toString()
        .padStart(2, "0")}`;
    return timeStr;
};
export default showTime;
