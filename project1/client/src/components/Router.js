import { BrowserRouter, Routes, Route } from "react-router-dom";
import Announce from "routes/Announce";
import Enrollment from "routes/Enrollment";
import Handbook from "routes/Handbook";
import NotFound from "routes/special/NotFound";
import NavCommon from "./Menu/NavCommon";

const AppRouter = () => {
    return (
        <div>
            {/* <NavCommon /> */}
            {/* <BrowserRouter> */}
            <Routes>
                <Route path="/" element={<Announce />}></Route>
                <Route path="/announce" element={<Announce />}></Route>
                <Route path="/handbook" element={<Handbook />}></Route>
                <Route path="/enroll" element={<Enrollment />}></Route>

                <Route path="*" element={<NotFound />}></Route>
            </Routes>
            {/* </BrowserRouter> */}
        </div>
    );
};

export default AppRouter;
