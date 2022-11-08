import "components/App.css";
import LeftSide from "components/LeftSide";
import RightSide from "components/RightSide";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

//최상위 컴포넌트
function App() {
    // userObj는 사용자의 정보를 저장하는 객체로 거의 모든 component에 보내진다
    const [userObj, setUserObj] = useState({
        job: "none",
        id: "none",
        name: "none",
        sex: "none",
    });

    // 새로고침을 했을 경우 로그인 정보를 유지하기 위해 sessionStorage를 사용하였다
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
