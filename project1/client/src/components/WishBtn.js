import axios from "axios";
import { useEffect, useState } from "react";

const WishBtn = ({ vector, userObj, refreshData }) => {
    const [wished, setWished] = useState(false);
    useEffect(() => {
        const getDidApplied = async () => {
            const res = await axios.post(
                "http://localhost:4000/api/getDidWanted",
                {
                    studentId: userObj.id,
                    classId: vector.class_id,
                }
            );
            const data = res.data;
            console.log(data);
            if (data[0].wanted === 1) {
                // console.log("이미 신청함");
                setWished(true);
            } else {
                // console.log("신청안함");
                setWished(false);
            }
        };
        getDidApplied();
    }, [vector]);
    const addWish = async () => {
        const res = await axios.post("http://localhost:4000/api/addWant", {
            student_id: userObj.id,
            class_id: vector.class_id,
        });
        const data = res.data;
        if (data) {
            console.log(res);
            alert("희망과목에 추가하셨습니다.");
        } else {
            alert("희망과목 추가 실패");
            console.log("no data");
        }
        refreshData();
    };
    const cancelWish = async () => {
        const res = await axios.post("http://localhost:4000/api/cancelWant", {
            student_id: userObj.id,
            class_id: vector.class_id,
        });
        const data = res.data;
        if (data) {
            console.log(res);
            alert("희망을 취소하였습니다.");
        } else {
            alert("희망과목 추가 실패");
            console.log("no data");
        }
        refreshData();
    };
    return (
        <div>
            {wished ? (
                <span onClick={cancelWish}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                        />
                    </svg>
                </span>
            ) : (
                <span onClick={addWish}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                    </svg>
                </span>
            )}
        </div>
    );
};

export default WishBtn;
