import axios from "axios";

const ApplyBtn = ({ vector, userObj }) => {
    const apply = () => {
        console.log(vector);

        axios
            .post("http://localhost:4000/api/apply", {
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
            <span onClick={apply}>신청</span>
        </div>
    );
};
export default ApplyBtn;
