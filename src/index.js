import "./index.scss";
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl, TextControl, ToggleControl } from "@wordpress/components";

wp.blocks.registerBlockType('my-plugin/pricing-table', {
    title: 'Pricing Table',
    icon: 'table-row-after',
    category: 'common',
    attributes: {
        icon: {type: "string", default: "smiley"},
        title: {type: "string", default: "Package Name"},
        description: {type: "string", default: "Auctor condimentum vero, solutauld hilvil similique, nisl proin augue? Accumsan interdum etiam"},
        
        currentPrice: {
            type: 'string',
            default: '39.99',
        },
        currency: {
            type: 'string',
            default: '$',
        },
        hasDiscount: {
            type: 'boolean',
            default: false,
        },
        discountPrice: {
            type: 'string',
            default: '',
        },


        button: {type: "string" , default: "BUY NOW"}
    },
    description: "Create your best pricing table.",
    edit: EditComponent,
    save: function () {
        return (
        <>
            <h3>H3 on the frontend.</h3>
            <h5>H5 on the frontend.</h5>
        </>
        )
    }
});

function EditComponent(props) {

    function handleTitleChange(value) {
        props.setAttributes({ title: value })
    }

    function handleDescriptionChange(value) {
        props.setAttributes({ description: value })
    }

    function handleButtonChange(value) {
        props.setAttributes({ button: value })
    }

    return (
        <div className="pricing-table-edit-block">
            <InspectorControls>
                <PanelBody title="Icon Settings">
                    <SelectControl
                        label='Icon'
                        value={props.attributes.icon}
                        options={[
                            { label: 'Smiley', value: 'smiley' },
                            { label: 'Heart', value: 'heart' },
                            { label: 'Lightbulb', value: 'lightbulb' },
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

            </InspectorControls>

            <div className="icon-container">
                <span className={`dashicons dashicons-${props.attributes.icon}`} />
            </div>
            {/* <h2>Hello from Edit block</h2> */}
            <RichText allowedFormats={["core/bold", "core/italic"]} tagName="h3" className={`headline`} onChange={handleTitleChange} value={props.attributes.title}/>

            <RichText allowedFormats={[]} tagName="p" className={`description`} onChange={handleDescriptionChange} value={props.attributes.description}/>


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
                <RichText allowedFormats={["core/bold", "core/italic"]} className={`btn`} value={props.attributes.button} onChange={handleButtonChange}/>
            </Button>
            
        </div>
    )
}