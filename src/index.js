import "./index.scss";
import { InspectorControls, RichText, BlockControls, AlignmentToolbar } from "@wordpress/block-editor";
import { Button, PanelBody, PanelRow, SelectControl, TextControl, ToggleControl } from "@wordpress/components";
import { ChromePicker } from "react-color";
import { useState } from "@wordpress/element";

wp.blocks.registerBlockType('my-plugin/pricing-table', {
    title: 'Pricing Table',
    icon: 'table-col-after',
    category: 'common',
    attributes: {
        blockTitle: { type: "string", default: "Get Your Perfect Edition Plans" },
        cards: {
            type: "array",
            default: [
                {
                    icon: "smiley",
                    title: "",
                    description: "",
                    currentPrice: "39.99",
                    currency: "",
                    hasDiscount: false,
                    discountPrice: "",
                    button: "",
                    bgColor: "#ebebeb", 
                    features: ["free"]
                },
            ],
        },
        theAlignment: { type: "string", default: "" },
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
            hasDiscount: false,
            discountPrice: "",
            button: "",
            bgColor: "#ffffff",
            features: ["free"]
        };
        setAttributes({ cards: [...attributes.cards, newCard] });
        setSelectedCardIndex(attributes.cards.length); // Select the newly added card
    };

    const removeCard = (index) => {
        const updatedCards = attributes.cards.filter((card, cardIndex) => cardIndex !== index);
        setAttributes({ cards: updatedCards });
        setSelectedCardIndex(null); // Deselect card if it was removed
    };
    
    // /////////////////////////////////

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


    // /////////////////////////

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
                        <TextControl
                            label="Button Text"
                            value={attributes.cards[selectedCardIndex].button}
                            onChange={(newButton) => handleCardChange({ ...attributes.cards[selectedCardIndex], button: newButton }, selectedCardIndex)}
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

                        <PanelRow>
                            <ChromePicker
                                color={attributes.cards[selectedCardIndex].bgColor}
                                onChangeComplete={(color) => handleCardChange({ ...attributes.cards[selectedCardIndex], bgColor: color.hex }, selectedCardIndex)}
                                disableAlpha
                                />
                        </PanelRow>

                        
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
                            className={`card ${selectedCardIndex === index ? 'selected' : ''}`}
                            style={{ backgroundColor: card.bgColor }}
                            onClick={() => setSelectedCardIndex(index)}
                        >
                            <span className={`dashicons dashicons-${card.icon}`}></span>
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
                            </div>
                            <button className="btn">{card.button}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
