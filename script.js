(function($){
  
  create_css_settings_controls();
  initialize_page();
  
  // TODO: refactoring in progress
  
  function create_css_settings_controls() {
  
    settings_controls().each( function() {
      
      var that = $(this);
      
      var specs = extract_setting_specs(this);

      var attribute_label = create_attribute_label(specs);
      var input_control = create_input_control();
      var units_label = create_units_label();
      var range_control = create_range_control(specs);
    
      $(this).append(attribute_label).append(input_control).append(units_label).append(range_control);
    
      range_control.on('input change', function() {
        f(that, input_control, range_control, specs, this.value);
      });
    
      preset_button().on('click', function() {
        f(that, input_control, range_control, specs, specs.preset_value);
      });
    
      reset_button().on('click', function() {
        f(that, input_control, range_control, specs, specs.default_value);
      });
    
      var f = function(setting_control, input_control, range_control, setting_specs, value) {
        input_control.val(value);
        range_control.val(value);
        $('section[id="example"] ' + setting_specs.element).css(setting_specs.attribute, value + 'em');
      
        if (value == setting_specs.default_value) {
            setting_control.removeClass("non-default-value");
        } else {
            setting_control.addClass("non-default-value");
        }
      }

    });
  }
  
  function extract_setting_specs(obj) {
    return {
      element:          obj.dataset.element,
      attribute:        obj.dataset.attribute,
      attribute_label:  obj.dataset.attributeLabel || obj.dataset.attribute, 
      min:              obj.dataset.min || -4,
      max:              obj.dataset.max || 4,
      default_value:    obj.dataset.defaultValue || 0,
      preset_value:     obj.dataset.presetValue || 0
    };
  }
  
  function create_attribute_label(setting_specs) {
    return $("<label>" + setting_specs.attribute_label + ":</label>");
  }
  
  function create_input_control() {
    return $("<input type='text' readonly />");
  }
  
  function create_units_label() {
    return $("<label>em;</label>");
  }
  
  function create_range_control(setting_specs) {
    return $("<input type='range' min='" + setting_specs.min + "' max='" + setting_specs.max + "' />");
  }
  
  function initialize_page() {
    reset_button().click();
  }
  
  function settings_controls() {
    return $('div[data-element]');
  }
  
  function preset_button() {
    return $('#preset-button');
  }
  
  function reset_button() {
    return $('#reset-button');
  }

})(jQuery);
