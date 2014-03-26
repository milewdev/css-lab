/*
    The HTML page consists of two areas, a css settings area and an example
    area.  At runtime, the settings area contains a number of css settings
    for various HTML elements, for instance padding-left for li.  Each 
    setting has a few labels, a readonly text box to show the setting value 
    (e.g. 2em), and a range control used to vary the setting value.  The 
    example area contains a layout made up of the elements with settings in 
    the settings area, e.g. li.  As the slider for a given setting is varied,
    the value in the associated text box is updated to reflect the slider
    value and the css value in the example area is also updated.

    At design time, a setting in the settings area is represented by a div 
    placehold that has custom data- values to indicate the element that the 
    setting applies to (li), the attribute that the setting applies to 
    (padding-left), and optional initial, min and max slider values.  When 
    the page loads, the code below populates the div placeholders with the 
    labels, text boxes, and sliders described above, and adds a handler to 
    the slider control that updates the text box and css value on the 
    example element.

    The settings area also has a Preset button and a Reset button.  Clicking
    on the Preset button sets all of the css attributes to predefined values
    that supposedly result in a pleasing layout in the example area.  Clicking
    on the Reset button sets all of the css attributes to default values.

    The custom data attributes data-preset-value and data-default-value can 
    be used on the div placeholders to specify the preset and default css
    attribute values, respectively.  The code below adds handlers to the two
    buttons to populate the settings controls with preset and default values.
 */

(function($){

  // These functions run at page load time.
  populate_all_css_settings_placeholders();
  initialize_page();
  
  function populate_all_css_settings_placeholders() {  
    settings_placeholders().each( function() {
      populate_css_setting_placeholder( $(this) );
    });
  }
  
  function populate_css_setting_placeholder(placeholder) {
    var specs = extract_setting_specs(placeholder);
    var controls = create_setting_controls(specs);
    insert_controls_into_placeholder(placeholder, controls);
    install_event_handlers(placeholder, specs, controls);    
  
    // The functions below are nested so that they can
    // reference the placeholder, specs, and controls
    // variables instead of passing them all over the 
    // place.  This means, however, that copies of such
    // functions will be created for each placeholder.
    
    function install_event_handlers() {
      install_range_control_handler();
      install_preset_button_handler();
      install_reset_button_handler();
    }
    
    function install_range_control_handler() {
      controls.range_control.on('input change', function() {
        set_setting_value(this.value);    // 'this' points to controls.range_control
      });
    }

    // Note that there will be one handler per placeholder, so 
    // effectively the buttons will each have lists of observers.
    function install_preset_button_handler() {
      preset_button().on('click', function() {
        set_setting_value(specs.preset_value);
      });
    }
    
    function install_reset_button_handler() {
      reset_button().on('click', function() {
        set_setting_value(specs.default_value);
      });
    }

    function set_setting_value(value) {
      controls.input_control.val(value);
      controls.range_control.val(value);
      set_css_in_example(value);
      adjust_highlighting(value);
    }
    
    function set_css_in_example(value) {
      $('section[id="example"] ' + specs.element).css(specs.attribute, value + 'em');      
    }

    // Highlight the settings controls if the current value is not the default value;
    // this makes it easier to see what has been changed.
    function adjust_highlighting(value) {
      if (value == specs.default_value) {
          placeholder.removeClass("non-default-value");
      } else {
          placeholder.addClass("non-default-value");
      }
    }
  }
  
  function extract_setting_specs(placeholder) {
    var default_value = placeholder.data("defaultValue") || 0;    // create var because value used twice below
    return {
      element:          placeholder.data("element"),
      attribute:        placeholder.data("attribute"),
      attribute_label:  placeholder.data("attributeLabel") || placeholder.data("attribute"), 
      min:              placeholder.data("min") || -4,
      max:              placeholder.data("max") || 4,
      default_value:    default_value,
      preset_value:     placeholder.data("presetValue") || default_value
    };
  }
  
  function create_setting_controls(specs) {
    return {
      attribute_label:  create_attribute_label(specs),
      input_control:    create_input_control(),
      units_label:      create_units_label(),
      range_control:    create_range_control(specs)
    };
  }
  
  function create_attribute_label(specs) {
    return $("<label>" + specs.attribute_label + ":</label>");
  }
  
  function create_input_control() {
    return $("<input type='text' readonly />");
  }
  
  function create_units_label() {
    return $("<label>em;</label>");
  }
  
  function create_range_control(specs) {
    return $("<input type='range' min='" + specs.min + "' max='" + specs.max + "' />");
  }
  
  function insert_controls_into_placeholder(placeholder, controls) {
    placeholder
      .append(controls.attribute_label)
      .append(controls.input_control)
      .append(controls.units_label)
      .append(controls.range_control);
  }
  
  function initialize_page() {
    reset_button().click();
  }
  
  function settings_placeholders() {
    return $('div[data-element]');
  }
  
  function preset_button() {
    return $('#preset-button');
  }
  
  function reset_button() {
    return $('#reset-button');
  }

})(jQuery);
