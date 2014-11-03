(function() {
  var Checkbox, Hidden, Range, RangeConverters, build_display_element, build_display_text, install_button_handlers, install_checkbox_handlers, install_hidden_labels, install_range_handlers, refresh_all, reset_all;

  build_display_text = function(css_attr_name, css_attr_value) {
    return "" + css_attr_name + ": " + (css_attr_value != null ? css_attr_value : '') + ";";
  };

  build_display_element = function(css_attr_name, css_attr_value) {
    return $("<span class='css-code'>" + (build_display_text(css_attr_name, css_attr_value)) + "</span>");
  };

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

  Checkbox = (function() {
    function Checkbox(checkbox) {
      checkbox.o = this;
      this.checkbox = checkbox;
      this.$checkbox = $(checkbox);
      this.extract_and_save_attributes();
      this.create_and_insert_display();
      this.install_change_handler();
    }

    Checkbox.prototype.refresh = function() {
      var checked;
      checked = this.$checkbox.prop('checked');
      if (checked) {
        return this.mockup_element.css(this.css_name, this.css_value);
      }
    };

    Checkbox.prototype.reset = function() {
      this.$checkbox.prop('checked', true);
      return this.$checkbox.trigger('change');
    };

    Checkbox.prototype.extract_and_save_attributes = function() {
      this.mockup_element = $(this.$checkbox.data('mockup-element'));
      this.css_name = this.$checkbox.data('css-attr-name');
      return this.css_value = this.$checkbox.data('css-attr-value');
    };

    Checkbox.prototype.create_and_insert_display = function() {
      this.display = build_display_element(this.css_name, this.css_value);
      return this.$checkbox.before(this.display);
    };

    Checkbox.prototype.install_change_handler = function() {
      return this.$checkbox.on('input change', function() {
        return this.o.on_change();
      });
    };

    Checkbox.prototype.on_change = function() {
      var checked;
      checked = this.$checkbox.prop('checked');
      if (checked) {
        this.display.css('text-decoration', '');
      } else {
        this.mockup_element.css(this.css_name, '');
        this.display.css('text-decoration', 'line-through');
      }
      return refresh_all();
    };

    return Checkbox;

  })();

  Hidden = (function() {
    function Hidden(hidden) {
      hidden.o = this;
      this.hidden = hidden;
      this.$hidden = $(hidden);
      this.extract_and_save_attributes();
      this.create_and_insert_display();
      this.mockup_element.css(this.css_name, this.css_value);
    }

    Hidden.prototype.refresh = function() {};

    Hidden.prototype.reset = function() {};

    Hidden.prototype.extract_and_save_attributes = function() {
      this.mockup_element = $(this.$hidden.data('mockup-element'));
      this.css_name = this.$hidden.data('css-attr-name');
      return this.css_value = this.$hidden.data('css-attr-value');
    };

    Hidden.prototype.create_and_insert_display = function() {
      this.display = build_display_element(this.css_name, this.css_value);
      return this.$hidden.before(this.display);
    };

    return Hidden;

  })();

  install_range_handlers = function() {
    return $("input[type='range']").each(function() {
      return new Range(this);
    });
  };

  install_checkbox_handlers = function() {
    return $("input[type='checkbox']").each(function() {
      return new Checkbox(this);
    });
  };

  install_hidden_labels = function() {
    return $("input[type='hidden']").each(function() {
      return new Hidden(this);
    });
  };

  install_button_handlers = function() {
    return $('#reset').on('click', function() {
      return reset_all();
    });
  };

  refresh_all = function() {
    return $('input').each(function() {
      return this.o.refresh();
    });
  };

  reset_all = function() {
    return $('input').each(function() {
      return this.o.reset();
    });
  };

  install_range_handlers();

  install_checkbox_handlers();

  install_hidden_labels();

  install_button_handlers();

  reset_all();

}).call(this);
