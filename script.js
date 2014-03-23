(function($){
  
  create_css_settings_controls();
  initialize_page();
  
  // TODO: refactoring in progress
  
  function create_css_settings_controls() {
  
    settings_controls().each( function() {
      
      var specs = extract_setting_specs(this);

      var attributeLabel = create_attribute_label(specs);
      var input = create_input_control();
      var unitsLabel = create_units_label();
      var range = create_range_control(specs);
    
      $(this).append(attributeLabel).append(input).append(unitsLabel).append(range);
    
      range.on('input change', function() {
        f(this.value);
      });
    
      preset_button().on('click', function() {
        f(specs.presetValue);
      });
    
      reset_button().on('click', function() {
        f(specs.defaultValue);
      });
    
      var that = $(this);
      var f = function(value) {
        input.val(value);
        range.val(value);
        $('section[id="example"] ' + specs.element).css(specs.attribute, value + 'em');
      
        if (value == specs.defaultValue) {
            that.removeClass("non-default-value");
        } else {
            that.addClass("non-default-value");
        }
      }

    });
  }
  
  function extract_setting_specs(obj) {
    return {
      element:        obj.dataset.element,
      attribute:      obj.dataset.attribute,
      attributeLabel: obj.dataset.attributeLabel || obj.dataset.attribute, 
      min:            obj.dataset.min || -4,
      max:            obj.dataset.max || 4,
      defaultValue:   obj.dataset.defaultValue || 0,
      presetValue:    obj.dataset.presetValue || 0
    };
  }
  
  function create_attribute_label(setting_specs) {
    return $("<label>" + setting_specs.attributeLabel + ":</label>");
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
