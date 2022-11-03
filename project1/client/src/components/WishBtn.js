import axios from "axios";

const WishBtn = ({ vector, userObj }) => {
    const addWish = () => {
        console.log(vector);
        console.log(userObj);
        axios
            .post("http://localhost:4000/api/addwant", {
                student_id: userObj.id,
                class_id: vector.class_id,
            })
            .then((res) => {
                if (res.data[0]) {
                    console.log(res);
                } else {
                    console.log("no data");
                }
            });
    };
    return (
        <div>
            <span onClick={addWish}>희망</span>
        </div>
    );
};

export default WishBtn;
