<?php

/*
Plugin Name: BSF Pricing Table Plugin
Description: Custom Gutenberg block for Pricing Table.
Version: 1.0
Author: Jelena
*/


if (!defined('ABSPATH')) exit;

class BsfPricingTablePlugin {
    function __construct() {
        add_action('init', [$this, 'adminAssets']);
    }

    function adminAssets() {
        wp_register_script('pricingblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
        register_block_type('myplugin/pricing-table', array(
            'editor_script' => 'pricingblocktype',
            'render_callback' => array($this, 'theHTML')
        ));
    }

}


$BsfPricingTablePlugin = new BsfPricingTablePlugin();
?>