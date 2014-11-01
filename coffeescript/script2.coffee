build_display_text = (css_attr_name, css_attr_value) ->
  "#{css_attr_name}: #{css_attr_value};"

build_display_element = (css_attr_name, css_attr_value) ->
  $("<span class='css-code'>#{build_display_text(css_attr_name, css_attr_value)}</span>")

refresh = ->
  $('input').trigger('refresh')

$.fn.extend
  mockup_element: -> $(this.data('mockup-element'))
  css_name: -> this.data('css-attr-name')
  css_value: -> this.data('css-attr-value')


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
  mockup_element = range.mockup_element()
  css_attr_name = range.css_name()
  css_attr_value = this.value
  display = build_display_element(css_attr_name, css_attr_value)
  range.before(display)
  range.on 'input change', ->
    refresh()
  range.on 'refresh', ->
    css_value = RangeConverters.convert(css_attr_name, this.value)
    mockup_element.css(css_attr_name, css_value)
    display.text(build_display_text(css_attr_name, css_value))

install_range_handlers = ->
  $("input[type='range']").each ->
    $this = $(this)
    build_range_handler($this)
    this.reset = ->
      $this = $(this)
      $this.val($this.data('default-value'))
      $this.trigger('change')


#
# CSS attribute switches - these are attributes that we allow the
# user to turn on and off rather than setting a particular value.
#

build_checkbox_handler = (checkbox) ->
  mockup_element = checkbox.mockup_element()
  css_attr_name = checkbox.css_name()
  css_attr_value = checkbox.css_value()
  display = build_display_element(css_attr_name, css_attr_value)
  checkbox.before(display)
  checkbox.on 'input change', ->
    checked = $(this).prop('checked')
    if checked
      display.css('text-decoration', '')
    else
      mockup_element.css(css_attr_name, '')
      display.css('text-decoration', 'line-through')
    refresh()
  checkbox.on 'refresh', ->
    checked = $(this).prop('checked')
    if checked
      mockup_element.css(css_attr_name, css_attr_value)

install_checkbox_handlers = ->
  $("input[type='checkbox']").each ->
    $this = $(this)
    build_checkbox_handler($this)
    this.reset = ->
      $this = $(this)
      $this.prop('checked', true)
      $this.trigger('change')


#
# Readonly css attributes.
#

build_hidden = (hidden) ->
  mockup_element = hidden.mockup_element()
  css_attr_name = hidden.css_name()
  css_attr_value = hidden.css_value()
  display = build_display_element(css_attr_name, css_attr_value)
  hidden.before(display)
  mockup_element.css(css_attr_name, css_attr_value)

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
    this.reset()

reset_checkboxes = ->
  $("input[type='checkbox']").each ->
    $this = $(this)
    this.reset()

reset = ->
  $('input').each ->
    this.reset?()


#
# Code that runs when this script is loaded.
#

install_range_handlers()
install_checkbox_handlers()
install_hidden_labels()
install_button_handlers()
reset()
