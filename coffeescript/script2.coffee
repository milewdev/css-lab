build_display_text = (css_attr_name, css_attr_value) ->
  "#{css_attr_name}: #{css_attr_value ? ''};"

build_display_element = (css_attr_name, css_attr_value) ->
  $("<span class='css-code'>#{build_display_text(css_attr_name, css_attr_value)}</span>")

refresh_all = ->
  $('input').each ->
    # TODO: remove this 'if'
    if this.o?
      this.o.refresh()
    else
      this.refresh?()

# TODO: rename to reset_all
reset = ->
  $('input').each ->
    # TODO: remove this 'if'
    if this.o?
      this.o.reset()
    else
      this.reset?()

$.fn.extend
  mockup_element: -> $(this.data('mockup-element'))
  css_name: -> this.data('css-attr-name')
  css_value: -> this.data('css-attr-value')
  css_default_value: -> this.data('default-value')


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
    @mockup_element.css(@css_name, css_value)
    @display.text(build_display_text(@css_name, css_value))

  reset: ->
    @range.value = @css_default_value
    @$range.trigger('change')

  # private

  extract_and_save_attributes: ->
    @mockup_element = $(@$range.data('mockup-element'))
    @css_name = @$range.data('css-attr-name')
    @css_default_value = @$range.data('default-value')

  create_and_insert_display: ->
    @display = build_display_element(@css_name)
    @$range.before(@display)

  install_change_handler: ->
    # Use 'input' and 'change'; see http://stackoverflow.com/a/19067260
    @$range.on 'input change', ->
      refresh_all()


# TODO: rename to something better
install_range_handlers = ->
  $("input[type='range']").each ->
    new Range(this)


#
# CSS attribute switches - these are attributes that we allow the
# user to turn on and off rather than setting a particular value.
#

build_checkbox_handler = (checkbox) ->
  $checkbox = $(checkbox)
  mockup_element = $checkbox.mockup_element()
  css_attr_name = $checkbox.css_name()
  css_attr_value = $checkbox.css_value()
  display = build_display_element(css_attr_name, css_attr_value)
  $checkbox.before(display)
  $checkbox.on 'input change', ->
    checked = $(this).prop('checked')
    if checked
      display.css('text-decoration', '')
    else
      mockup_element.css(css_attr_name, '')
      display.css('text-decoration', 'line-through')
    refresh_all()
  checkbox.refresh = ->
    checked = $(this).prop('checked')
    if checked
      mockup_element.css(css_attr_name, css_attr_value)
  checkbox.reset = ->
    $this = $(this)
    $this.prop('checked', true)
    $this.trigger('change')

install_checkbox_handlers = ->
  $("input[type='checkbox']").each ->
    build_checkbox_handler(this)


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
# Code that runs when this script is loaded.
#

install_range_handlers()
install_checkbox_handlers()
install_hidden_labels()
install_button_handlers()
reset()
