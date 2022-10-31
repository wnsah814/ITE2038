import AppRouter from "components/Router";
import MiniProfile from "./MiniProfile";

const RightSide = ({ userObj, setUserObj }) => {
    const showProfile = () => {
        document.querySelector("#profileContainer").style.display = "block";
    };

    const hideProfile = () => {
        document.querySelector("#profileContainer").style.display = "none";
    };
    return (
        <div className="rightSide">
            <header className="header_container">
                <div className="header_item language">
                    <p>무엇을 넣을까요</p>
                </div>
                <div
                    onMouseEnter={showProfile}
                    onMouseLeave={hideProfile}
                    className="header_item_right profile"
                >
                    <p>Profile</p>
                    <div style={{ display: "none" }} id="profileContainer">
                        <MiniProfile
                            userObj={userObj}
                            setUserObj={setUserObj}
                        />
                    </div>
                </div>
            </header>

            <div className="container">
                <div className="maincontent">
                    <div className="title">
                        <h4 id="maintitle">title</h4>
                    </div>
                    <div className="content">
                        <AppRouter userObj={userObj} setUserObj={setUserObj} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSide;
