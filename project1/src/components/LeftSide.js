import NavAdmin from "components/Menu/NavAdmin";
import NavCommon from "components/Menu/NavCommon";
import NavStudent from "components/Menu/NavStudent";
import HYU_simple from "assets/images/HYU_logo_singlecolor.png";
import { Link } from "react-router-dom";
const LeftSide = ({ isSignedIn, isAdmin }) => {
    return (
        <div className="leftSide">
            <div className="logo">
                <Link to={"/"}>
                    <img
                        id="img_hyu_simple"
                        src={HYU_simple}
                        alt="HYU symbol basic"
                    />
                </Link>
            </div>
            <NavCommon />
            {isSignedIn ? <NavStudent /> : null}
            {isAdmin ? <NavAdmin /> : null}
        </div>
    );
};

export default LeftSide;
