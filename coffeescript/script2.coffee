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
    convert = RangeConverters["range_to_#{css_attr_name.replace('-', '_')}"]
    convert(range_value)

  @range_to_display: (range_value) ->
    ['none', 'inline', 'inline-block', 'block'][range_value]

  @range_to_float: (range_value) ->
    ['none', 'left', 'right'][range_value]

  @range_to_em: (range_value) ->
    range_value + 'em'

  @range_to_margin: @range_to_em
  @range_to_margin_top: @range_to_em
  @range_to_width: @range_to_em


class Range

  constructor: (range) ->
    range.o = this
    @range = range
    @$range = $(range)
    @extract_and_save_attributes()
    @create_and_insert_display()
    @install_change_handler()

  refresh: ->
    css_value = RangeConverters.convert(@css_name, @range.value)
    @mockup_dom_element.css(@css_name, css_value)
    @display.set_value(css_value)

  reset: ->
    @range.value = @css_default_value
    @$range.trigger('change')

  # private

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


#
# CSS attribute switches - these are attributes that we allow the
# user to turn on and off rather than setting a particular value.
#

class Checkbox

  constructor: (checkbox) ->
    checkbox.o = this
    @checkbox = checkbox
    @$checkbox = $(checkbox)
    @extract_and_save_attributes()
    @create_and_insert_display()
    @install_change_handler()

  refresh: ->
    checked = @$checkbox.prop('checked')
    @mockup_dom_element.css(@css_name, @css_value) if checked

  reset: ->
    @$checkbox.prop('checked', true)
    @$checkbox.trigger('change')

  # private

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
      @display.dom_element().css('text-decoration', '') # TODO: extract method strikeout(bool)
    else
      @mockup_dom_element.css(@css_name, '')  # TODO: document why we do this and why only once
      @display.dom_element().css('text-decoration', 'line-through')
    refresh_all()


#
# Readonly css attributes.
#

class Hidden

  constructor: (hidden) ->
    hidden.o = this
    @$hidden = $(hidden)
    @extract_and_save_attributes()
    @create_and_insert_display()

  refresh: ->
    @mockup_dom_element.css(@css_name, @css_value)

  reset: ->
    # readonly so nothing to do

  # private

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
