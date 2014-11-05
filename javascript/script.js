(function() {
  var Checkbox, CssAttributeView, Hidden, Range, RangeConverters, VendorPrefix, install_button_handlers, install_checkbox_handlers, install_hidden_labels, install_range_handlers, refresh_all, reset_all,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  VendorPrefix = (function() {
    var cached_prefix, derive_prefix, needs_prefixing, prefix, prefix_css_value, values_that_need_prefixing;

    function VendorPrefix() {}

    values_that_need_prefixing = ['flex', 'inline-flex'];

    cached_prefix = null;

    prefix_css_value = function(css_value) {
      if (needs_prefixing(css_value)) {
        return "" + (prefix()) + css_value;
      } else {
        return css_value;
      }
    };

    needs_prefixing = function(css_value) {
      return __indexOf.call(values_that_need_prefixing, css_value) >= 0;
    };

    prefix = function() {
      return cached_prefix != null ? cached_prefix : cached_prefix = derive_prefix();
    };

    derive_prefix = function() {
      var style;
      style = $('body').get(0).style;
      switch (false) {
        case style.webkitFlex == null:
          return '-webkit-';
        case style.mozFlex == null:
          return '-moz-';
        case style.msFlex == null:
          return '-ms-';
        default:
          return '';
      }
    };

    $.fn.css2 = function(css_name, css_value) {
      css_value = prefix_css_value(css_value);
      return this.css(css_name, css_value);
    };

    return VendorPrefix;

  })();

  CssAttributeView = (function() {
    function CssAttributeView(css_name, css_value) {
      this.css_name = css_name;
      this.$dom_element = this.create_dom_element();
      if (css_value != null) {
        this.set_value(css_value);
      }
    }

    CssAttributeView.prototype.dom_element = function() {
      return this.$dom_element;
    };

    CssAttributeView.prototype.set_value = function(value) {
      return this.$dom_element.text("" + this.css_name + ": " + value + ";");
    };

    CssAttributeView.prototype.create_dom_element = function() {
      return $("<span class='css-code'></span>");
    };

    return CssAttributeView;

  })();

  RangeConverters = (function() {
    function RangeConverters() {}

    RangeConverters.convert = function(css_attr_name, range_value) {
      var convert;
      convert = RangeConverters["range_to_" + (css_attr_name.replace(/-/g, '_'))];
      return convert(range_value);
    };

    RangeConverters.range_to_align_content = function(range_value) {
      return ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'][range_value];
    };

    RangeConverters.range_to_align_items = function(range_value) {
      return ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'][range_value];
    };

    RangeConverters.range_to_align_self = function(range_value) {
      return ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'][range_value];
    };

    RangeConverters.range_to_display = function(range_value) {
      return ['none', 'inline', 'inline-block', 'block', 'inline-flex', 'flex'][range_value];
    };

    RangeConverters.range_to_flex_direction = function(range_value) {
      return ['row', 'row-reverse', 'column', 'column-reverse'][range_value];
    };

    RangeConverters.range_to_flex_wrap = function(range_value) {
      return ['nowrap', 'wrap', 'wrap-reverse'][range_value];
    };

    RangeConverters.range_to_float = function(range_value) {
      return ['none', 'left', 'right'][range_value];
    };

    RangeConverters.range_to_justify_content = function(range_value) {
      return ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'][range_value];
    };

    RangeConverters.range_to_em = function(range_value) {
      return range_value + 'em';
    };

    RangeConverters.range_to_number = function(range_value) {
      return range_value;
    };

    RangeConverters.range_to_flex_basis = RangeConverters.range_to_em;

    RangeConverters.range_to_flex_grow = RangeConverters.range_to_number;

    RangeConverters.range_to_flex_shrink = RangeConverters.range_to_number;

    RangeConverters.range_to_margin = RangeConverters.range_to_em;

    RangeConverters.range_to_margin_top = RangeConverters.range_to_em;

    RangeConverters.range_to_margin_bottom = RangeConverters.range_to_em;

    RangeConverters.range_to_margin_left = RangeConverters.range_to_em;

    RangeConverters.range_to_margin_right = RangeConverters.range_to_em;

    RangeConverters.range_to_order = RangeConverters.range_to_number;

    RangeConverters.range_to_padding = RangeConverters.range_to_em;

    RangeConverters.range_to_padding_top = RangeConverters.range_to_em;

    RangeConverters.range_to_padding_bottom = RangeConverters.range_to_em;

    RangeConverters.range_to_padding_left = RangeConverters.range_to_em;

    RangeConverters.range_to_padding_right = RangeConverters.range_to_em;

    RangeConverters.range_to_width = RangeConverters.range_to_em;

    return RangeConverters;

  })();

  Range = (function() {
    function Range(range) {
      this.range = range;
      this.$range = $(range);
      this.link_dom_element_to_wrapper(range);
      this.extract_and_save_attributes();
      this.create_and_insert_display();
      this.install_change_handler();
    }

    Range.prototype.refresh = function() {
      var css_value;
      css_value = this.calc_css_value(this.range.value);
      this.update_mockup_dom_element(css_value);
      return this.update_css_attribute_view(css_value);
    };

    Range.prototype.reset = function() {
      this.range.value = this.css_default_value;
      return this.$range.trigger('change');
    };

    Range.prototype.link_dom_element_to_wrapper = function(dom_element) {
      return dom_element.o = this;
    };

    Range.prototype.extract_and_save_attributes = function() {
      this.mockup_dom_element = $(this.$range.data('mockup-dom-element'));
      this.css_name = this.$range.data('css-attr-name');
      return this.css_default_value = this.$range.data('default-value');
    };

    Range.prototype.create_and_insert_display = function() {
      this.display = new CssAttributeView(this.css_name);
      return this.$range.before(this.display.dom_element());
    };

    Range.prototype.install_change_handler = function() {
      return this.$range.on('input change', function() {
        return refresh_all();
      });
    };

    Range.prototype.calc_css_value = function(range_value) {
      return RangeConverters.convert(this.css_name, range_value);
    };

    Range.prototype.update_mockup_dom_element = function(css_value) {
      return this.mockup_dom_element.css2(this.css_name, css_value);
    };

    Range.prototype.update_css_attribute_view = function(css_value) {
      return this.display.set_value(css_value);
    };

    return Range;

  })();

  Checkbox = (function() {
    function Checkbox(checkbox) {
      this.checkbox = checkbox;
      this.$checkbox = $(checkbox);
      this.link_dom_element_to_wrapper(checkbox);
      this.extract_and_save_attributes();
      this.create_and_insert_display();
      this.install_change_handler();
    }

    Checkbox.prototype.refresh = function() {
      var checked;
      checked = this.$checkbox.prop('checked');
      if (checked) {
        return this.update_mockup_dom_element(this.css_value);
      }
    };

    Checkbox.prototype.reset = function() {
      this.$checkbox.prop('checked', true);
      return this.$checkbox.trigger('change');
    };

    Checkbox.prototype.link_dom_element_to_wrapper = function(dom_element) {
      return dom_element.o = this;
    };

    Checkbox.prototype.extract_and_save_attributes = function() {
      this.mockup_dom_element = $(this.$checkbox.data('mockup-dom-element'));
      this.css_name = this.$checkbox.data('css-attr-name');
      return this.css_value = this.$checkbox.data('css-attr-value');
    };

    Checkbox.prototype.create_and_insert_display = function() {
      this.display = new CssAttributeView(this.css_name, this.css_value);
      return this.$checkbox.before(this.display.dom_element());
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
        this.display.dom_element().css2('text-decoration', '');
      } else {
        this.mockup_dom_element.css2(this.css_name, '');
        this.display.dom_element().css2('text-decoration', 'line-through');
      }
      return refresh_all();
    };

    Checkbox.prototype.update_mockup_dom_element = function(css_value) {
      return this.mockup_dom_element.css2(this.css_name, css_value);
    };

    return Checkbox;

  })();

  Hidden = (function() {
    function Hidden(hidden) {
      this.$hidden = $(hidden);
      this.link_dom_element_to_wrapper(hidden);
      this.extract_and_save_attributes();
      this.create_and_insert_display();
    }

    Hidden.prototype.refresh = function() {
      return this.mockup_dom_element.css2(this.css_name, this.css_value);
    };

    Hidden.prototype.reset = function() {};

    Hidden.prototype.link_dom_element_to_wrapper = function(dom_element) {
      return dom_element.o = this;
    };

    Hidden.prototype.extract_and_save_attributes = function() {
      this.mockup_dom_element = $(this.$hidden.data('mockup-dom-element'));
      this.css_name = this.$hidden.data('css-attr-name');
      return this.css_value = this.$hidden.data('css-attr-value');
    };

    Hidden.prototype.create_and_insert_display = function() {
      var display;
      display = new CssAttributeView(this.css_name, this.css_value);
      return this.$hidden.before(display.dom_element());
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
