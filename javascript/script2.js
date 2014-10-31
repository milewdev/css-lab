(function() {
  var RangeConverters, build_checkbox_handler, build_hidden, build_range_handler, install_button_handlers, install_checkbox_handlers, install_hidden_labels, install_range_handlers, refresh, reset, reset_checkboxes, reset_ranges;

  RangeConverters = (function() {
    function RangeConverters() {}

    RangeConverters.convert = function(css_attr_name, range_value) {
      var convert;
      convert = RangeConverters["range_to_" + (css_attr_name.replace('-', '_'))];
      return convert(range_value);
    };

    RangeConverters.range_to_em = function(range_value) {
      return range_value + 'em';
    };

    RangeConverters.range_to_width = RangeConverters.range_to_em;

    RangeConverters.range_to_margin = RangeConverters.range_to_em;

    RangeConverters.range_to_margin_top = RangeConverters.range_to_em;

    RangeConverters.range_to_display = function(range_value) {
      return ['none', 'inline', 'inline-block', 'block'][range_value];
    };

    RangeConverters.range_to_float = function(range_value) {
      return ['none', 'left', 'right'][range_value];
    };

    return RangeConverters;

  })();

  refresh = function() {
    return $('input').trigger('refresh');
  };

  build_range_handler = function(range) {
    var css_attr_name, css_attr_value, display, mockup;
    mockup = $(range.data('mockup'));
    css_attr_name = range.data('css-attr-name');
    css_attr_value = this.value;
    display = $("<span class='css-code'>" + css_attr_name + ": " + css_attr_value + ";</span>");
    range.before(display);
    range.on('input change', function() {
      return refresh();
    });
    return range.on('refresh', function() {
      var css_value;
      css_value = RangeConverters.convert(css_attr_name, this.value);
      mockup.css(css_attr_name, css_value);
      return display.text("" + css_attr_name + ": " + css_value + ";");
    });
  };

  build_checkbox_handler = function(checkbox) {
    var css_attr_name, css_attr_value, display, mockup;
    mockup = $(checkbox.data('mockup'));
    css_attr_name = checkbox.data('css-attr-name');
    css_attr_value = checkbox.data('css-attr-value');
    display = $("<span class='css-code'>" + css_attr_name + ": " + css_attr_value + ";</span>");
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

  build_hidden = function(hidden) {
    var css_attr_name, css_attr_value, display, mockup;
    mockup = $(hidden.data('mockup'));
    css_attr_name = hidden.data('css-attr-name');
    css_attr_value = hidden.data('css-attr-value');
    display = $("<span class='css-code'>" + css_attr_name + ": " + css_attr_value + ";</span>");
    hidden.before(display);
    return mockup.css(css_attr_name, css_attr_value);
  };

  install_range_handlers = function() {
    return $("input[type='range']").each(function() {
      var $this;
      $this = $(this);
      return build_range_handler($this);
    });
  };

  install_checkbox_handlers = function() {
    return $("input[type='checkbox']").each(function() {
      var $this;
      $this = $(this);
      return build_checkbox_handler($this);
    });
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
