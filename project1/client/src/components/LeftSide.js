import NavAdmin from "components/Menu/NavAdmin";
import NavCommon from "components/Menu/NavCommon";
import NavStudent from "components/Menu/NavStudent";
// import HYU_simple from "assets/images/HYU_logo_singlecolor.png";
import { Link } from "react-router-dom";
import NavTest from "./Menu/NavTest";
const LeftSide = ({ userObj, setUserObj }) => {
    return (
        <div className="leftSide">
            <div className="logo">
                <Link to={"/"}>
                    {/* <img
                        id="img_hyu_simple"
                        src={HYU_simple}
                        alt="HYU symbol basic"
                    /> */}
                    <span id="logo">HYU</span>
                </Link>
            </div>
            <div className="nav_wrapper">
                <NavCommon />
                {userObj.job === "student" ? <NavStudent /> : null}
                {userObj.job === "admin" ? <NavAdmin /> : null}
                {/* <NavTest /> */}
            </div>
        </div>
    );
};

export default LeftSide;
