import axios from "axios";
import { useEffect, useState } from "react";

// 수강신청 버튼
const ApplyBtn = ({ vector, userObj, refreshData }) => {
    // 내가 수강 신청한 목록
    const [applied, setApplied] = useState(false);
    // 이미 수강신청 했는지 알아보기
    useEffect(() => {
        const getDidApplied = async () => {
            const res = await axios.post(
                "http://localhost:4000/api/getDidApplied",
                {
                    studentId: userObj.id,
                    classId: vector.class_id,
                }
            );
            const data = res.data;
            console.log(data);
            if (data[0].applied === 1) {
                setApplied(true); // 이미 신청한 경우
            } else {
                setApplied(false); // 신청하지 않은 경우
            }
        };
        getDidApplied();
    }, [vector]);

    // 수강신청 함수
    const apply = async () => {
        // 재학생 (휴학생, 졸업생 신창 불가) - 구현x

        // 재수강이 불가능 한 지 검사한다 (B0 이상일 경우 불가능)
        const applyCheck1 = await axios.post(
            "http://localhost:4000/api/appC1",
            {
                studentId: userObj.id,
                courseId: vector.course_id,
            }
        );
        const check1 = applyCheck1.data;
        if (check1.status === "no") {
            alert("재수강 불가능 학점");
            return;
        }

        // 18학점 이상 신청하는 지
        const applyCheck3 = await axios.post(
            "http://localhost:4000/api/appC3",
            {
                studentId: userObj.id,
                credit: vector.credit,
            }
        );
        const check3 = applyCheck3.data;
        if (check3.status === "no") {
            alert("최대 신청 가능학점을 초과하였습니다.");
            return;
        }

        // 시간이 겹치는 지
        const applyCheck4 = await axios.post(
            "http://localhost:4000/api/appC4",
            {
                studentId: userObj.id,
                begin1: vector.begin1,
                end1: vector.end1,
                begin2: vector.begin2,
                end2: vector.end2,
            }
        );
        const check4 = applyCheck4.data;
        if (check4.status === "no") {
            alert("수업시간이 겹칩니다");
            return;
        }

        // 정원이 다 찼는 지 확인한다
        const applyCheck2 = await axios.post(
            "http://localhost:4000/api/appC2",
            {
                classId: vector.class_id,
            }
        );
        const check2 = applyCheck2.data;
        if (check2.status === "no") {
            alert("정원이 다 찼습니다");
            return;
        }

        // 모든 조건을 통과했다면 수강신청을 진행한다.
        const res = await axios.post("http://localhost:4000/api/apply", {
            student_id: userObj.id,
            class_id: vector.class_id,
        });
        const data = res.data;
        if (data) {
            alert("수강신청되었습니다");
            console.log(data);
        } else {
            alert("수강실패");
            console.log("no data");
        }
        refreshData();
    };

    // 수강취소 함수
    const cancelApply = async () => {
        const res = await axios.post("http://localhost:4000/api/cancelApply", {
            student_id: userObj.id,
            class_id: vector.class_id,
        });
        const data = res.data;
        if (data) {
            alert("수강취소");
        } else {
            alert("수강취소 실패");
        }
        refreshData();
    };

    return (
        <div>
            {applied ? (
                <span onClick={cancelApply}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>
                </span>
            ) : (
                <span onClick={apply}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                        />
                    </svg>
                </span>
            )}
        </div>
    );
};
export default ApplyBtn;
