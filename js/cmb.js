/**
 * Controls the behaviours of custom metabox fields.
 *
 * @author Andrew Norcross
 * @author Jared Atchison
 * @author Bill Erickson
 * @see    https://github.com/jaredatch/Custom-Metaboxes-and-Fields-for-WordPress
 */

/*jslint browser: true, devel: true, indent: 4, maxerr: 50, sub: true */
/*global jQuery, tb_show, tb_remove */

/**
 * Custom jQuery for Custom Metaboxes and Fields
 */

var CMB = {
	
	_clonedFieldCallbacks: [],

	addCallbackForClonedField: function( fieldName, callback ) {
		this._clonedFieldCallbacks[fieldName] = this._clonedFieldCallbacks[fieldName] ? this._clonedFieldCallbacks[fieldName] : []
		this._clonedFieldCallbacks[fieldName].push( callback )
	},
	
	clonedField: function( el ) {

		var _this = this
		
		// also check child elements
		el.add( el.find( 'div[data-class]' ) ).each( function(i, el) {

			el = jQuery( el )
			var callbacks = _this._clonedFieldCallbacks[el.attr( 'data-class') ]
		
			if ( callbacks ) {
				for (var a = 0; a < callbacks.length; a++) {
					callbacks[a]( el )
				}
			}

		})
	},
	
	addCallbackForDeletedField: function( fieldName, callback ) {
		this._deletedFieldCallbacks[fieldName] = this._deletedFieldCallbacks[fieldName] ? this._deletedFieldCallbacks[fieldName] : []
		this._deletedFieldCallbacks[fieldName].push( callback )
	},
	
	_deletedFieldCallbacks: [],

	deletedField: function( el ) {

		var _this = this
		
		// also check child elements
		el.add( el.find( 'div[data-class]' ) ).each( function(i, el) {

			el = jQuery( el )
			var callbacks = _this._deletedFieldCallbacks[el.attr( 'data-class') ]
		
			if ( callbacks ) {
				for (var a = 0; a < callbacks.length; a++) {
					callbacks[a]( el )
				}
			}

		})
	}

}

jQuery(document).ready(function ($) {
	'use strict';

	var formfield;
	var formfieldobj;

	jQuery( document ).on( 'click', '.delete-field', function( e ) {

		e.preventDefault();
		
		var fieldItem = jQuery(this).closest( '.field-item' );

		CMB.deletedField( fieldItem );	

		fieldItem.remove();

	} );

	/**
	 * Initialize timepicker (this will be moved inline in a future release)
	 */
	$('.cmb_timepicker').each(function () {
		$( this ).timePicker({
			startTime: "07:00",
			endTime: "22:00",
			show24Hours: false,
			separator: ':',
			step: 30
		});
	});

	/**
	 * Initialize jQuery UI datepicker (this will be moved inline in a future release)
	 */
	$('.cmb_datepicker').each(function () {
		$( this ).datepicker();
		// $('#' + jQuery(this).attr('id')).datepicker({ dateFormat: 'yy-mm-dd' });
		// For more options see http://jqueryui.com/demos/datepicker/#option-dateFormat
	});
	
	// Wrap date picker in class to narrow the scope of jQuery UI CSS and prevent conflicts
	$("#ui-datepicker-div").wrap('<div class="cmb_element" />');

	/**
	 * Initialize color picker
	 */
    $('input:text.cmb_colorpicker').each(function (i) {
        $(this).after('<div id="picker-' + i + '" style="z-index: 1000; background: #EEE; border: 1px solid #CCC; position: absolute; display: block;"></div>');
        $('#picker-' + i).hide().farbtastic($(this)
        	);
    })
    .focus(function() {
        $(this).next().show();
    })
    .blur(function() {
        $(this).next().hide();
    });

	/**
	 * File and image upload handling
	 */
	$('.cmb_upload_file').change(function () {
		formfield = $(this).attr('id');

		formfieldobj = $(this).siblings( '.cmb_upload_file_id' );

		$('#' + formfield + '_id').val("");

	});

	$('.cmb_upload_button').live('click', function () {
		var buttonLabel;
		formfield = $(this).prev('input').attr('id');
		formfieldobj = $(this).siblings( '.cmb_upload_file_id' );

		if ( formfieldobj.siblings( 'label' ).length )
			buttonLabel = 'Use as ' + formfieldobj.siblings( 'label' ).text();

		else
			buttonLabel = 'Use as ' + $('label[for=' + formfield + ']').text();

		tb_show('', 'media-upload.php?post_id=' + $('#post_ID').val() + '&type=file&cmb_force_send=true&cmb_send_label=' + buttonLabel + '&TB_iframe=true');
		return false;
	});

	$('.cmb_remove_file_button').live('click', function () {
		formfield = $(this).attr('rel');
		formfieldobj = $(this).closest('.cmb_upload_status').siblings( '.cmb_upload_file_id' );
		$('input#' + formfield).val('');
		$('input#' + formfield + '_id').val('');
		$(this).parent().remove();
		return false;
	});

	window.original_send_to_editor = window.send_to_editor;
    window.send_to_editor = function (html) {
		var itemurl, itemclass, itemClassBits, itemid, htmlBits, itemtitle,
			image, uploadStatus = true;

		if (formfield) {

	        if ($(html).html(html).find('img').length > 0) {
				itemurl = $(html).html(html).find('img').attr('src'); // Use the URL to the size selected.
				itemclass = $(html).html(html).find('img').attr('class'); // Extract the ID from the returned class name.
				itemClassBits = itemclass.split(" ");
				itemid = itemClassBits[itemClassBits.length - 1];
				itemid = itemid.replace('wp-image-', '');
	        } else {
				// It's not an image. Get the URL to the file instead.
				htmlBits = html.split("'"); // jQuery seems to strip out XHTML when assigning the string to an object. Use alternate method.
				itemurl = htmlBits[1]; // Use the URL to the file.
				itemtitle = htmlBits[2];
				itemtitle = itemtitle.replace('>', '');
				itemtitle = itemtitle.replace('</a>', '');
				itemid = itemurl; // TO DO: Get ID for non-image attachments.
			}

			image = /(jpe?g|png|gif|ico)$/gi;

			if (itemurl.match(image)) {
				uploadStatus = '<div class="img_status"><img src="' + itemurl + '" alt="" /><a href="#" class="cmb_remove_file_button" rel="' + formfield + '">Remove Image</a></div>';
			} else {
				// No output preview if it's not an image
				// Standard generic output if it's not an image.
				html = '<a href="' + itemurl + '" target="_blank" rel="external">View File</a>';
				uploadStatus = '<div class="no_image"><span class="file_link">' + html + '</span>&nbsp;&nbsp;&nbsp;<a href="#" class="cmb_remove_file_button" rel="' + formfield + '">Remove</a></div>';
			}

			if ( formfieldobj ) {

				$(formfieldobj).val(itemid);
				$(formfieldobj).siblings('.cmb_upload_status').slideDown().html(uploadStatus);

			} else {
				$('#' + formfield).val(itemurl);
				$('#' + formfield + '_id').val(itemid);
				$('#' + formfield).siblings('.cmb_upload_status').slideDown().html(uploadStatus);
			}

			tb_remove();

		} else {
			window.original_send_to_editor(html);
		}

		formfield = '';
	};

	jQuery( document ).on( 'click', '.repeat-field', function( e ) {

	    e.preventDefault();

	    var el = jQuery( this );

	    var newT = el.prev().clone();
	    
	    // Remove anything we no longer want. 
	    newT.removeClass('hidden');
	    newT.find('input[type!="button"]').not('[readonly]').val('');
	    newT.find( '.cmb_upload_status' ).html('');
	    
	    newT.insertBefore( el.prev() );

	    // Recalculate group ids & update the name fields..
		var index = 0;
		var field = $(this).closest('.field' );
		var attrs = ['id','name','for','data-id','data-name'];	
	
		field.children('.field-item').not('.hidden').each( function() {

			var search  = field.hasClass( 'CMB_Group_Field' ) ? /cmb-group-(\d|x)*/g : /cmb-field-(\d|x)*/g;
			var replace = field.hasClass( 'CMB_Group_Field' ) ? 'cmb-group-' + index : 'cmb-field-' + index;

			$(this).find( '[' + attrs.join('],[') + ']' ).each( function() {

				for ( var i = 0; i < attrs.length; i++ )
					if ( typeof( $(this).attr( attrs[i] ) ) !== 'undefined' )
						$(this).attr( attrs[i], $(this).attr( attrs[i] ).replace( search, replace ) );
				
			} );

			index += 1;

		} );

		CMB.clonedField( newT );	    

	    // Reinitialize all the datepickers
		jQuery('.cmb_datepicker' ).each(function () {
			$(this).attr( 'id', '' ).removeClass( 'hasDatepicker' ).removeData( 'datepicker' ).unbind().datepicker();
		});

		// Reinitialize all the timepickers.
		jQuery('.cmb_timepicker' ).each(function () {
			$(this).timePicker({
				startTime: "07:00",
				endTime: "22:00",
				show24Hours: false,
				separator: ':',
				step: 30
			});
		});

	} );

});