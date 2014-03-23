(function($){
  
  // TODO: not yet refactored
  
  $('div[data-type="range"]').each( function() {

    var element = this.dataset.element;
    var attribute = this.dataset.attribute;
    
    var min = this.dataset.min || -4;
    var max = this.dataset.max || 4;
    var defaultValue = this.dataset.defaultValue || 0;
    var presetValue = this.dataset.presetValue || 0;
    
    var attributeLabel = $("<label>" + (this.dataset.attributeLabel || attribute) + ":</label>");
    var input = $("<input type='text' readonly />");
    var unitsLabel = $("<label>em;</label>");
    var range = $("<input type='range' min='" + min + "' max='" + max + "' />");
    
    $(this).append(attributeLabel).append(input).append(unitsLabel).append(range);
    
    range.on('change', function() {
      f(this.value);
    });
    
    $('#preset-button').on('click', function() {
      f(presetValue);
    });
    
    $('#reset-button').on('click', function() {
      f(defaultValue);
    });
    
    var that = $(this);
    var f = function(value) {
      input.val(value);
      range.val(value);
      $('section[id="example"] ' + element).css(attribute, value + 'em');
      
      if (value == defaultValue) {
          that.removeClass("non-default-value");
      } else {
          that.addClass("non-default-value");
      }
    }

  });
  
  $('#reset-button').click();

})(jQuery);
