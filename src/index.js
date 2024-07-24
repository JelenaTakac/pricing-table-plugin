import "./index.scss";
import { InspectorControls, RichText, BlockControls, AlignmentToolbar } from "@wordpress/block-editor";
import { Button, PanelBody, PanelRow, SelectControl, TextControl, ToggleControl } from "@wordpress/components";
import {ChromePicker} from "react-color";

wp.blocks.registerBlockType('my-plugin/pricing-table', {
    title: 'Pricing Table',
    icon: 'table-row-after',
    category: 'common',
    attributes: {
        icon: {type: "string", default: "smiley"},
        title: {type: "string", default: ""},
        description: {type: "string", default: ""},
        currentPrice: {type: "string", default: "39.99"},
        currency: {type: "string",default: "$"},
        hasDiscount: {type: "boolean", default: false},
        discountPrice: {type: "string", default: ""},
        button: {type: "string" , default: ""},
        bgColor: {type: "string", default: "#ebebeb"},
        theAlignment: {type: "string", default: "center"}
    },
    description: "Create your best pricing table.",
    edit: EditComponent,
    save: function (props) {
        return null;
    }
});

function EditComponent(props) {

    function handleTitleChange(newValue) {
        props.setAttributes({ title: newValue })
    }

    function handleDescriptionChange(newValue) {
        props.setAttributes({ description: newValue })
    }

    function handleButtonChange(newValue) {
        props.setAttributes({ button: newValue })
    }

    return (
        <div className="pricing-table-edit-block" style={{backgroundColor: props.attributes.bgColor}}>
            <BlockControls>
                <AlignmentToolbar value={props.attributes.theAlignment} onChange={x => props.setAttributes({theAlignment: x})} />
            </BlockControls>
            <InspectorControls>
                <PanelBody title="Icon Settings">
                    <SelectControl
                        label="Icon"
                        value={props.attributes.icon}
                        options={[
                            { label: "Smiley", value: "smiley" },
                            { label: "Heart", value: "heart" },
                            { label: "Lightbulb", value: "lightbulb" },
                        ]}
                        onChange={(newIcon) => props.setAttributes({ icon: newIcon })}
                    />
                </PanelBody>


                <PanelBody title="Price Settings">
                    <TextControl
                        label="Current Price"
                        value={props.attributes.currentPrice}
                        onChange={(newPrice) => props.setAttributes({ currentPrice: newPrice })}
                    />
                    <TextControl
                        label="Currency"
                        value={props.attributes.currency}
                        onChange={(newCurrency) => props.setAttributes({ currency: newCurrency })}
                    />
                    <ToggleControl
                        label="Has Discount"
                        checked={props.attributes.hasDiscount}
                        onChange={(newHasDiscount) => props.setAttributes({ hasDiscount: newHasDiscount })}
                    />
                    {props.attributes.hasDiscount && (
                        <TextControl
                            label="Discount Price"
                            value={props.attributes.discountPrice}
                            onChange={(newDiscountPrice) => props.setAttributes({ discountPrice: newDiscountPrice })}
                        />
                    )}
                </PanelBody>

                <PanelBody title="Background Color" initialOpen={true}>
                    <PanelRow>
                        <ChromePicker color={props.attributes.bgColor} onChangeComplete={x => props.setAttributes({bgColor: x.hex})} disableAlpha={true}/>
                    </PanelRow>
                </PanelBody>

            </InspectorControls>

            <div className="icon-container">
                <span className={`dashicons dashicons-${props.attributes.icon}`} />
            </div>
            {/* <h2>Hello from Edit block</h2> */}
            <RichText allowedFormats={["core/bold", "core/italic"]} tagName="h3" className={`headline`} onChange={handleTitleChange} value={props.attributes.title} placeholder="Card Title"/>

            <RichText allowedFormats={[]} tagName="p" className={`description`} onChange={handleDescriptionChange} value={props.attributes.description} placeholder="Card Description"/>


            <div className="pricing-table-price">
                {props.attributes.hasDiscount && props.attributes.discountPrice ? (
                    <>
                        <span className="previous-price">{props.attributes.currency}{props.attributes.currentPrice}</span>
                        <span className="current-price">{props.attributes.currency}{props.attributes.discountPrice}</span>
                    </>
                ) : (
                    <span className="current-price">{props.attributes.currency}{props.attributes.currentPrice}</span>
                )}
            </div>

            <Button variant="primary">
                <RichText allowedFormats={["core/bold", "core/italic"]} className={`btn`} value={props.attributes.button} onChange={handleButtonChange} placeholder="BUY"/>
            </Button>
            
        </div>
    )
}