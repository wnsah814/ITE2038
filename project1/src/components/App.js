import "components/App.css";
import LeftSide from "components/LeftSide";
import RightSide from "components/RightSide";
import { BrowserRouter } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";

function App() {
    useEffect(() => {
        axios
            .get("api/test")
            .then((res) => console.log(res))
            .catch();
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
