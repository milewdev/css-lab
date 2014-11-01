(function() {
  var RangeConverters, build_checkbox_handler, build_display_element, build_display_text, build_hidden, build_range_handler, install_button_handlers, install_checkbox_handlers, install_hidden_labels, install_range_handlers, mockup_element_for, refresh, reset, reset_checkboxes, reset_ranges;

  build_display_text = function(css_attr_name, css_attr_value) {
    return "" + css_attr_name + ": " + css_attr_value + ";";
  };

  build_display_element = function(css_attr_name, css_attr_value) {
    return $("<span class='css-code'>" + (build_display_text(css_attr_name, css_attr_value)) + "</span>");
  };

  mockup_element_for = function(element) {
    return $(element.data('mockup'));
  };

  refresh = function() {
    return $('input').trigger('refresh');
  };

  $.fn.extend({
    css_name: function() {
      return this.data('css-attr-name');
    },
    css_value: function() {
      return this.data('css-attr-value');
    }
  });

  RangeConverters = (function() {
    function RangeConverters() {}

    RangeConverters.convert = function(css_attr_name, range_value) {
      var convert;
      convert = RangeConverters["range_to_" + (css_attr_name.replace('-', '_'))];
      return convert(range_value);
    };

    RangeConverters.range_to_display = function(range_value) {
      return ['none', 'inline', 'inline-block', 'block'][range_value];
    };

    RangeConverters.range_to_float = function(range_value) {
      return ['none', 'left', 'right'][range_value];
    };

    RangeConverters.range_to_em = function(range_value) {
      return range_value + 'em';
    };

    RangeConverters.range_to_margin = RangeConverters.range_to_em;

    RangeConverters.range_to_margin_top = RangeConverters.range_to_em;

    RangeConverters.range_to_width = RangeConverters.range_to_em;

    return RangeConverters;

  })();

  build_range_handler = function(range) {
    var css_attr_name, css_attr_value, display, mockup;
    mockup = mockup_element_for(range);
    css_attr_name = range.css_name();
    css_attr_value = this.value;
    display = build_display_element(css_attr_name, css_attr_value);
    range.before(display);
    range.on('input change', function() {
      return refresh();
    });
    return range.on('refresh', function() {
      var css_value;
      css_value = RangeConverters.convert(css_attr_name, this.value);
      mockup.css(css_attr_name, css_value);
      return display.text(build_display_text(css_attr_name, css_value));
    });
  };

  install_range_handlers = function() {
    return $("input[type='range']").each(function() {
      var $this;
      $this = $(this);
      return build_range_handler($this);
    });
  };

  build_checkbox_handler = function(checkbox) {
    var css_attr_name, css_attr_value, display, mockup;
    mockup = mockup_element_for(checkbox);
    css_attr_name = checkbox.css_name();
    css_attr_value = checkbox.css_value();
    display = build_display_element(css_attr_name, css_attr_value);
    checkbox.before(display);
    checkbox.on('input change', function() {
      var checked;
      checked = $(this).prop('checked');
      if (checked) {
        display.css('text-decoration', '');
      } else {
        mockup.css(css_attr_name, '');
        display.css('text-decoration', 'line-through');
      }
      return refresh();
    });
    return checkbox.on('refresh', function() {
      var checked;
      checked = $(this).prop('checked');
      if (checked) {
        return mockup.css(css_attr_name, css_attr_value);
      }
    });
  };

  install_checkbox_handlers = function() {
    return $("input[type='checkbox']").each(function() {
      var $this;
      $this = $(this);
      return build_checkbox_handler($this);
    });
  };

  build_hidden = function(hidden) {
    var css_attr_name, css_attr_value, display, mockup;
    mockup = mockup_element_for(hidden);
    css_attr_name = hidden.css_name();
    css_attr_value = hidden.css_value();
    display = build_display_element(css_attr_name, css_attr_value);
    hidden.before(display);
    return mockup.css(css_attr_name, css_attr_value);
  };

  install_hidden_labels = function() {
    return $("input[type='hidden']").each(function() {
      var $this;
      $this = $(this);
      return build_hidden($this);
    });
  };

  install_button_handlers = function() {
    return $('#reset').on('click', function() {
      return reset();
    });
  };

  reset_ranges = function() {
    return $('input[data-default-value]').each(function() {
      var $this;
      $this = $(this);
      $this.val($this.data('default-value'));
      return $this.trigger('change');
    });
  };

  reset_checkboxes = function() {
    return $("input[type='checkbox']").each(function() {
      var $this;
      $this = $(this);
      $this.prop('checked', true);
      return $this.trigger('change');
    });
  };

  reset = function() {
    reset_ranges();
    return reset_checkboxes();
  };

  install_range_handlers();

  install_checkbox_handlers();

  install_hidden_labels();

  install_button_handlers();

  reset();

}).call(this);
