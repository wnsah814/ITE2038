import { Link } from "react-router-dom";

const NavTest = () => {
    return (
        <div className="nav_container">
            <h4 className="nav_title">Test</h4>
            <ul>
                <li className="nav_item">
                    <Link to="/signin">Sign In</Link>
                </li>
                <li className="nav_item">
                    <Link to="/student/profile">Profile</Link>
                </li>
            </ul>
        </div>
    );
};

export default NavTest;
