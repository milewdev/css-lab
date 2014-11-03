(function() {
  var Checkbox, CssAttributeView, Hidden, Range, RangeConverters, install_button_handlers, install_checkbox_handlers, install_hidden_labels, install_range_handlers, refresh_all, reset_all;

  CssAttributeView = (function() {
    function CssAttributeView(css_name, css_value) {
      this.css_name = css_name;
      this.$element = this.create_element();
      if (css_value != null) {
        this.set_value(css_value);
      }
    }

    CssAttributeView.prototype.element = function() {
      return this.$element;
    };

    CssAttributeView.prototype.set_value = function(value) {
      return this.$element.text("" + this.css_name + ": " + value + ";");
    };

    CssAttributeView.prototype.create_element = function() {
      return $("<span class='css-code'></span>");
    };

    return CssAttributeView;

  })();

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
      return this.display.set_value(css_value);
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
      this.display = new CssAttributeView(this.css_name);
      return this.$range.before(this.display.element());
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
      this.display = new CssAttributeView(this.css_name, this.css_value);
      return this.$checkbox.before(this.display.element());
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
        this.display.element().css('text-decoration', '');
      } else {
        this.mockup_element.css(this.css_name, '');
        this.display.element().css('text-decoration', 'line-through');
      }
      return refresh_all();
    };

    return Checkbox;

  })();

  Hidden = (function() {
    function Hidden(hidden) {
      var $hidden, css_name, css_value, display, mockup_element;
      hidden.o = this;
      $hidden = $(hidden);
      css_name = $hidden.data('css-attr-name');
      css_value = $hidden.data('css-attr-value');
      display = new CssAttributeView(css_name, css_value);
      $hidden.before(display.element());
      mockup_element = $($hidden.data('mockup-element'));
      mockup_element.css(css_name, css_value);
    }

    Hidden.prototype.refresh = function() {};

    Hidden.prototype.reset = function() {};

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
