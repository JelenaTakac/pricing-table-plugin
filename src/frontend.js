import React from "react";
import ReactDOM from "react-dom";
import "./frontend.scss";

const divPricingTable = document.querySelectorAll(".pricing-tables");

divPricingTable.forEach(block => {
    const data = JSON.parse(block.querySelector("pre").innerHTML);
    ReactDOM.render(<PricingTableFrontend {...data} />, block);
    block.classList.remove("pricing-tables");
})

function PricingTableFrontend(props) {
    return (
        <div className="pricing-table-frontend" style={{backgroundColor: props.bgColor, textAlign: props.theAlignment}}>
            <span className={`dashicons dashicons-${props.icon}`}></span>
            <h3>{props.title}</h3>
            <p>{props.description}</p>
            <div className="pricing-table-price">
                {props.hasDiscount && props.discountPrice ? (
                    <>
                        <span className="previous-price">{props.currency}{props.currentPrice}</span>
                        <span className="current-price">{props.currency}{props.discountPrice}</span>
                    </>
                ) : (
                    <span className="current-price">{props.currency}{props.currentPrice}</span>
                )}
            </div>
            <button className="btn">{props.button}</button>
        </div>
    )
}