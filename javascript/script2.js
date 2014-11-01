(function() {
  var RangeConverters, build_checkbox_handler, build_display_element, build_display_text, build_hidden, build_range_handler, build_range_refresh_function, build_range_reset_function, extract_and_save_range_attributes, install_button_handlers, install_checkbox_handlers, install_hidden_labels, install_range_handlers, refresh, reset;

  build_display_text = function(css_attr_name, css_attr_value) {
    return "" + css_attr_name + ": " + (css_attr_value != null ? css_attr_value : '') + ";";
  };

  build_display_element = function(css_attr_name, css_attr_value) {
    return $("<span class='css-code'>" + (build_display_text(css_attr_name, css_attr_value)) + "</span>");
  };

  refresh = function() {
    return $('input').each(function() {
      return typeof this.refresh === "function" ? this.refresh() : void 0;
    });
  };

  reset = function() {
    return $('input').each(function() {
      return typeof this.reset === "function" ? this.reset() : void 0;
    });
  };

  $.fn.extend({
    mockup_element: function() {
      return $(this.data('mockup-element'));
    },
    css_name: function() {
      return this.data('css-attr-name');
    },
    css_value: function() {
      return this.data('css-attr-value');
    },
    css_default_value: function() {
      return this.data('default-value');
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

  extract_and_save_range_attributes = function(range) {
    var $range;
    $range = $(range);
    range.mockup_element = $($range.data('mockup-element'));
    return range.css_name = $range.data('css-attr-name');
  };

  build_range_refresh_function = function(display) {
    return function() {
      var $this, css_value;
      $this = $(this);
      css_value = RangeConverters.convert(this.css_name, this.value);
      this.mockup_element.css(this.css_name, css_value);
      return display.text(build_display_text(this.css_name, css_value));
    };
  };

  build_range_reset_function = function() {
    return function() {
      var $this;
      $this = $(this);
      $this.val($this.css_default_value());
      return $this.trigger('change');
    };
  };

  build_range_handler = function(range) {
    var $range, display;
    $range = $(range);
    extract_and_save_range_attributes(range);
    display = build_display_element(range.css_name);
    $range.before(display);
    $range.on('input change', function() {
      return refresh();
    });
    range.refresh = build_range_refresh_function(display);
    return range.reset = build_range_reset_function();
  };

  install_range_handlers = function() {
    return $("input[type='range']").each(function() {
      return build_range_handler(this);
    });
  };

  build_checkbox_handler = function(checkbox) {
    var $checkbox, css_attr_name, css_attr_value, display, mockup_element;
    $checkbox = $(checkbox);
    mockup_element = $checkbox.mockup_element();
    css_attr_name = $checkbox.css_name();
    css_attr_value = $checkbox.css_value();
    display = build_display_element(css_attr_name, css_attr_value);
    $checkbox.before(display);
    $checkbox.on('input change', function() {
      var checked;
      checked = $(this).prop('checked');
      if (checked) {
        display.css('text-decoration', '');
      } else {
        mockup_element.css(css_attr_name, '');
        display.css('text-decoration', 'line-through');
      }
      return refresh();
    });
    checkbox.refresh = function() {
      var checked;
      checked = $(this).prop('checked');
      if (checked) {
        return mockup_element.css(css_attr_name, css_attr_value);
      }
    };
    return checkbox.reset = function() {
      var $this;
      $this = $(this);
      $this.prop('checked', true);
      return $this.trigger('change');
    };
  };

  install_checkbox_handlers = function() {
    return $("input[type='checkbox']").each(function() {
      return build_checkbox_handler(this);
    });
  };

  build_hidden = function(hidden) {
    var css_attr_name, css_attr_value, display, mockup_element;
    mockup_element = hidden.mockup_element();
    css_attr_name = hidden.css_name();
    css_attr_value = hidden.css_value();
    display = build_display_element(css_attr_name, css_attr_value);
    hidden.before(display);
    return mockup_element.css(css_attr_name, css_attr_value);
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

  install_range_handlers();

  install_checkbox_handlers();

  install_hidden_labels();

  install_button_handlers();

  reset();

}).call(this);
