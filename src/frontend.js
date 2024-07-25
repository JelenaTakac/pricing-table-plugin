import React from "react";
import ReactDOM from "react-dom";
import "./frontend.scss";

const divPricingTable = document.querySelectorAll(".pricing-tables");

divPricingTable.forEach(block => {
    const data = JSON.parse(block.querySelector("pre").innerHTML);
    ReactDOM.render(<PricingTableFrontend {...data} />, block);
    block.classList.remove("pricing-tables");
});

function PricingTableFrontend(props) {
    return (
        <div className="pricing-table-frontend" style={{textAlign: props.theAlignment}}>
            <h3>{props.blockTitle}</h3>
            <div className="cards-container">
                {props.cards.map((card, index) => (
                    <div key={index} className="card" style={{backgroundColor: card.bgColor}}>
                        <span className={`dashicons dashicons-${card.icon}`}></span>
                        <h4>{card.title}</h4>
                        <p>{card.description}</p>
                        <ul className="card-features">
                            {card.features.map((feature, featureIndex) => (
                                <li key={featureIndex}>{feature}</li>
                            ))}
                        </ul>
                        <div className="pricing-table-price">
                            {card.hasDiscount && card.discountPrice ? (
                                <>
                                    <span className="previous-price">{card.currency}{card.currentPrice}</span>
                                    <span className="current-price">{card.currency}{card.discountPrice}</span>
                                </>
                            ) : (
                                <span className="current-price">{card.currency}{card.currentPrice}</span>
                            )}
                        </div>
                        <button className="btn">{card.button}</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
