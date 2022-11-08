// 한 수업의 시작, 끝 정보들을 가지고 문자열을 만든다.
const showTime = (start1, end1, start2, end2) => {
    let time = "";
    if (start1 === null || start1 === undefined || start1 === "") {
        time = "정보없음";
        return time;
    } else if (start1 === "NO") {
        time = "미지정";
        return time;
    } else {
        // 예외처리에서 걸리지 않는 정상 시간 값
        // showOneTime 함수를 통해 시간을 파싱한다.
        time += showOneTime(start1, end1);
    }
    // 여기까지 왔으면 이미 시간 데이터는 정상이다.
    if (start2) {
        time += "\n";
        time += showOneTime(start2, end2);
    }
    return time;
};

// 한 쌍의 시작, 끝 시간데이터를 파싱한다
const showOneTime = (start, end) => {
    const day_start = new Date(start);
    const day_end = new Date(end);
    // UTC기준이라 9시간을 더해줘야한다.
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
        // 요일 == 6(토) 또는 시작시간 18시 이상 -> E러닝
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
