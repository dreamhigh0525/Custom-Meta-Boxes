<?php
/**
 * Include and setup custom metaboxes and fields.
 *
 * @category YourThemeOrPlugin
 * @package  Metaboxes
 * @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
 * @link     https://github.com/jaredatch/Custom-Metaboxes-and-Fields-for-WordPress
 */

add_filter( 'cmb_meta_boxes', 'cmb_sample_metaboxes' );
/**
 * Define the metabox and field configurations.
 *
 * @param  array $meta_boxes
 * @return array
 */
function cmb_sample_metaboxes( array $meta_boxes ) {

	// Start with an underscore to hide fields from custom fields list
	$prefix = '_cmb_';

	$meta_boxes[] = array(
		'id' => 'f',
		'title' => 'Test Meta Box',
		'pages' => 'post',
		'context'    => 'normal',
		'priority'   => 'high',
		'show_names' => true, // Show field names on the left
		'fields' => array(
			array( 'id' => 'input4', 'name' => 'Text (12 cols, sub field)', 'type' => 'taxonomy_select', 'cols' => 12, 'taxonomy' => 'category' ),
		)
	);

	return $meta_boxes;

	$meta_boxes[] = array(
		'id' => 'f',
		'title' => 'Test Meta Box',
		'pages' => 'post',
		'context'    => 'normal',
		'priority'   => 'high',
		'show_names' => true, // Show field names on the left
		'fields' => array(

			array( 'id' => 'input', 'name' => 'Test Text Box (12 cols)', 'type' => 'text', 'cols' => 12 ),
			array( 'id' => 'input2', 'name' => 'Test Repeatable Field (4 cols)', 'type' => 'text', 'cols' => 4, 'repeatable' => true ),
			array( 'id' => 'input3', 'name' => 'Text Field', 'type' => 'text', 'cols' => 8 ),
			array( 'id' => 'group-1', 'name' => 'Group of Fields (repeatable)', 'type' => 'group', 'repeatable' => true, 'fields' => array(
				array( 'id' => 'input3-1', 'name' => 'Sub Field (2 cols)', 'type' => 'text', 'cols' => 2 ),
				array( 'id' => 'input3-2', 'name' => 'Text Fieldt', 'type' => 'text', 'cols' => 10 ),
				array( 'id' => 'input4', 'name' => 'Text (12 cols, sub field)', 'type' => 'taxonomy_select', 'cols' => 12, 'taxonomy' => 'category' )
			) )

		)
	);

	return $meta_boxes;
}