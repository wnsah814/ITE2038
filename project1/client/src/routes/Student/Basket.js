import { useEffect } from "react";

const Basket = ({ setUserObj }) => {
    useEffect(() => {
        const title = "장바구니";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);
    return (
        <div>
            <h3>Basket</h3>
        </div>
    );
};

export default Basket;
