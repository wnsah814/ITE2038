import "components/App.css";
import LeftSide from "components/LeftSide";
import RightSide from "components/RightSide";
import { BrowserRouter } from "react-router-dom";

import { useEffect } from "react";
import axios from "axios";

function App() {
    const callApi = async () => {
        axios.get("/api/student").then((res) => console.log(res.data));
    };
    useEffect(() => {
        callApi();
    }, []);
    return (
        <div className="wrapper">
            <BrowserRouter>
                <LeftSide />
                <RightSide />
            </BrowserRouter>
        </div>
    );
}

export default App;
