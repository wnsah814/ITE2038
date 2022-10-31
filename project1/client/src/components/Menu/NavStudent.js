import { Link } from "react-router-dom";

const NavStudent = () => {
    return (
        <div className="nav_container">
            <h4 className="nav_title">Student</h4>
            <ul>
                <li className="nav_item">
                    <Link to="/student/enrollment">수강신청</Link>
                </li>
                <li className="nav_item">
                    <Link to="/student/basket">장바구니</Link>
                </li>
                <li className="nav_item">
                    <Link to="student/profile">내 정보</Link>
                </li>
            </ul>
        </div>
    );
};

export default NavStudent;
