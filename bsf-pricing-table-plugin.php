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
        add_action('init', array($this, 'adminAssets'));
        add_action('enqueue_block_editor_assets', array($this, 'myplugin_enqueue_dashicons'));

    }

    function adminAssets() {
        wp_register_style('pricingblockstyle', plugin_dir_url(__FILE__) . 'build/index.css');
        wp_register_script('pricingblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
        register_block_type('my-plugin/pricing-table', array(
            'editor_script' => 'pricingblocktype',
            'editor_style' => 'pricingblockstyle',
            'render_callback' => array($this, 'renderPricingTableBlock')
        ));
    }

    function myplugin_enqueue_dashicons() {
        wp_enqueue_style('dashicons');
    }

}


$BsfPricingTablePlugin = new BsfPricingTablePlugin();
?>