import NavAdmin from "components/Menu/NavAdmin";
import NavCommon from "components/Menu/NavCommon";
import NavStudent from "components/Menu/NavStudent";
import { Link } from "react-router-dom";
const LeftSide = ({ userObj, setUserObj }) => {
    return (
        <div className="leftSide">
            <div className="logo">
                <Link to={"/"}>
                    <span id="logo">HYU</span>
                </Link>
            </div>
            <div className="nav_wrapper">
                <NavCommon />
                {userObj.job === "student" ? <NavStudent /> : null}
                {true || userObj.job === "admin" ? <NavAdmin /> : null}
            </div>
        </div>
    );
};

export default LeftSide;
