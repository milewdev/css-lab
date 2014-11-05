class VendorPrefix

  values_that_need_prefixing = ['flex', 'inline-flex']
  cached_prefix = null

  prefix_css_value = (css_value) ->
    if needs_prefixing(css_value)
      "#{prefix()}#{css_value}"
    else
      css_value

  needs_prefixing = (css_value) ->
    css_value in values_that_need_prefixing

  prefix = ->
    cached_prefix ?= derive_prefix()

  derive_prefix = ->
    style = $('body').get(0).style
    switch
      when style.webkitFlex? then '-webkit-'
      when style.mozFlex? then '-moz-'
      when style.msFlex? then '-ms-'
      else ''

  # Note: runs when the class definition is parsed.
  $.fn.css2 = (css_name, css_value) ->
    css_value = prefix_css_value(css_value)
    this.css(css_name, css_value)


class CssAttributeView

  constructor: (css_name, css_value) ->
    @css_name = css_name
    @$dom_element = @create_dom_element()
    @set_value(css_value) if css_value?

  dom_element: ->
    @$dom_element

  set_value: (value) ->
    @$dom_element.text("#{@css_name}: #{value};")

  # private

  create_dom_element: ->
    $("<span class='css-code'></span>")


#
# CSS attribute ranges - these are attributes where we allow the user
# to select a value from a range via a range bar.
#

class RangeConverters

  @convert: (css_attr_name, range_value) ->
    convert = RangeConverters["range_to_#{css_attr_name.replace(/-/g, '_')}"]
    convert(range_value)

  @range_to_align_content: (range_value) ->
    ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'][range_value]

  @range_to_align_items: (range_value) ->
    ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'][range_value]

  @range_to_align_self: (range_value) ->
    ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'][range_value]

  @range_to_display: (range_value) ->
    ['none', 'inline', 'inline-block', 'block', 'inline-flex', 'flex'][range_value]

  @range_to_flex_direction: (range_value) ->
    [ 'row', 'row-reverse', 'column', 'column-reverse' ][range_value]

  @range_to_flex_wrap: (range_value) ->
    [ 'nowrap', 'wrap', 'wrap-reverse' ][range_value]

  @range_to_float: (range_value) ->
    ['none', 'left', 'right'][range_value]

  @range_to_justify_content: (range_value) ->
    ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'][range_value]

  @range_to_em: (range_value) ->
    range_value + 'em'

  @range_to_number: (range_value) ->
    range_value

  @range_to_flex_basis: @range_to_em
  @range_to_flex_grow: @range_to_number
  @range_to_flex_shrink: @range_to_number
  @range_to_margin: @range_to_em
  @range_to_margin_top: @range_to_em
  @range_to_margin_bottom: @range_to_em
  @range_to_margin_left: @range_to_em
  @range_to_margin_right: @range_to_em
  @range_to_order: @range_to_number
  @range_to_padding: @range_to_em
  @range_to_padding_top: @range_to_em
  @range_to_padding_bottom: @range_to_em
  @range_to_padding_left: @range_to_em
  @range_to_padding_right: @range_to_em
  @range_to_width: @range_to_em


class Range

  constructor: (range) ->
    @range = range
    @$range = $(range)
    @link_dom_element_to_wrapper(range)
    @extract_and_save_attributes()
    @create_and_insert_display()
    @install_change_handler()

  refresh: ->
    css_value = @calc_css_value(@range.value)
    @update_mockup_dom_element(css_value)
    @update_css_attribute_view(css_value)

  reset: ->
    @range.value = @css_default_value
    @$range.trigger('change')

  # private

  link_dom_element_to_wrapper: (dom_element) ->
    dom_element.o = this

  extract_and_save_attributes: ->
    @mockup_dom_element = $(@$range.data('mockup-dom-element'))
    @css_name = @$range.data('css-attr-name')
    @css_default_value = @$range.data('default-value')

  create_and_insert_display: ->
    @display = new CssAttributeView(@css_name)
    @$range.before(@display.dom_element())

  install_change_handler: ->
    # Use 'input' and 'change'; see http://stackoverflow.com/a/19067260
    @$range.on 'input change', ->
      refresh_all()

  calc_css_value: (range_value) ->
    RangeConverters.convert(@css_name, range_value)

  update_mockup_dom_element: (css_value) ->
    @mockup_dom_element.css2(@css_name, css_value)

  update_css_attribute_view: (css_value) ->
    @display.set_value(css_value)


#
# CSS attribute switches - these are attributes that we allow the
# user to turn on and off rather than setting a particular value.
#

class Checkbox

  constructor: (checkbox) ->
    @checkbox = checkbox
    @$checkbox = $(checkbox)
    @link_dom_element_to_wrapper(checkbox)
    @extract_and_save_attributes()
    @create_and_insert_display()
    @install_change_handler()

  refresh: ->
    checked = @$checkbox.prop('checked')
    @update_mockup_dom_element(@css_value) if checked

  reset: ->
    @$checkbox.prop('checked', true)
    @$checkbox.trigger('change')

  # private

  link_dom_element_to_wrapper: (dom_element) ->
    dom_element.o = this

  extract_and_save_attributes: ->
    @mockup_dom_element = $(@$checkbox.data('mockup-dom-element'))
    @css_name = @$checkbox.data('css-attr-name')
    @css_value = @$checkbox.data('css-attr-value')

  create_and_insert_display: ->
    @display = new CssAttributeView(@css_name, @css_value)
    @$checkbox.before(@display.dom_element())

  install_change_handler: ->
    @$checkbox.on 'input change', ->
      this.o.on_change()

  on_change: ->
    checked = @$checkbox.prop('checked')  # TODO: extract method checked()
    if checked
      @display.dom_element().css2('text-decoration', '') # TODO: extract method strikeout(bool)
    else
      @mockup_dom_element.css2(@css_name, '')  # TODO: document why we do this and why only once
      @display.dom_element().css2('text-decoration', 'line-through')
    refresh_all()

  update_mockup_dom_element: (css_value) ->
    @mockup_dom_element.css2(@css_name, css_value)


#
# Readonly css attributes.
#

class Hidden

  constructor: (hidden) ->
    @$hidden = $(hidden)
    @link_dom_element_to_wrapper(hidden)
    @extract_and_save_attributes()
    @create_and_insert_display()

  refresh: ->
    @mockup_dom_element.css2(@css_name, @css_value)

  reset: ->
    # readonly so nothing to do

  # private

  link_dom_element_to_wrapper: (dom_element) ->
    dom_element.o = this

  extract_and_save_attributes: ->
    @mockup_dom_element = $(@$hidden.data('mockup-dom-element'))
    @css_name = @$hidden.data('css-attr-name')
    @css_value = @$hidden.data('css-attr-value')

  create_and_insert_display: ->
    display = new CssAttributeView(@css_name, @css_value)
    @$hidden.before(display.dom_element())


# TODO: rename to something better
install_range_handlers = ->
  $("input[type='range']").each ->
    new Range(this)

# TODO: rename to something better
install_checkbox_handlers = ->
  $("input[type='checkbox']").each ->
    new Checkbox(this)

# TODO: rename to something better
install_hidden_labels = ->
  $("input[type='hidden']").each ->
    new Hidden(this)

install_button_handlers = ->
  $('#reset').on 'click', ->
    reset_all()

refresh_all = ->
  $('input').each ->
    this.o.refresh()

reset_all = ->
  $('input').each ->
    this.o.reset()


#
# This code runs when this script is loaded.
#

install_range_handlers()
install_checkbox_handlers()
install_hidden_labels()
install_button_handlers()
reset_all()
