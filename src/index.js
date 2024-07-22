wp.blocks.registerBlockType('myplugin/pricing-table', {
    title: 'Pricing Table',
    icon: 'table-row-after',
    category: 'common',
    edit: function () {
        return (
        <div>
            <p>Hello, this is a paragraph.</p>
            <h4>Hi there.</h4>
        </div>
        )
    },
    save: function () {
        return (
        <>
            <h3>H3 on the frontend.</h3>
            <h5>H5 on the frontend.</h5>
        </>
        )
    }
});