import { Routes, Route } from "react-router-dom";
import Announce from "routes/Common/Announce";
import Enrollment from "routes/Student/Enrollment";
import Handbook from "routes/Common/Handbook";
import NotFound from "routes/special/NotFound";
import SignIn from "routes/Authentication/SignIn";
import StudentProfile from "routes/Student/StudentProfile";
import Basket from "routes/Student/Basket";
import Applied from "routes/Student/Applied";
import AdminProfile from "routes/Admin/AdminProfile";
import ClassControl from "routes/Admin/ClassControl";
import StudentControl from "routes/Admin/StudentControl";

// 라우터, 주소를 비교해 적절한 사이트로 이동시킨다.
const AppRouter = ({ userObj, setUserObj }) => {
    return (
        <>
            <Routes>
                {/* Common */}
                <Route path="/" element={<Announce />}></Route>
                <Route path="/announce" element={<Announce />}></Route>
                <Route
                    path="/signin"
                    element={<SignIn setUserObj={setUserObj} />}
                ></Route>
                <Route
                    path="/handbook"
                    element={<Handbook userObj={userObj} />}
                ></Route>

                {/* Student */}
                <Route
                    path="/student/enrollment"
                    element={<Enrollment userObj={userObj} />}
                ></Route>

                <Route
                    path="/student/basket"
                    element={
                        <Basket userObj={userObj} setUserObj={setUserObj} />
                    }
                ></Route>
                <Route
                    path="/student/applied"
                    element={
                        <Applied userObj={userObj} setUserObj={setUserObj} />
                    }
                ></Route>
                <Route
                    path="/student/profile"
                    element={
                        <StudentProfile
                            userObj={userObj}
                            setUserObj={setUserObj}
                        />
                    }
                ></Route>

                {/* Admin */}
                <Route
                    path="/admin/classControl"
                    element={
                        <ClassControl
                            userObj={userObj}
                            setUserObj={setUserObj}
                        />
                    }
                ></Route>
                <Route
                    path="/admin/studentControl"
                    element={
                        <StudentControl
                            userObj={userObj}
                            setUserObj={setUserObj}
                        />
                    }
                ></Route>
                <Route
                    path="/admin/profile"
                    element={
                        <AdminProfile
                            userObj={userObj}
                            setUserObj={setUserObj}
                        />
                    }
                ></Route>

                {/* Special */}
                <Route path="*" element={<NotFound />}></Route>
            </Routes>
        </>
    );
};

export default AppRouter;
