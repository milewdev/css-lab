(function() {
  var RangeConverters, build_checkbox_handler, build_display_element, build_display_text, build_hidden, build_range_handler, install_button_handlers, install_checkbox_handlers, install_hidden_labels, install_range_handlers, refresh, reset;

  build_display_text = function(css_attr_name, css_attr_value) {
    return "" + css_attr_name + ": " + css_attr_value + ";";
  };

  build_display_element = function(css_attr_name, css_attr_value) {
    return $("<span class='css-code'>" + (build_display_text(css_attr_name, css_attr_value)) + "</span>");
  };

  refresh = function() {
    return $('input').trigger('refresh');
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
    var $range, css_attr_name, css_attr_value, display, mockup_element;
    $range = $(range);
    mockup_element = $range.mockup_element();
    css_attr_name = $range.css_name();
    css_attr_value = this.value;
    display = build_display_element(css_attr_name, css_attr_value);
    $range.before(display);
    $range.on('input change', function() {
      return refresh();
    });
    $range.on('refresh', function() {
      var css_value;
      css_value = RangeConverters.convert(css_attr_name, this.value);
      mockup_element.css(css_attr_name, css_value);
      return display.text(build_display_text(css_attr_name, css_value));
    });
    return range.reset = function() {
      var $this;
      $this = $(this);
      $this.val($this.data('default-value'));
      return $this.trigger('change');
    };
  };

  install_range_handlers = function() {
    return $("input[type='range']").each(function() {
      return build_range_handler(this);
    });
  };

  build_checkbox_handler = function(checkbox) {
    var css_attr_name, css_attr_value, display, mockup_element;
    mockup_element = checkbox.mockup_element();
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
        mockup_element.css(css_attr_name, '');
        display.css('text-decoration', 'line-through');
      }
      return refresh();
    });
    return checkbox.on('refresh', function() {
      var checked;
      checked = $(this).prop('checked');
      if (checked) {
        return mockup_element.css(css_attr_name, css_attr_value);
      }
    });
  };

  install_checkbox_handlers = function() {
    return $("input[type='checkbox']").each(function() {
      var $this;
      $this = $(this);
      build_checkbox_handler($this);
      return this.reset = function() {
        $this = $(this);
        $this.prop('checked', true);
        return $this.trigger('change');
      };
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
