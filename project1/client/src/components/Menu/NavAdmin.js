import { Link } from "react-router-dom";

const NavAdmin = () => {
    return (
        <div className="nav_container">
            <h4 className="nav_title">Admin</h4>
            <ul>
                <li className="nav_item">
                    <Link to="admin/classControl">수업 관리</Link>
                    {/* <ul>
                        <li>하위메뉴 1</li>
                        <li>하위메뉴 2</li>
                    </ul> */}
                </li>
                <li className="nav_item">
                    <Link to="admin/studentControl">학생 관리</Link>
                </li>
                <li className="nav_item">
                    <Link to="admin/profile">내 정보</Link>
                </li>
            </ul>
        </div>
    );
};

export default NavAdmin;
