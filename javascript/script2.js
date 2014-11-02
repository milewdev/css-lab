(function() {
  var Range, RangeConverters, build_checkbox_handler, build_display_element, build_display_text, build_hidden, install_button_handlers, install_checkbox_handlers, install_hidden_labels, install_range_handlers, refresh_all, reset;

  build_display_text = function(css_attr_name, css_attr_value) {
    return "" + css_attr_name + ": " + (css_attr_value != null ? css_attr_value : '') + ";";
  };

  build_display_element = function(css_attr_name, css_attr_value) {
    return $("<span class='css-code'>" + (build_display_text(css_attr_name, css_attr_value)) + "</span>");
  };

  refresh_all = function() {
    return $('input').each(function() {
      if (this.o != null) {
        return this.o.refresh();
      } else {
        return typeof this.refresh === "function" ? this.refresh() : void 0;
      }
    });
  };

  reset = function() {
    return $('input').each(function() {
      if (this.o != null) {
        return this.o.reset();
      } else {
        return typeof this.reset === "function" ? this.reset() : void 0;
      }
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

  Range = (function() {
    function Range(range) {
      range.o = this;
      this.range = range;
      this.$range = $(range);
      this.extract_and_save_attributes();
      this.create_and_insert_display();
      this.install_change_handler();
    }

    Range.prototype.refresh = function() {
      var css_value;
      css_value = RangeConverters.convert(this.css_name, this.range.value);
      this.mockup_element.css(this.css_name, css_value);
      return this.display.text(build_display_text(this.css_name, css_value));
    };

    Range.prototype.reset = function() {
      this.range.value = this.css_default_value;
      return this.$range.trigger('change');
    };

    Range.prototype.extract_and_save_attributes = function() {
      this.mockup_element = $(this.$range.data('mockup-element'));
      this.css_name = this.$range.data('css-attr-name');
      return this.css_default_value = this.$range.data('default-value');
    };

    Range.prototype.create_and_insert_display = function() {
      this.display = build_display_element(this.css_name);
      return this.$range.before(this.display);
    };

    Range.prototype.install_change_handler = function() {
      return this.$range.on('input change', function() {
        return refresh_all();
      });
    };

    return Range;

  })();

  install_range_handlers = function() {
    return $("input[type='range']").each(function() {
      return new Range(this);
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
      return refresh_all();
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
