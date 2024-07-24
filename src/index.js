import "./index.scss";
import { InspectorControls, RichText, BlockControls, AlignmentToolbar } from "@wordpress/block-editor";
import { Button, PanelBody, PanelRow, SelectControl, TextControl, ToggleControl } from "@wordpress/components";
import { ChromePicker } from "react-color";

wp.blocks.registerBlockType('my-plugin/pricing-table', {
    title: 'Pricing Table',
    icon: 'table-row-after',
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
                },
            ],
        },
        bgColor: { type: "string", default: "#ebebeb" },
        theAlignment: { type: "string", default: "center" },
    },
    description: "Create your best pricing table.",
    edit: EditComponent,
    save: function (props) {
        return null;
    }
});

function EditComponent(props) {
    const { attributes, setAttributes } = props;

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
        };
        setAttributes({ cards: [...attributes.cards, newCard] });
    };

    const removeCard = (index) => {
        const updatedCards = attributes.cards.filter((card, cardIndex) => cardIndex !== index);
        setAttributes({ cards: updatedCards });
    };

    return (
        <div className="pricing-table-edit-block" style={{ backgroundColor: attributes.bgColor }}>
            <BlockControls>
                <AlignmentToolbar value={attributes.theAlignment} onChange={(newAlignment) => setAttributes({ theAlignment: newAlignment })} />
            </BlockControls>
            <InspectorControls>
                <PanelBody title="Background Color" initialOpen={false}>
                    <PanelRow>
                        <ChromePicker
                            color={attributes.bgColor}
                            onChangeComplete={(color) => setAttributes({ bgColor: color.hex })}
                            disableAlpha
                        />
                    </PanelRow>
                </PanelBody>

                <PanelBody title="Block Title">
                    <TextControl
                        label="Title"
                        value={attributes.blockTitle}
                        onChange={(newTitle) => setAttributes({ blockTitle: newTitle })}
                    />
                </PanelBody>

                {attributes.cards.map((card, index) => (
                    <PanelBody key={index} title={`Card ${index + 1}`} initialOpen={false}>
                        <Button variant="primary" onClick={() => removeCard(index)}>
                            Remove Card
                        </Button>
                        <SelectControl
                            label="Icon"
                            value={card.icon}
                            options={[
                                { label: "Smiley", value: "smiley" },
                                { label: "Heart", value: "heart" },
                                { label: "Lightbulb", value: "lightbulb" },
                            ]}
                            onChange={(newIcon) => handleCardChange({ ...card, icon: newIcon }, index)}
                        />
                        <TextControl
                            label="Card Title"
                            value={card.title}
                            onChange={(newTitle) => handleCardChange({ ...card, title: newTitle }, index)}
                        />
                        <TextControl
                            label="Card Description"
                            value={card.description}
                            onChange={(newDescription) => handleCardChange({ ...card, description: newDescription }, index)}
                        />
                        <TextControl
                            label="Current Price"
                            value={card.currentPrice}
                            onChange={(newPrice) => handleCardChange({ ...card, currentPrice: newPrice }, index)}
                        />
                        <TextControl
                            label="Currency"
                            value={card.currency}
                            onChange={(newCurrency) => handleCardChange({ ...card, currency: newCurrency }, index)}
                        />
                        <ToggleControl
                            label="Has Discount"
                            checked={card.hasDiscount}
                            onChange={(newHasDiscount) => handleCardChange({ ...card, hasDiscount: newHasDiscount }, index)}
                        />
                        {card.hasDiscount && (
                            <TextControl
                                label="Discount Price"
                                value={card.discountPrice}
                                onChange={(newDiscountPrice) => handleCardChange({ ...card, discountPrice: newDiscountPrice }, index)}
                            />
                        )}
                        <TextControl
                            label="Button Text"
                            value={card.button}
                            onChange={(newButton) => handleCardChange({ ...card, button: newButton }, index)}
                        />
                    </PanelBody>
                ))}

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
                        <div key={index} className="card">
                            <span className={`dashicons dashicons-${card.icon}`}></span>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
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
