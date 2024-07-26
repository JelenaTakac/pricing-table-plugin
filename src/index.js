import "./index.scss";
import { InspectorControls, RichText, BlockControls, AlignmentToolbar } from "@wordpress/block-editor";
import { Button, PanelBody, PanelRow, SelectControl, TextControl, ToggleControl } from "@wordpress/components";
import { ChromePicker } from "react-color";
import { useState, useEffect } from "@wordpress/element";

wp.blocks.registerBlockType('my-plugin/pricing-table', {
    title: 'Pricing Table',
    icon: 'table-col-after',
    category: 'common',
    attributes: {
        blockTitle: { type: "string", default: "Your Pricing Table Title" },
        cards: {
            type: "array",
            default: [
                {
                    icon: "smiley",
                    title: "",
                    description: "",
                    currentPrice: "39.99",
                    currency: "",
                    paymentPeriod: "",
                    hasDiscount: false,
                    discountPrice: "",
                    button: "",
                    bgColor: "#ebebeb", 
                    features: ["Feature 1"]
                },
            ],
        },
        theAlignment: { type: "string", default: "" },
        recommendCard: { type: "boolean", default: false },
        recommendedCardIndex: { type: "number", default: null }
    },
    description: "Create your best pricing table.",
    edit: EditComponent,
    save: function (props) {
        return null;
    }
});

function EditComponent(props) {
    const { attributes, setAttributes } = props;
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [recommendedCardIndex, setRecommendedCardIndex] = useState(null);

    const handleCardChange = (newCard, index) => {
        const updatedCards = [...attributes.cards];
        updatedCards[index] = newCard;
        setAttributes({ cards: updatedCards });
    };

    const addNewCard = () => {
        const newCard = {
            icon: "smiley",
            title: "",
            description: "",
            currentPrice: "39.99",
            currency: "",
            paymentPeriod: "",
            hasDiscount: false,
            discountPrice: "",
            button: "",
            bgColor: "#ebebeb",
            features: ["Feature 1"],
        };

        setAttributes({ cards: [...attributes.cards, newCard] });
        setSelectedCardIndex(attributes.cards.length); // Selected the newly added card
    };

    const removeCard = (index) => {
        const updatedCards = attributes.cards.filter((card, cardIndex) => cardIndex !== index);
        setAttributes({ cards: updatedCards });
        setSelectedCardIndex(null); // Deselected card if it was removed
    };
    
    const addFeature = (index) => {
        const updatedCards = [...attributes.cards];
        updatedCards[index].features.push(""); // Add an empty feature string
        setAttributes({ cards: updatedCards });
    };

    const removeFeature = (cardIndex, featureIndex) => {
        const updatedCards = [...attributes.cards];
        updatedCards[cardIndex].features = updatedCards[cardIndex].features.filter((_, i) => i !== featureIndex);
        setAttributes({ cards: updatedCards });
    };

    const handleFeatureChange = (cardIndex, featureIndex, newFeature) => {
        const updatedCards = [...attributes.cards];
        updatedCards[cardIndex].features[featureIndex] = newFeature;
        setAttributes({ cards: updatedCards });
    };

    const recommendPriceCard = (pricingCards) => {
        if (!attributes.recommendCard) return null;

        // Define weights for each criterion
        const weights = { price: 0.5, features: 0.3, paymentPeriod: 0.2 };

        let maxScoreIndex = null;
        let maxScore = 0;

        // Calculate score for each card
        pricingCards.forEach((card, index) => {
            let score = 0;
            // score += (parseFloat(card.discountPrice || card.currentPrice) / parseFloat(card.currentPrice)) * weights.price;
            score += Math.abs(parseFloat(card.currentPrice) - parseFloat(card.discountPrice || card.currentPrice)) * weights.price;
            score += card.features.length * weights.features;
            score += parseInt(card.paymentPeriod, 10) * weights.paymentPeriod;
            console.log(score);

            // Update maxScoreIndex if current card's score is higher than maxScore found so far
            if (score > maxScore) {
                maxScore = score;
                maxScoreIndex = index;
            }
        });

        // Return the index of the card with the highest score, or null if no cards
        return maxScoreIndex !== null ? maxScoreIndex : null;
    }

    const handleRecommendToggle = () => {
        setAttributes({ recommendCard: !attributes.recommendCard });
    };

    useEffect(() => {
        if (attributes.recommendCard) {
            const newIndex = recommendPriceCard(attributes.cards);
            setAttributes({ recommendedCardIndex: newIndex });
            setRecommendedCardIndex(newIndex);
        } else {
            setAttributes({ recommendedCardIndex: null });
            setRecommendedCardIndex(null);
        }
    }, [attributes.cards, attributes.recommendCard]); 

    return (
        <div className="pricing-table-edit-block">
            <BlockControls>
                <AlignmentToolbar
                    value={attributes.theAlignment}
                    onChange={(newAlignment) => setAttributes({ theAlignment: newAlignment })}
                />
            </BlockControls>
            <InspectorControls>
                <PanelBody title="Block Title">
                    <TextControl
                        label="Title"
                        value={attributes.blockTitle}
                        onChange={(newTitle) => setAttributes({ blockTitle: newTitle })}
                    />
                </PanelBody>

                <PanelBody title="Recommended Card" initialOpen={false}>
                    <ToggleControl
                        label="Recommended Card"
                        checked={attributes.recommendCard}
                        onChange={handleRecommendToggle}
                    />
                </PanelBody>

                {selectedCardIndex !== null && attributes.cards[selectedCardIndex] && (
                    <PanelBody title={`Card ${selectedCardIndex + 1}`} initialOpen={true}>
                        <Button variant="primary" onClick={() => removeCard(selectedCardIndex)}>
                            Remove Card
                        </Button>

                        <SelectControl
                            label="Icon"
                            value={attributes.cards[selectedCardIndex].icon}
                            options={[
                                { label: "Smiley", value: "smiley" },
                                { label: "Heart", value: "heart" },
                                { label: "Lightbulb", value: "lightbulb" },
                                { label: "Visibility", value: "visibility" },
                                { label: "Calendar", value: "calendar" },
                            ]}
                            onChange={(newIcon) => handleCardChange({ ...attributes.cards[selectedCardIndex], icon: newIcon }, selectedCardIndex)}
                        />

                        <TextControl
                            label="Card Title"
                            value={attributes.cards[selectedCardIndex].title}
                            onChange={(newTitle) => handleCardChange({ ...attributes.cards[selectedCardIndex], title: newTitle }, selectedCardIndex)}
                        />
                        <TextControl
                            label="Card Description"
                            value={attributes.cards[selectedCardIndex].description}
                            onChange={(newDescription) => handleCardChange({ ...attributes.cards[selectedCardIndex], description: newDescription }, selectedCardIndex)}
                        />

                        <PanelBody title="Features" initialOpen={false}>
                            {attributes.cards[selectedCardIndex].features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="feature">
                                    <TextControl
                                        label={`Feature ${featureIndex + 1}`}
                                        value={feature}
                                        onChange={(newFeature) => handleFeatureChange(selectedCardIndex, featureIndex, newFeature)}
                                    />
                                    <Button variant="secondary" onClick={() => removeFeature(selectedCardIndex, featureIndex)}>
                                        Remove Feature
                                    </Button>
                                </div>
                            ))}
                            <Button variant="primary" onClick={() => addFeature(selectedCardIndex)}>
                                Add Feature
                            </Button>
                        </PanelBody>

                        <PanelBody title="Price" initialOpen={false}>
                            <TextControl
                                label="Current Price"
                                value={attributes.cards[selectedCardIndex].currentPrice}
                                onChange={(newPrice) => handleCardChange({ ...attributes.cards[selectedCardIndex], currentPrice: newPrice }, selectedCardIndex)}
                            />
                            <TextControl
                                label="Currency"
                                value={attributes.cards[selectedCardIndex].currency}
                                onChange={(newCurrency) => handleCardChange({ ...attributes.cards[selectedCardIndex], currency: newCurrency }, selectedCardIndex)}
                                />
                            <TextControl
                                label="Payment Period"
                                value={attributes.cards[selectedCardIndex].paymentPeriod}
                                onChange={(newPeriod) => handleCardChange({ ...attributes.cards[selectedCardIndex], paymentPeriod: newPeriod }, selectedCardIndex)}
                                />
                            <ToggleControl
                                label="Has Discount"
                                checked={attributes.cards[selectedCardIndex].hasDiscount}
                                onChange={(newHasDiscount) => handleCardChange({ ...attributes.cards[selectedCardIndex], hasDiscount: newHasDiscount }, selectedCardIndex)}
                                />
                            {attributes.cards[selectedCardIndex].hasDiscount && (
                                <TextControl
                                label="Discount Price"
                                value={attributes.cards[selectedCardIndex].discountPrice}
                                onChange={(newDiscountPrice) => handleCardChange({ ...attributes.cards[selectedCardIndex], discountPrice: newDiscountPrice }, selectedCardIndex)}
                                />
                            )}
                        </PanelBody>

                        <PanelBody title="Background Color" initialOpen={false}>
                            <PanelRow>
                                <ChromePicker
                                    color={attributes.cards[selectedCardIndex].bgColor}
                                    onChangeComplete={(color) => handleCardChange({ ...attributes.cards[selectedCardIndex], bgColor: color.hex }, selectedCardIndex)}
                                    disableAlpha
                                    />
                            </PanelRow>
                        </PanelBody>

                        <PanelBody title="Button Text" initialOpen={false}>
                            <TextControl
                                label="Button Text"
                                value={attributes.cards[selectedCardIndex].button}
                                onChange={(newButton) => handleCardChange({ ...attributes.cards[selectedCardIndex], button: newButton }, selectedCardIndex)}
                            />
                        </PanelBody>

                    </PanelBody>
                )}

                <Button variant="primary" onClick={addNewCard}>
                    Add New Card
                </Button>
            </InspectorControls>

            <div className="card-preview">
                <RichText
                    tagName="h2"
                    className="block-title"
                    value={attributes.blockTitle}
                    onChange={(newTitle) => setAttributes({ blockTitle: newTitle })}
                    placeholder="Block Title"
                />
                <div className="cards-container">
                    {attributes.cards.map((card, index) => (
                        <div
                            key={index}
                            className={`card ${selectedCardIndex === index ? 'selected' : ''} ${index === recommendedCardIndex ? 'recommended' : ''}`}
                            style={{ backgroundColor: card.bgColor }}
                            onClick={() => setSelectedCardIndex(index)}
                        >
                            <div className="card-icon"><span className={`dashicons dashicons-${card.icon}`}></span></div>
                            <h3>{card.title}</h3>
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
                                <p className="payment-period">For {card.paymentPeriod} Months</p>
                            </div>
                            <button className="btn">{card.button}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
