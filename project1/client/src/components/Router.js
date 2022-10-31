import { Routes, Route } from "react-router-dom";
import Announce from "routes/Common/Announce";
import Enrollment from "routes/Student/Enrollment";
import Handbook from "routes/Common/Handbook";
import NotFound from "routes/special/NotFound";
import SignIn from "routes/Authentication/SignIn";
import StudentProfile from "routes/Student/StudentProfile";
import Basket from "routes/Student/Basket";

const AppRouter = ({ userObj, setUserObj }) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Announce />}></Route>
                <Route
                    path="/signin"
                    element={<SignIn setUserObj={setUserObj} />}
                ></Route>
                <Route path="/announce" element={<Announce />}></Route>
                <Route path="/handbook" element={<Handbook />}></Route>
                {/* Student */}
                <Route
                    path="/student/enrollment"
                    element={<Enrollment />}
                ></Route>
                <Route
                    path="/student/profile"
                    element={<StudentProfile setUserObj={setUserObj} />}
                ></Route>

                <Route
                    path="/student/basket"
                    element={<Basket setUserObj={setUserObj} />}
                ></Route>

                {/* Admin */}
                {/* Special */}
                <Route path="*" element={<NotFound />}></Route>
            </Routes>
        </>
    );
};

export default AppRouter;
