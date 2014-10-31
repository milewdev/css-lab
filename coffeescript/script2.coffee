class Converters

  @convert: (css_attr_name, range_value) ->
    convert = Converters["range_to_#{css_attr_name.replace('-', '_')}"]
    convert(range_value)

  @range_to_em: (range_value) ->
    range_value + 'em'

  @range_to_width: @range_to_em
  @range_to_margin: @range_to_em
  @range_to_margin_top: @range_to_em

  @range_to_display: (range_value) ->
    ['none', 'inline', 'inline-block', 'block'][range_value]

  @range_to_float: (range_value) ->
    ['none', 'left', 'right'][range_value]


build_range_handler = (range) ->
  mockup = $(range.data('mockup'))
  css_attr_name = range.data('css-attr-name')
  css_attr_value = this.value
  display = $("<span class='css-code'>#{css_attr_name}: #{css_attr_value};</span>")
  range.before(display)
  ->
    css_value = Converters.convert(css_attr_name, this.value)
    mockup.css(css_attr_name, css_value)
    display.text("#{css_attr_name}: #{css_value};")

build_checkbox_handler = (checkbox) ->
  mockup = $(checkbox.data('mockup'))
  css_attr_name = checkbox.data('css-attr-name')
  css_attr_value = checkbox.data('css-attr-value')
  display = $("<span class='css-code'>#{css_attr_name}: #{css_attr_value};</span>")
  checkbox.before(display)
  ->
    checked = $(this).prop('checked')
    if checked
      mockup.css(css_attr_name, css_attr_value)
      display.css('text-decoration', '')
    else
      mockup.css(css_attr_name, '')
      display.css('text-decoration', 'line-through')

build_hidden = (hidden) ->
  mockup = $(hidden.data('mockup'))
  css_attr_name = hidden.data('css-attr-name')
  css_attr_value = hidden.data('css-attr-value')
  display = $("<span class='css-code'>#{css_attr_name}: #{css_attr_value};</span>")
  hidden.before(display)
  mockup.css(css_attr_name, css_attr_value)

# Use 'input' and 'change'; see http://stackoverflow.com/a/19067260
install_range_handlers = ->
  $("input[type='range']").each ->
    $this = $(this)
    $this.on 'input change', build_range_handler($this)

install_checkbox_handlers = ->
  $("input[type='checkbox']").each ->
    $this = $(this)
    $this.on 'input change', build_checkbox_handler($this)

install_hidden_labels = ->
  $("input[type='hidden']").each ->
    $this = $(this)
    build_hidden($this)

install_button_handlers = ->
  $('#reset').on 'click', ->
    reset()

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

install_range_handlers()
install_checkbox_handlers()
install_hidden_labels()
install_button_handlers()
reset()
