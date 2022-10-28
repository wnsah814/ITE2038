import AppRouter from "components/Router";

const RightSide = () => {
    return (
        <div className="rightSide">
            <header>
                <div className="header_top">
                    <div className="header_item language">
                        <p>lang</p>
                    </div>
                    <div className="header_item_right profile">
                        <p>Profile</p>
                    </div>
                </div>
            </header>

            <div className="container">
                <div className="maincontent">
                    <div className="title">
                        <p>title</p>
                    </div>
                    <div className="content">
                        <AppRouter />

                        <p>content</p>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Impedit, vero recusandae expedita modi
                            dignissimos eius at repudiandae voluptatum veniam
                            suscipit voluptate quisquam praesentium magni esse
                            atque, numquam maiores debitis quo!Lorem ipsum dolor
                            sit, amet consectetur adipisicing elit. Impedit,
                            vero recusandae expedita modi dignissimos eius at
                            repudiandae voluptatum veniam suscipit voluptate
                            quisquam praesentium magni esse atque, numquam
                            maiores debitis quo! lorem
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSide;
