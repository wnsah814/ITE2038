import { Link } from "react-router-dom";

// 모든 사용자에게 보여지는 부분
const NavCommon = () => {
    return (
        <div className="nav_container">
            <h4 className="nav_title">Common</h4>
            <ul>
                <li className="nav_item">
                    <Link to="/">공지사항</Link>
                </li>
                <li className="nav_item">
                    <Link to="/handbook">수강편람</Link>
                </li>
            </ul>
        </div>
    );
};

export default NavCommon;
