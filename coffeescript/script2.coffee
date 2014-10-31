build_display_text = (css_attr_name, css_attr_value) ->
  "#{css_attr_name}: #{css_attr_value};"

build_display_element = (css_attr_name, css_attr_value) ->
  $("<span class='css-code'>#{build_display_text(css_attr_name, css_attr_value)}</span>")

mock_element_for = (element) ->
  $(element.data('mockup'))

refresh = ->
  $('input').trigger('refresh')


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


# Use 'input' and 'change'; see http://stackoverflow.com/a/19067260
build_range_handler = (range) ->
  mockup = mock_element_for(range)
  css_attr_name = range.data('css-attr-name')
  css_attr_value = this.value
  display = build_display_element(css_attr_name, css_attr_value)
  range.before(display)
  range.on 'input change', ->
    refresh()
  range.on 'refresh', ->
    css_value = RangeConverters.convert(css_attr_name, this.value)
    mockup.css(css_attr_name, css_value)
    display.text(build_display_text(css_attr_name, css_value))

install_range_handlers = ->
  $("input[type='range']").each ->
    $this = $(this)
    build_range_handler($this)


#
# CSS attribute switches - these are attributes that we allow the
# user to turn on and off rather than setting a particular value.
#

build_checkbox_handler = (checkbox) ->
  mockup = mock_element_for(checkbox)
  css_attr_name = checkbox.data('css-attr-name')
  css_attr_value = checkbox.data('css-attr-value')
  display = build_display_element(css_attr_name, css_attr_value)
  checkbox.before(display)
  checkbox.on 'input change', ->
    checked = $(this).prop('checked')
    if checked
      display.css('text-decoration', '')
    else
      mockup.css(css_attr_name, '')
      display.css('text-decoration', 'line-through')
    refresh()
  checkbox.on 'refresh', ->
    checked = $(this).prop('checked')
    if checked
      mockup.css(css_attr_name, css_attr_value)

install_checkbox_handlers = ->
  $("input[type='checkbox']").each ->
    $this = $(this)
    build_checkbox_handler($this)


#
# Readonly css attributes.
#

build_hidden = (hidden) ->
  mockup = mock_element_for(hidden)
  css_attr_name = hidden.data('css-attr-name')
  css_attr_value = hidden.data('css-attr-value')
  display = build_display_element(css_attr_name, css_attr_value)
  hidden.before(display)
  mockup.css(css_attr_name, css_attr_value)

install_hidden_labels = ->
  $("input[type='hidden']").each ->
    $this = $(this)
    build_hidden($this)


#
# Handlers for button click events.
#

install_button_handlers = ->
  $('#reset').on 'click', ->
    reset()


#
# Provide the means to reset all controls to their initial values.
#

reset_ranges = ->
  $('input[data-default-value]').each ->
    $this = $(this)
    $this.val($this.data('default-value'))
    $this.trigger('change')

reset_checkboxes = ->
  $("input[type='checkbox']").each ->
    $this = $(this)
    $this.prop('checked', true)
    $this.trigger('change')

reset = ->
  reset_ranges()
  reset_checkboxes()


#
# Code that runs when this script is loaded.
#

install_range_handlers()
install_checkbox_handlers()
install_hidden_labels()
install_button_handlers()
reset()
