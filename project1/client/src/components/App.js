import "components/App.css";
import LeftSide from "components/LeftSide";
import RightSide from "components/RightSide";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

function App() {
    const [userObj, setUserObj] = useState({
        job: "none",
        id: "none",
        name: "none",
        sex: "none",
    });

    useEffect(() => {
        if (window.sessionStorage.getItem("id")) {
            console.log("로그인 정보를 불러왔습니다.");
            setUserObj({
                job: window.sessionStorage.getItem("job"),
                id: window.sessionStorage.getItem("id"),
                name: window.sessionStorage.getItem("name"),
                sex: window.sessionStorage.getItem("sex"),
            });
        }
    }, []);
    return (
        <div className="wrapper">
            <BrowserRouter>
                <LeftSide userObj={userObj} />
                <RightSide userObj={userObj} setUserObj={setUserObj} />
            </BrowserRouter>
        </div>
    );
}

export default App;
