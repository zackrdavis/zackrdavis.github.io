(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* DROPDOWN */

(function ($) {

  // Add posibility to scroll to selected option
  // usefull for select for example
  $.fn.scrollTo = function(elem) {
    $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
    return this;
  };

  $.fn.dropdown = function (option) {
    var defaults = {
      inDuration: 300,
      outDuration: 225,
      constrain_width: true, // Constrains width of dropdown to the activator
      hover: false,
      gutter: 0, // Spacing from edge
      belowOrigin: false,
      alignment: 'left'
    };

    this.each(function(){
    var origin = $(this);
    var options = $.extend({}, defaults, option);
    var isFocused = false;

    // Dropdown menu
    var activates = $("#"+ origin.attr('data-activates'));

    function updateOptions() {
      if (origin.data('induration') !== undefined)
        options.inDuration = origin.data('inDuration');
      if (origin.data('outduration') !== undefined)
        options.outDuration = origin.data('outDuration');
      if (origin.data('constrainwidth') !== undefined)
        options.constrain_width = origin.data('constrainwidth');
      if (origin.data('hover') !== undefined)
        options.hover = origin.data('hover');
      if (origin.data('gutter') !== undefined)
        options.gutter = origin.data('gutter');
      if (origin.data('beloworigin') !== undefined)
        options.belowOrigin = origin.data('beloworigin');
      if (origin.data('alignment') !== undefined)
        options.alignment = origin.data('alignment');
    }

    updateOptions();

    // Attach dropdown to its activator
    origin.after(activates);

    /*
      Helper function to position and resize dropdown.
      Used in hover and click handler.
    */
    function placeDropdown(eventType) {
      // Check for simultaneous focus and click events.
      if (eventType === 'focus') {
        isFocused = true;
      }

      // Check html data attributes
      updateOptions();

      // Set Dropdown state
      activates.addClass('active');
      origin.addClass('active');

      // Constrain width
      if (options.constrain_width === true) {
        activates.css('width', origin.outerWidth());

      } else {
        activates.css('white-space', 'nowrap');
      }

      // Offscreen detection
      var windowHeight = window.innerHeight;
      var originHeight = origin.innerHeight();
      var offsetLeft = origin.offset().left;
      var offsetTop = origin.offset().top - $(window).scrollTop();
      var currAlignment = options.alignment;
      var gutterSpacing = 0;
      var leftPosition = 0;

      // Below Origin
      var verticalOffset = 0;
      if (options.belowOrigin === true) {
        verticalOffset = originHeight;
      }

      // Check for scrolling positioned container.
      var scrollOffset = 0;
      var wrapper = origin.parent();
      if (!wrapper.is('body') && wrapper[0].scrollHeight > wrapper[0].clientHeight) {
        scrollOffset = wrapper[0].scrollTop;
      }


      if (offsetLeft + activates.innerWidth() > $(window).width()) {
        // Dropdown goes past screen on right, force right alignment
        currAlignment = 'right';

      } else if (offsetLeft - activates.innerWidth() + origin.innerWidth() < 0) {
        // Dropdown goes past screen on left, force left alignment
        currAlignment = 'left';
      }
      // Vertical bottom offscreen detection
      if (offsetTop + activates.innerHeight() > windowHeight) {
        // If going upwards still goes offscreen, just crop height of dropdown.
        if (offsetTop + originHeight - activates.innerHeight() < 0) {
          var adjustedHeight = windowHeight - offsetTop - verticalOffset;
          activates.css('max-height', adjustedHeight);
        } else {
          // Flow upwards.
          if (!verticalOffset) {
            verticalOffset += originHeight;
          }
          verticalOffset -= activates.innerHeight();
        }
      }

      // Handle edge alignment
      if (currAlignment === 'left') {
        gutterSpacing = options.gutter;
        leftPosition = origin.position().left + gutterSpacing;
      }
      else if (currAlignment === 'right') {
        var offsetRight = origin.position().left + origin.outerWidth() - activates.outerWidth();
        gutterSpacing = -options.gutter;
        leftPosition =  offsetRight + gutterSpacing;
      }

      // Position dropdown
      activates.css({
        position: 'absolute',
        top: origin.position().top + verticalOffset + scrollOffset,
        left: leftPosition
      });


      // Show dropdown
      activates.stop(true, true).css('opacity', 0)
        .slideDown({
        queue: false,
        duration: options.inDuration,
        easing: 'easeOutCubic',
        complete: function() {
          $(this).css('height', '');
        }
      })
        .animate( {opacity: 1}, {queue: false, duration: options.inDuration, easing: 'easeOutSine'});
    }

    function hideDropdown() {
      // Check for simultaneous focus and click events.
      isFocused = false;
      activates.fadeOut(options.outDuration);
      activates.removeClass('active');
      origin.removeClass('active');
      setTimeout(function() { activates.css('max-height', ''); }, options.outDuration);
    }

    // Hover
    if (options.hover) {
      var open = false;
      origin.unbind('click.' + origin.attr('id'));
      // Hover handler to show dropdown
      origin.on('mouseenter', function(e){ // Mouse over
        if (open === false) {
          placeDropdown();
          open = true;
        }
      });
      origin.on('mouseleave', function(e){
        // If hover on origin then to something other than dropdown content, then close
        var toEl = e.toElement || e.relatedTarget; // added browser compatibility for target element
        if(!$(toEl).closest('.dropdown-content').is(activates)) {
          activates.stop(true, true);
          hideDropdown();
          open = false;
        }
      });

      activates.on('mouseleave', function(e){ // Mouse out
        var toEl = e.toElement || e.relatedTarget;
        if(!$(toEl).closest('.dropdown-button').is(origin)) {
          activates.stop(true, true);
          hideDropdown();
          open = false;
        }
      });

    // Click
    } else {
      // Click handler to show dropdown
      origin.unbind('click.' + origin.attr('id'));
      origin.bind('click.'+origin.attr('id'), function(e){
        if (!isFocused) {
          if ( origin[0] == e.currentTarget &&
               !origin.hasClass('active') &&
               ($(e.target).closest('.dropdown-content').length === 0)) {
            e.preventDefault(); // Prevents button click from moving window
            placeDropdown('click');
          }
          // If origin is clicked and menu is open, close menu
          else if (origin.hasClass('active')) {
            hideDropdown();
            $(document).unbind('click.'+ activates.attr('id') + ' touchstart.' + activates.attr('id'));
          }
          // If menu open, add click close handler to document
          if (activates.hasClass('active')) {
            $(document).bind('click.'+ activates.attr('id') + ' touchstart.' + activates.attr('id'), function (e) {
              if (!activates.is(e.target) && !origin.is(e.target) && (!origin.find(e.target).length) ) {
                hideDropdown();
                $(document).unbind('click.'+ activates.attr('id') + ' touchstart.' + activates.attr('id'));
              }
            });
          }
        }
      });

    } // End else

    // Listen to open and close event - useful for select component
    origin.on('open', function(e, eventType) {
      placeDropdown(eventType);
    });
    origin.on('close', hideDropdown);


   });
  }; // End dropdown plugin

  $(document).ready(function(){
    $('.dropdown-button').dropdown();
  });
}( jQuery ));


var dropdownSelectors = $('.dropdown, .dropup');

        // Custom function to read dropdown data
        // =========================
        function dropdownEffectData(target) {
            // @todo - page level global?
            var effectInDefault = null,
                effectOutDefault = null;
            var dropdown = $(target),
                dropdownMenu = $('.dropdown-menu', target);
            var parentUl = dropdown.parents('ul.nav');

            // If parent is ul.nav allow global effect settings
            if (parentUl.height > 0) {
                effectInDefault = parentUl.data('dropdown-in') || null;
                effectOutDefault = parentUl.data('dropdown-out') || null;
            }

            return {
                target: target,
                dropdown: dropdown,
                dropdownMenu: dropdownMenu,
                effectIn: dropdownMenu.data('dropdown-in') || effectInDefault,
                effectOut: dropdownMenu.data('dropdown-out') || effectOutDefault,
            };
        }

        // Custom function to start effect (in or out)
        // =========================
        function dropdownEffectStart(data, effectToStart) {
            if (effectToStart) {
                data.dropdown.addClass('dropdown-animating');
                data.dropdownMenu.addClass('animated');
                data.dropdownMenu.addClass(effectToStart);
            }
        }

        // Custom function to read when animation is over
        // =========================
        function dropdownEffectEnd(data, callbackFunc) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            data.dropdown.one(animationEnd, function () {
                data.dropdown.removeClass('dropdown-animating');
                data.dropdownMenu.removeClass('animated');
                data.dropdownMenu.removeClass(data.effectIn);
                data.dropdownMenu.removeClass(data.effectOut);

                // Custom callback option, used to remove open class in out effect
                if (typeof callbackFunc == 'function') {
                    callbackFunc();
                }
            });
        }

        // Bootstrap API hooks
        // =========================
        dropdownSelectors.on({
            "show.bs.dropdown": function () {
                // On show, start in effect
                var dropdown = dropdownEffectData(this);
                dropdownEffectStart(dropdown, dropdown.effectIn);
            },
            "shown.bs.dropdown": function () {
                // On shown, remove in effect once complete
                var dropdown = dropdownEffectData(this);
                if (dropdown.effectIn && dropdown.effectOut) {
                    dropdownEffectEnd(dropdown, function () {});
                }
            },
            "hide.bs.dropdown": function (e) {
                // On hide, start out effect
                var dropdown = dropdownEffectData(this);
                if (dropdown.effectOut) {
                    e.preventDefault();
                    dropdownEffectStart(dropdown, dropdown.effectOut);
                    dropdownEffectEnd(dropdown, function () {
                        dropdown.dropdown.removeClass('open');
                        dropdown.dropdown.removeClass('show');                        
                    });
                }
            },
        });

},{}],2:[function(require,module,exports){
/* FORMS */

;(function ($) {
  $(document).ready(function () {

    // Function to update labels of text fields
    Materialize.updateTextFields = function () {
      var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea'
      $(input_selector).each(function (index, element) {
        if ($(element).val().length > 0 || element.autofocus || $(this).attr('placeholder') !== undefined || $(element)[0].validity.badInput === true) {
          $(this).siblings('label, i').addClass('active')
        }else {
          $(this).siblings('label, i').removeClass('active')
        }
      })
    }

    // Text based inputs
    var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea'

    // Add active if form auto complete
    $(document).on('change', input_selector, function () {
      if ($(this).val().length !== 0 || $(this).attr('placeholder') !== undefined) {
        $(this).siblings('label').addClass('active')
      }
      validate_field($(this))
    })

    // Add active if input element has been pre-populated on document ready
    $(document).ready(function () {
      Materialize.updateTextFields()
    })

    // HTML DOM FORM RESET handling
    $(document).on('reset', function (e) {
      var formReset = $(e.target)
      if (formReset.is('form')) {
        formReset.find(input_selector).removeClass('valid').removeClass('invalid')
        formReset.find(input_selector).each(function () {
          if ($(this).attr('value') === '') {
            $(this).siblings('label, i').removeClass('active')
          }
        })

        // Reset select
        formReset.find('select.initialized').each(function () {
          var reset_text = formReset.find('option[selected]').text()
          formReset.siblings('input.select-dropdown').val(reset_text)
        })
      }
    })

    // Add active when element has focus
    $(document).on('focus', input_selector, function () {
      $(this).siblings('label, i').addClass('active')
    })

    $(document).on('blur', input_selector, function () {
      var $inputElement = $(this)
      if ($inputElement.val().length === 0 && $inputElement[0].validity.badInput !== true && $inputElement.attr('placeholder') === undefined) {
        $inputElement.siblings('label, i').removeClass('active')
      }

      if ($inputElement.val().length === 0 && $inputElement[0].validity.badInput !== true && $inputElement.attr('placeholder') !== undefined) {
        $inputElement.siblings('i').removeClass('active')
      }
      validate_field($inputElement)
    })

    window.validate_field = function (object) {
      var hasLength = object.attr('length') !== undefined
      var lenAttr = parseInt(object.attr('length'))
      var len = object.val().length

      if (object.val().length === 0 && object[0].validity.badInput === false) {
        if (object.hasClass('validate')) {
          object.removeClass('valid')
          object.removeClass('invalid')
        }
      }else {
        if (object.hasClass('validate')) {
          // Check for character counter attributes
          if ((object.is(':valid') && hasLength && (len <= lenAttr)) || (object.is(':valid') && !hasLength)) {
            object.removeClass('invalid')
            object.addClass('valid')
          }else {
            object.removeClass('valid')
            object.addClass('invalid')
          }
        }
      }
    }

    // Textarea Auto Resize
    var hiddenDiv = $('.hiddendiv').first()
    if (!hiddenDiv.length) {
      hiddenDiv = $('<div class="hiddendiv common"></div>')
      $('body').append(hiddenDiv)
    }
    var text_area_selector = '.materialize-textarea'

    function textareaAutoResize ($textarea) {
      // Set font properties of hiddenDiv

      var fontFamily = $textarea.css('font-family')
      var fontSize = $textarea.css('font-size')

      if (fontSize) { hiddenDiv.css('font-size', fontSize); }
      if (fontFamily) { hiddenDiv.css('font-family', fontFamily); }

      if ($textarea.attr('wrap') === 'off') {
        hiddenDiv.css('overflow-wrap', 'normal')
          .css('white-space', 'pre')
      }

      hiddenDiv.text($textarea.val() + '\n')
      var content = hiddenDiv.html().replace(/\n/g, '<br>')
      hiddenDiv.html(content)

      // When textarea is hidden, width goes crazy.
      // Approximate with half of window size

      if ($textarea.is(':visible')) {
        hiddenDiv.css('width', $textarea.width())
      }else {
        hiddenDiv.css('width', $(window).width() / 2)
      }

      $textarea.css('height', hiddenDiv.height())
    }

    $(text_area_selector).each(function () {
      var $textarea = $(this)
      if ($textarea.val().length) {
        textareaAutoResize($textarea)
      }
    })

    $('body').on('keyup keydown autoresize', text_area_selector, function () {
      textareaAutoResize($(this))
    })

    // File Input Path
    $(document).on('change', '.file-field input[type="file"]', function () {
      var file_field = $(this).closest('.file-field')
      var path_input = file_field.find('input.file-path')
      var files = $(this)[0].files
      var file_names = []
      for (var i = 0; i < files.length; i++) {
        file_names.push(files[i].name)
      }
      path_input.val(file_names.join(', '))
      path_input.trigger('change')
    })

    /****************
    *  Range Input  *
    ****************/

    var range_type = 'input[type=range]'
    var range_mousedown = false
    var left

    $(range_type).each(function () {
      var thumb = $('<span class="thumb"><span class="value"></span></span>')
      $(this).after(thumb)
    })

    var range_wrapper = '.range-field'
    $(document).on('change', range_type, function (e) {
      var thumb = $(this).siblings('.thumb')
      thumb.find('.value').html($(this).val())
    })

    $(document).on('input mousedown touchstart', range_type, function (e) {
      var thumb = $(this).siblings('.thumb')
      var width = $(this).outerWidth()

      // If thumb indicator does not exist yet, create it
      if (thumb.length <= 0) {
        thumb = $('<span class="thumb"><span class="value"></span></span>')
        $(this).after(thumb)
      }

      // Set indicator value
      thumb.find('.value').html($(this).val())

      range_mousedown = true
      $(this).addClass('active')

      if (!thumb.hasClass('active')) {
        thumb.velocity({ height: '30px', width: '30px', top: '-20px', marginLeft: '-15px'}, { duration: 300, easing: 'easeOutExpo' })
      }

      if (e.type !== 'input') {
        if (e.pageX === undefined || e.pageX === null) { // mobile
          left = e.originalEvent.touches[0].pageX - $(this).offset().left
        }else { // desktop
          left = e.pageX - $(this).offset().left
        }
        if (left < 0) {
          left = 0
        }
        else if (left > width) {
          left = width
        }
        thumb.addClass('active').css('left', left)
      }

      thumb.find('.value').html($(this).val())
    })

    $(document).on('mouseup touchend', range_wrapper, function () {
      range_mousedown = false
      $(this).removeClass('active')
    })

    $(document).on('mousemove touchmove', range_wrapper, function (e) {
      var thumb = $(this).children('.thumb')
      var left
      if (range_mousedown) {
        if (!thumb.hasClass('active')) {
          thumb.velocity({ height: '30px', width: '30px', top: '-20px', marginLeft: '-15px'}, { duration: 300, easing: 'easeOutExpo' })
        }
        if (e.pageX === undefined || e.pageX === null) { // mobile
          left = e.originalEvent.touches[0].pageX - $(this).offset().left
        }else { // desktop
          left = e.pageX - $(this).offset().left
        }
        var width = $(this).outerWidth()

        if (left < 0) {
          left = 0
        }
        else if (left > width) {
          left = width
        }
        thumb.addClass('active').css('left', left)
        thumb.find('.value').html(thumb.siblings(range_type).val())
      }
    })

    $(document).on('mouseout touchleave', range_wrapper, function () {
      if (!range_mousedown) {
        var thumb = $(this).children('.thumb')

        if (thumb.hasClass('active')) {
          thumb.velocity({ height: '0', width: '0', top: '10px', marginLeft: '-6px'}, { duration: 100 })
        }
        thumb.removeClass('active')
      }
    })
  }); // End of $(document).ready

  /*******************
   *  Select Plugin  *
   ******************/
  $.fn.material_select = function (callback) {
    $(this).each(function () {
      var $select = $(this)

      if ($select.hasClass('browser-default')) {
        return; // Continue to next (return false breaks out of entire loop)
      }

      var multiple = $select.attr('multiple') ? true : false,
        lastID = $select.data('select-id') // Tear down structure if Select needs to be rebuilt

      if (lastID) {
        $select.parent().find('span.caret').remove()
        $select.parent().find('input').remove()

        $select.unwrap()
        $('ul#select-options-' + lastID).remove()
      }

      // If destroying the select, remove the selelct-id and reset it to it's uninitialized state.
      if (callback === 'destroy') {
        $select.data('select-id', null).removeClass('initialized')
        return
      }

      var uniqueID = Materialize.guid()
      $select.data('select-id', uniqueID)
      var wrapper = $('<div class="select-wrapper"></div>')
      wrapper.addClass($select.attr('class'))
      var options = $('<ul id="select-options-' + uniqueID + '" class="dropdown-content select-dropdown ' + (multiple ? 'multiple-select-dropdown' : '') + '"></ul>'),
        selectChildren = $select.children('option, optgroup'),
        valuesSelected = [],
        optionsHover = false

      var label = $select.find('option:selected').html() || $select.find('option:first').html() || ''

      // Function that renders and appends the option taking into
      // account type and possible image icon.
      var appendOptionWithIcon = function (select, option, type) {
        // Add disabled attr if disabled
        var disabledClass = (option.is(':disabled')) ? 'disabled ' : ''

        // add icons
        var icon_url = option.data('icon')
        var classes = option.attr('class')
        if (!!icon_url) {
          var classString = ''
          if (!!classes) classString = ' class="' + classes + '"'

          // Check for multiple type.
          if (type === 'multiple') {
            options.append($('<li class="' + disabledClass + '"><img src="' + icon_url + '"' + classString + '><span><input type="checkbox"' + disabledClass + '/><label></label>' + option.html() + '</span></li>'))
          } else {
            options.append($('<li class="' + disabledClass + '"><img src="' + icon_url + '"' + classString + '><span>' + option.html() + '</span></li>'))
          }
          return true
        }

        // Check for multiple type.
        if (type === 'multiple') {
          options.append($('<li class="' + disabledClass + '"><span><input type="checkbox"' + disabledClass + '/><label></label>' + option.html() + '</span></li>'))
        } else {
          options.append($('<li class="' + disabledClass + '"><span>' + option.html() + '</span></li>'))
        }
      }

      /* Create dropdown structure. */
      if (selectChildren.length) {
        selectChildren.each(function () {
          if ($(this).is('option')) {
            // Direct descendant option.
            if (multiple) {
              appendOptionWithIcon($select, $(this), 'multiple')
            } else {
              appendOptionWithIcon($select, $(this))
            }
          } else if ($(this).is('optgroup')) {
            // Optgroup.
            var selectOptions = $(this).children('option')
            options.append($('<li class="optgroup"><span>' + $(this).attr('label') + '</span></li>'))

            selectOptions.each(function () {
              appendOptionWithIcon($select, $(this))
            })
          }
        })
      }

      options.find('li:not(.optgroup)').each(function (i) {
        $(this).click(function (e) {
          // Check if option element is disabled
          if (!$(this).hasClass('disabled') && !$(this).hasClass('optgroup')) {
            var selected = true

            if (multiple) {
              $('input[type="checkbox"]', this).prop('checked', function (i, v) { return !v; })
              selected = toggleEntryFromArray(valuesSelected, $(this).index(), $select)
              $newSelect.trigger('focus')
            } else {
              options.find('li').removeClass('active')
              $(this).toggleClass('active')
              $newSelect.val($(this).text())
            }

            activateOption(options, $(this))
            $select.find('option').eq(i).prop('selected', selected)
            // Trigger onchange() event
            $select.trigger('change')
            if (typeof callback !== 'undefined') callback()
          }

          e.stopPropagation()
        })
      })

      // Wrap Elements
      $select.wrap(wrapper)
      // Add Select Display Element
      var dropdownIcon = $('<span class="caret">&#9660;</span>')
      if ($select.is(':disabled'))
        dropdownIcon.addClass('disabled')

      // escape double quotes
      var sanitizedLabelHtml = label.replace(/"/g, '&quot;')

      var $newSelect = $('<input type="text" class="select-dropdown" readonly="true" ' + (($select.is(':disabled')) ? 'disabled' : '') + ' data-activates="select-options-' + uniqueID + '" value="' + sanitizedLabelHtml + '"/>')
      $select.before($newSelect)
      $newSelect.before(dropdownIcon)

      $newSelect.after(options)
      // Check if section element is disabled
      if (!$select.is(':disabled')) {
        $newSelect.dropdown({'hover': false, 'closeOnClick': false})
      }

      // Copy tabindex
      if ($select.attr('tabindex')) {
        $($newSelect[0]).attr('tabindex', $select.attr('tabindex'))
      }

      $select.addClass('initialized')

      $newSelect.on({
        'focus': function () {
          if ($('ul.select-dropdown').not(options[0]).is(':visible')) {
            $('input.select-dropdown').trigger('close')
          }
          if (!options.is(':visible')) {
            $(this).trigger('open', ['focus'])
            var label = $(this).val()
            var selectedOption = options.find('li').filter(function () {
              return $(this).text().toLowerCase() === label.toLowerCase()
            })[0]
            activateOption(options, selectedOption)
          }
        },
        'touchend click': function (e) {
          e.stopPropagation()
        }
      })

      $newSelect.on('blur', function () {
        if (!multiple) {
          $(this).trigger('close')
        }
        options.find('li.selected').removeClass('selected')
      })

      options.hover(function () {
        optionsHover = true
      }, function () {
        optionsHover = false
      })

      $(window).on({
        'click': function () {
          multiple && (optionsHover || $newSelect.trigger('close'))
        }
      })

      // Add initial multiple selections.
      if (multiple) {
        $select.find('option:selected:not(:disabled)').each(function () {
          var index = $(this).index()

          toggleEntryFromArray(valuesSelected, index, $select)
          options.find('li').eq(index).find(':checkbox').prop('checked', true)
        })
      }

      // Make option as selected and scroll to selected position
      activateOption = function (collection, newOption) {
        if (newOption) {
          collection.find('li.selected').removeClass('selected')
          var option = $(newOption)
          option.addClass('selected')
          options.scrollTo(option)
        }
      }

      // Allow user to search by typing
      // this array is cleared after 1 second
      var filterQuery = [],
        onKeyDown = function (e) {
          // TAB - switch to another input
          if (e.which == 9) {
            $newSelect.trigger('close')
            return
          }

          // ARROW DOWN WHEN SELECT IS CLOSED - open select options
          if (e.which == 40 && !options.is(':visible')) {
            $newSelect.trigger('open')
            return
          }

          // ENTER WHEN SELECT IS CLOSED - submit form
          if (e.which == 13 && !options.is(':visible')) {
            return
          }

          e.preventDefault()

          // CASE WHEN USER TYPE LETTERS
          var letter = String.fromCharCode(e.which).toLowerCase(),
            nonLetters = [9, 13, 27, 38, 40]
          if (letter && (nonLetters.indexOf(e.which) === -1)) {
            filterQuery.push(letter)

            var string = filterQuery.join(''),
              newOption = options.find('li').filter(function () {
                return $(this).text().toLowerCase().indexOf(string) === 0
              })[0]

            if (newOption) {
              activateOption(options, newOption)
            }
          }

          // ENTER - select option and close when select options are opened
          if (e.which == 13) {
            var activeOption = options.find('li.selected:not(.disabled)')[0]
            if (activeOption) {
              $(activeOption).trigger('click')
              if (!multiple) {
                $newSelect.trigger('close')
              }
            }
          }

          // ARROW DOWN - move to next not disabled option
          if (e.which == 40) {
            if (options.find('li.selected').length) {
              newOption = options.find('li.selected').next('li:not(.disabled)')[0]
            } else {
              newOption = options.find('li:not(.disabled)')[0]
            }
            activateOption(options, newOption)
          }

          // ESC - close options
          if (e.which == 27) {
            $newSelect.trigger('close')
          }

          // ARROW UP - move to previous not disabled option
          if (e.which == 38) {
            newOption = options.find('li.selected').prev('li:not(.disabled)')[0]
            if (newOption)
              activateOption(options, newOption)
          }

          // Automaticaly clean filter query so user can search again by starting letters
          setTimeout(function () { filterQuery = []; }, 1000)
      }

      $newSelect.on('keydown', onKeyDown)
    })

    function toggleEntryFromArray (entriesArray, entryIndex, select) {
      var index = entriesArray.indexOf(entryIndex),
        notAdded = index === -1

      if (notAdded) {
        entriesArray.push(entryIndex)
      } else {
        entriesArray.splice(index, 1)
      }

      select.siblings('ul.dropdown-content').find('li').eq(entryIndex).toggleClass('active')

      // use notAdded instead of true (to detect if the option is selected or not)
      select.find('option').eq(entryIndex).prop('selected', notAdded)
      setValueToInput(entriesArray, select)

      return notAdded
    }

    function setValueToInput (entriesArray, select) {
      var value = ''

      for (var i = 0, count = entriesArray.length; i < count; i++) {
        var text = select.find('option').eq(entriesArray[i]).text()

        i === 0 ? value += text : value += ', ' + text
      }

      if (value === '') {
        value = select.find('option:disabled').eq(0).text()
      }

      select.siblings('input.select-dropdown').val(value)
    }
  }
}(jQuery));

jQuery('select').siblings('input.select-dropdown').on('mousedown', function (e) {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    if (e.clientX >= e.target.clientWidth || e.clientY >= e.target.clientHeight) {
      e.preventDefault()
    }
  }
});

},{}],3:[function(require,module,exports){
// Required for Meteor package, the use of window prevents export by Meteor
(function(window){
  if(window.Package){
    Materialize = {};
  } else {
    window.Materialize = {};
  }
})(window);


// Unique ID
Materialize.guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

Materialize.elementOrParentIsFixed = function(element) {
    var $element = $(element);
    var $checkElements = $element.add($element.parents());
    var isFixed = false;
    $checkElements.each(function(){
        if ($(this).css("position") === "fixed") {
            isFixed = true;
            return false;
        }
    });
    return isFixed;
};

// Velocity has conflicts when loaded with jQuery, this will check for it
var Vel;
if ($) {
  Vel = $.Velocity;
} else if (jQuery) {
  Vel = jQuery.Velocity;
} else {
  Vel = Velocity;
}

},{}],4:[function(require,module,exports){
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
},{}],5:[function(require,module,exports){
'use strict';

// material_select
// no simple way to manage these dumb MDBootstrap components
require('mdbootstrap/js/modules/global');
require('mdbootstrap/js/modules/jquery-easing');
require('mdbootstrap/js/modules/dropdown');
require('mdbootstrap/js/modules/forms');

// augments MDBootstrap's material_select()
window.accelSelect = function ($selector) {
  $selector.each(function () {
    var $selectEl = $(this);
    var initSelectedIndex = $selectEl.find('option[selected]').index();

    $selectEl.material_select();

    // add 'active' class to initial selection
    $selectEl.siblings('ul').find('li').eq(initSelectedIndex).addClass('active selected');

    applyOptionClasses($selectEl);

    $selectEl.on('change', function () {
      updateSelect($selectEl);
    });
  });
};

// applies classes on <option> to matching created <li>
function applyOptionClasses($selectEl) {
  $selectEl.find('option').each(function () {
    var classes = $(this).attr('class');
    var optionIndex = $(this).index();

    $selectEl.siblings('ul').find('li').eq(optionIndex).addClass(classes);
  });
}

// update 1st <li> with selection
function updateSelect($selectEl) {
  var $selectUl = $selectEl.siblings('ul');

  $selectUl.find('li:first-child').remove();
  $selectUl.find('li.selected').clone().removeClass().addClass('disabled').prependTo($selectUl);
}

},{"mdbootstrap/js/modules/dropdown":1,"mdbootstrap/js/modules/forms":2,"mdbootstrap/js/modules/global":3,"mdbootstrap/js/modules/jquery-easing":4}],6:[function(require,module,exports){
'use strict';

require('dropdown');

$(function () {
  accelSelect($('.mdb-select'));
});

},{"dropdown":5}],7:[function(require,module,exports){
'use strict';

require('lang-select');

$(function () {
  var pageClass = '.page-login';
  var $win = $(window);
  var $header = $(pageClass + '__header');
  var $footer = $(pageClass + '__footer');
  var $body = $(pageClass + '__body');
  var $helpScrim = $(pageClass + '__desktop-help-scrim');
  var $helpPanel = $(pageClass + '__desktop-help-panel');

  // Global
  // on desktop, when content is tall, change footer to position
  // relative so content and footer don't intersect
  if ($body.hasClass('is-relative')) {
    var checkContentHeight = function checkContentHeight() {
      if ($win.width() < 768) return;
      var pad = 200;
      var availH = $win.height() - ($header.height() + $footer.height()) - pad;
      $footer.toggleClass('is-fixed', availH > $body.height());
    };

    $win.on('resize', _.debounce(checkContentHeight, 200));
    checkContentHeight();
  }

  // desktop help menu link
  $(pageClass + '__help-prompt').on('click', function (e) {
    e.preventDefault();
    showLoginHelpPanel();
  });

  $helpScrim.on('click', hideLoginHelpPanel);

  // desktop help close panel link
  $(pageClass + '__desktop-help-panel-header').on('click', function (e) {
    e.preventDefault();
    hideLoginHelpPanel();
  });

  function showLoginHelpPanel() {
    $helpScrim.addClass('active');
    $helpPanel.addClass('active');
  }

  function hideLoginHelpPanel() {
    $helpScrim.removeClass('active');
    $helpPanel.removeClass('active');
  }

  // Role Select
  // hide bottom border of the item above that which is hovered
  // and dim non-selected items
  $(pageClass + '__role-list-item').hover(function (e) {
    $(e.currentTarget).prev().addClass('no-border');
    $(e.currentTarget).siblings().addClass('deselected');
  }, function (e) {
    $(e.currentTarget).prev().removeClass('no-border');
    $(e.currentTarget).siblings().removeClass('deselected');
  });
});

},{"lang-select":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJvd2VyX2NvbXBvbmVudHMvbWRib290c3RyYXAvanMvbW9kdWxlcy9kcm9wZG93bi5qcyIsIm5vZGVfbW9kdWxlcy9AYm93ZXJfY29tcG9uZW50cy9tZGJvb3RzdHJhcC9qcy9tb2R1bGVzL2Zvcm1zLmpzIiwibm9kZV9tb2R1bGVzL0Bib3dlcl9jb21wb25lbnRzL21kYm9vdHN0cmFwL2pzL21vZHVsZXMvZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL0Bib3dlcl9jb21wb25lbnRzL21kYm9vdHN0cmFwL2pzL21vZHVsZXMvanF1ZXJ5LWVhc2luZy5qcyIsInNyYy9qcy9kcm9wZG93bi5qcyIsInNyYy9qcy9sYW5nLXNlbGVjdC5qcyIsInNyYy9qcy9sb2dpbi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVNQTtBQUNBO0FBQ0EsUUFBUSwrQkFBUjtBQUNBLFFBQVEsc0NBQVI7QUFDQSxRQUFRLGlDQUFSO0FBQ0EsUUFBUSw4QkFBUjs7QUFFQTtBQUNBLE9BQU8sV0FBUCxHQUFxQixVQUFTLFNBQVQsRUFBb0I7QUFDdkMsWUFBVSxJQUFWLENBQWdCLFlBQVc7QUFDekIsUUFBSSxZQUFZLEVBQUUsSUFBRixDQUFoQjtBQUNBLFFBQUksb0JBQW9CLFVBQVUsSUFBVixDQUFlLGtCQUFmLEVBQW1DLEtBQW5DLEVBQXhCOztBQUVBLGNBQVUsZUFBVjs7QUFFQTtBQUNBLGNBQ0csUUFESCxDQUNZLElBRFosRUFFRyxJQUZILENBRVEsSUFGUixFQUdHLEVBSEgsQ0FHTSxpQkFITixFQUlHLFFBSkgsQ0FJWSxpQkFKWjs7QUFNQSx1QkFBbUIsU0FBbkI7O0FBRUEsY0FBVSxFQUFWLENBQWEsUUFBYixFQUF1QixZQUFNO0FBQzNCLG1CQUFhLFNBQWI7QUFDRCxLQUZEO0FBR0QsR0FsQkQ7QUFtQkQsQ0FwQkQ7O0FBc0JBO0FBQ0EsU0FBUyxrQkFBVCxDQUE0QixTQUE1QixFQUF1QztBQUNyQyxZQUFVLElBQVYsQ0FBZSxRQUFmLEVBQXlCLElBQXpCLENBQStCLFlBQVc7QUFDeEMsUUFBSSxVQUFVLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxPQUFiLENBQWQ7QUFDQSxRQUFJLGNBQWMsRUFBRSxJQUFGLEVBQVEsS0FBUixFQUFsQjs7QUFFQSxjQUNHLFFBREgsQ0FDWSxJQURaLEVBRUcsSUFGSCxDQUVRLElBRlIsRUFHRyxFQUhILENBR00sV0FITixFQUlHLFFBSkgsQ0FJWSxPQUpaO0FBS0QsR0FURDtBQVVEOztBQUVEO0FBQ0EsU0FBUyxZQUFULENBQXNCLFNBQXRCLEVBQWlDO0FBQy9CLE1BQUksWUFBWSxVQUFVLFFBQVYsQ0FBbUIsSUFBbkIsQ0FBaEI7O0FBRUEsWUFDRyxJQURILENBQ1EsZ0JBRFIsRUFFRyxNQUZIO0FBR0EsWUFDRyxJQURILENBQ1EsYUFEUixFQUVHLEtBRkgsR0FHRyxXQUhILEdBSUcsUUFKSCxDQUlZLFVBSlosRUFLRyxTQUxILENBS2EsU0FMYjtBQU1EOzs7OztBQ3pERCxRQUFRLFVBQVI7O0FBRUEsRUFBRSxZQUFNO0FBQ04sY0FBWSxFQUFFLGFBQUYsQ0FBWjtBQUNELENBRkQ7Ozs7O0FDRkEsUUFBUSxhQUFSOztBQUVBLEVBQUUsWUFBTTtBQUNOLE1BQU0sWUFBWSxhQUFsQjtBQUNBLE1BQU0sT0FBTyxFQUFFLE1BQUYsQ0FBYjtBQUNBLE1BQU0sVUFBVSxFQUFFLFlBQVksVUFBZCxDQUFoQjtBQUNBLE1BQU0sVUFBVSxFQUFFLFlBQVksVUFBZCxDQUFoQjtBQUNBLE1BQU0sUUFBUSxFQUFFLFlBQVksUUFBZCxDQUFkO0FBQ0EsTUFBTSxhQUFhLEVBQUUsWUFBWSxzQkFBZCxDQUFuQjtBQUNBLE1BQU0sYUFBYSxFQUFFLFlBQVksc0JBQWQsQ0FBbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBRyxNQUFNLFFBQU4sQ0FBZSxhQUFmLENBQUgsRUFBa0M7QUFDaEMsUUFBTSxxQkFBcUIsU0FBckIsa0JBQXFCLEdBQU07QUFDL0IsVUFBRyxLQUFLLEtBQUwsS0FBZSxHQUFsQixFQUF1QjtBQUN2QixVQUFJLE1BQU0sR0FBVjtBQUNBLFVBQUksU0FBUyxLQUFLLE1BQUwsTUFBaUIsUUFBUSxNQUFSLEtBQW1CLFFBQVEsTUFBUixFQUFwQyxJQUF3RCxHQUFyRTtBQUNBLGNBQVEsV0FBUixDQUFvQixVQUFwQixFQUFpQyxTQUFTLE1BQU0sTUFBTixFQUExQztBQUNELEtBTEQ7O0FBT0EsU0FBSyxFQUFMLENBQVEsUUFBUixFQUFrQixFQUFFLFFBQUYsQ0FBVyxrQkFBWCxFQUErQixHQUEvQixDQUFsQjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQSxJQUFFLFlBQVksZUFBZCxFQUErQixFQUEvQixDQUFrQyxPQUFsQyxFQUEyQyxhQUFLO0FBQzlDLE1BQUUsY0FBRjtBQUNBO0FBQ0QsR0FIRDs7QUFLQSxhQUFXLEVBQVgsQ0FBYyxPQUFkLEVBQXVCLGtCQUF2Qjs7QUFFQTtBQUNBLElBQUUsWUFBWSw2QkFBZCxFQUE2QyxFQUE3QyxDQUFnRCxPQUFoRCxFQUF5RCxhQUFLO0FBQzVELE1BQUUsY0FBRjtBQUNBO0FBQ0QsR0FIRDs7QUFLQSxXQUFTLGtCQUFULEdBQThCO0FBQzVCLGVBQVcsUUFBWCxDQUFvQixRQUFwQjtBQUNBLGVBQVcsUUFBWCxDQUFvQixRQUFwQjtBQUNEOztBQUVELFdBQVMsa0JBQVQsR0FBOEI7QUFDNUIsZUFBVyxXQUFYLENBQXVCLFFBQXZCO0FBQ0EsZUFBVyxXQUFYLENBQXVCLFFBQXZCO0FBQ0Q7O0FBR0Q7QUFDQTtBQUNBO0FBQ0EsSUFBRSxZQUFZLGtCQUFkLEVBQWtDLEtBQWxDLENBQXdDLGFBQUs7QUFDM0MsTUFBRSxFQUFFLGFBQUosRUFBbUIsSUFBbkIsR0FBMEIsUUFBMUIsQ0FBbUMsV0FBbkM7QUFDQSxNQUFFLEVBQUUsYUFBSixFQUFtQixRQUFuQixHQUE4QixRQUE5QixDQUF1QyxZQUF2QztBQUNELEdBSEQsRUFHRyxhQUFLO0FBQ04sTUFBRSxFQUFFLGFBQUosRUFBbUIsSUFBbkIsR0FBMEIsV0FBMUIsQ0FBc0MsV0FBdEM7QUFDQSxNQUFFLEVBQUUsYUFBSixFQUFtQixRQUFuQixHQUE4QixXQUE5QixDQUEwQyxZQUExQztBQUNELEdBTkQ7QUFPRCxDQTNERCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBEUk9QRE9XTiAqL1xyXG5cclxuKGZ1bmN0aW9uICgkKSB7XHJcblxyXG4gIC8vIEFkZCBwb3NpYmlsaXR5IHRvIHNjcm9sbCB0byBzZWxlY3RlZCBvcHRpb25cclxuICAvLyB1c2VmdWxsIGZvciBzZWxlY3QgZm9yIGV4YW1wbGVcclxuICAkLmZuLnNjcm9sbFRvID0gZnVuY3Rpb24oZWxlbSkge1xyXG4gICAgJCh0aGlzKS5zY3JvbGxUb3AoJCh0aGlzKS5zY3JvbGxUb3AoKSAtICQodGhpcykub2Zmc2V0KCkudG9wICsgJChlbGVtKS5vZmZzZXQoKS50b3ApO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgJC5mbi5kcm9wZG93biA9IGZ1bmN0aW9uIChvcHRpb24pIHtcclxuICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgaW5EdXJhdGlvbjogMzAwLFxyXG4gICAgICBvdXREdXJhdGlvbjogMjI1LFxyXG4gICAgICBjb25zdHJhaW5fd2lkdGg6IHRydWUsIC8vIENvbnN0cmFpbnMgd2lkdGggb2YgZHJvcGRvd24gdG8gdGhlIGFjdGl2YXRvclxyXG4gICAgICBob3ZlcjogZmFsc2UsXHJcbiAgICAgIGd1dHRlcjogMCwgLy8gU3BhY2luZyBmcm9tIGVkZ2VcclxuICAgICAgYmVsb3dPcmlnaW46IGZhbHNlLFxyXG4gICAgICBhbGlnbm1lbnQ6ICdsZWZ0J1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgIHZhciBvcmlnaW4gPSAkKHRoaXMpO1xyXG4gICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbik7XHJcbiAgICB2YXIgaXNGb2N1c2VkID0gZmFsc2U7XHJcblxyXG4gICAgLy8gRHJvcGRvd24gbWVudVxyXG4gICAgdmFyIGFjdGl2YXRlcyA9ICQoXCIjXCIrIG9yaWdpbi5hdHRyKCdkYXRhLWFjdGl2YXRlcycpKTtcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVPcHRpb25zKCkge1xyXG4gICAgICBpZiAob3JpZ2luLmRhdGEoJ2luZHVyYXRpb24nKSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIG9wdGlvbnMuaW5EdXJhdGlvbiA9IG9yaWdpbi5kYXRhKCdpbkR1cmF0aW9uJyk7XHJcbiAgICAgIGlmIChvcmlnaW4uZGF0YSgnb3V0ZHVyYXRpb24nKSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIG9wdGlvbnMub3V0RHVyYXRpb24gPSBvcmlnaW4uZGF0YSgnb3V0RHVyYXRpb24nKTtcclxuICAgICAgaWYgKG9yaWdpbi5kYXRhKCdjb25zdHJhaW53aWR0aCcpICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgb3B0aW9ucy5jb25zdHJhaW5fd2lkdGggPSBvcmlnaW4uZGF0YSgnY29uc3RyYWlud2lkdGgnKTtcclxuICAgICAgaWYgKG9yaWdpbi5kYXRhKCdob3ZlcicpICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgb3B0aW9ucy5ob3ZlciA9IG9yaWdpbi5kYXRhKCdob3ZlcicpO1xyXG4gICAgICBpZiAob3JpZ2luLmRhdGEoJ2d1dHRlcicpICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgb3B0aW9ucy5ndXR0ZXIgPSBvcmlnaW4uZGF0YSgnZ3V0dGVyJyk7XHJcbiAgICAgIGlmIChvcmlnaW4uZGF0YSgnYmVsb3dvcmlnaW4nKSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIG9wdGlvbnMuYmVsb3dPcmlnaW4gPSBvcmlnaW4uZGF0YSgnYmVsb3dvcmlnaW4nKTtcclxuICAgICAgaWYgKG9yaWdpbi5kYXRhKCdhbGlnbm1lbnQnKSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIG9wdGlvbnMuYWxpZ25tZW50ID0gb3JpZ2luLmRhdGEoJ2FsaWdubWVudCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU9wdGlvbnMoKTtcclxuXHJcbiAgICAvLyBBdHRhY2ggZHJvcGRvd24gdG8gaXRzIGFjdGl2YXRvclxyXG4gICAgb3JpZ2luLmFmdGVyKGFjdGl2YXRlcyk7XHJcblxyXG4gICAgLypcclxuICAgICAgSGVscGVyIGZ1bmN0aW9uIHRvIHBvc2l0aW9uIGFuZCByZXNpemUgZHJvcGRvd24uXHJcbiAgICAgIFVzZWQgaW4gaG92ZXIgYW5kIGNsaWNrIGhhbmRsZXIuXHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gcGxhY2VEcm9wZG93bihldmVudFR5cGUpIHtcclxuICAgICAgLy8gQ2hlY2sgZm9yIHNpbXVsdGFuZW91cyBmb2N1cyBhbmQgY2xpY2sgZXZlbnRzLlxyXG4gICAgICBpZiAoZXZlbnRUeXBlID09PSAnZm9jdXMnKSB7XHJcbiAgICAgICAgaXNGb2N1c2VkID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ2hlY2sgaHRtbCBkYXRhIGF0dHJpYnV0ZXNcclxuICAgICAgdXBkYXRlT3B0aW9ucygpO1xyXG5cclxuICAgICAgLy8gU2V0IERyb3Bkb3duIHN0YXRlXHJcbiAgICAgIGFjdGl2YXRlcy5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgIG9yaWdpbi5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAvLyBDb25zdHJhaW4gd2lkdGhcclxuICAgICAgaWYgKG9wdGlvbnMuY29uc3RyYWluX3dpZHRoID09PSB0cnVlKSB7XHJcbiAgICAgICAgYWN0aXZhdGVzLmNzcygnd2lkdGgnLCBvcmlnaW4ub3V0ZXJXaWR0aCgpKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWN0aXZhdGVzLmNzcygnd2hpdGUtc3BhY2UnLCAnbm93cmFwJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE9mZnNjcmVlbiBkZXRlY3Rpb25cclxuICAgICAgdmFyIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgdmFyIG9yaWdpbkhlaWdodCA9IG9yaWdpbi5pbm5lckhlaWdodCgpO1xyXG4gICAgICB2YXIgb2Zmc2V0TGVmdCA9IG9yaWdpbi5vZmZzZXQoKS5sZWZ0O1xyXG4gICAgICB2YXIgb2Zmc2V0VG9wID0gb3JpZ2luLm9mZnNldCgpLnRvcCAtICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuICAgICAgdmFyIGN1cnJBbGlnbm1lbnQgPSBvcHRpb25zLmFsaWdubWVudDtcclxuICAgICAgdmFyIGd1dHRlclNwYWNpbmcgPSAwO1xyXG4gICAgICB2YXIgbGVmdFBvc2l0aW9uID0gMDtcclxuXHJcbiAgICAgIC8vIEJlbG93IE9yaWdpblxyXG4gICAgICB2YXIgdmVydGljYWxPZmZzZXQgPSAwO1xyXG4gICAgICBpZiAob3B0aW9ucy5iZWxvd09yaWdpbiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gb3JpZ2luSGVpZ2h0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVjayBmb3Igc2Nyb2xsaW5nIHBvc2l0aW9uZWQgY29udGFpbmVyLlxyXG4gICAgICB2YXIgc2Nyb2xsT2Zmc2V0ID0gMDtcclxuICAgICAgdmFyIHdyYXBwZXIgPSBvcmlnaW4ucGFyZW50KCk7XHJcbiAgICAgIGlmICghd3JhcHBlci5pcygnYm9keScpICYmIHdyYXBwZXJbMF0uc2Nyb2xsSGVpZ2h0ID4gd3JhcHBlclswXS5jbGllbnRIZWlnaHQpIHtcclxuICAgICAgICBzY3JvbGxPZmZzZXQgPSB3cmFwcGVyWzBdLnNjcm9sbFRvcDtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGlmIChvZmZzZXRMZWZ0ICsgYWN0aXZhdGVzLmlubmVyV2lkdGgoKSA+ICQod2luZG93KS53aWR0aCgpKSB7XHJcbiAgICAgICAgLy8gRHJvcGRvd24gZ29lcyBwYXN0IHNjcmVlbiBvbiByaWdodCwgZm9yY2UgcmlnaHQgYWxpZ25tZW50XHJcbiAgICAgICAgY3VyckFsaWdubWVudCA9ICdyaWdodCc7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKG9mZnNldExlZnQgLSBhY3RpdmF0ZXMuaW5uZXJXaWR0aCgpICsgb3JpZ2luLmlubmVyV2lkdGgoKSA8IDApIHtcclxuICAgICAgICAvLyBEcm9wZG93biBnb2VzIHBhc3Qgc2NyZWVuIG9uIGxlZnQsIGZvcmNlIGxlZnQgYWxpZ25tZW50XHJcbiAgICAgICAgY3VyckFsaWdubWVudCA9ICdsZWZ0JztcclxuICAgICAgfVxyXG4gICAgICAvLyBWZXJ0aWNhbCBib3R0b20gb2Zmc2NyZWVuIGRldGVjdGlvblxyXG4gICAgICBpZiAob2Zmc2V0VG9wICsgYWN0aXZhdGVzLmlubmVySGVpZ2h0KCkgPiB3aW5kb3dIZWlnaHQpIHtcclxuICAgICAgICAvLyBJZiBnb2luZyB1cHdhcmRzIHN0aWxsIGdvZXMgb2Zmc2NyZWVuLCBqdXN0IGNyb3AgaGVpZ2h0IG9mIGRyb3Bkb3duLlxyXG4gICAgICAgIGlmIChvZmZzZXRUb3AgKyBvcmlnaW5IZWlnaHQgLSBhY3RpdmF0ZXMuaW5uZXJIZWlnaHQoKSA8IDApIHtcclxuICAgICAgICAgIHZhciBhZGp1c3RlZEhlaWdodCA9IHdpbmRvd0hlaWdodCAtIG9mZnNldFRvcCAtIHZlcnRpY2FsT2Zmc2V0O1xyXG4gICAgICAgICAgYWN0aXZhdGVzLmNzcygnbWF4LWhlaWdodCcsIGFkanVzdGVkSGVpZ2h0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gRmxvdyB1cHdhcmRzLlxyXG4gICAgICAgICAgaWYgKCF2ZXJ0aWNhbE9mZnNldCkge1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCArPSBvcmlnaW5IZWlnaHQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCAtPSBhY3RpdmF0ZXMuaW5uZXJIZWlnaHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEhhbmRsZSBlZGdlIGFsaWdubWVudFxyXG4gICAgICBpZiAoY3VyckFsaWdubWVudCA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgZ3V0dGVyU3BhY2luZyA9IG9wdGlvbnMuZ3V0dGVyO1xyXG4gICAgICAgIGxlZnRQb3NpdGlvbiA9IG9yaWdpbi5wb3NpdGlvbigpLmxlZnQgKyBndXR0ZXJTcGFjaW5nO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGN1cnJBbGlnbm1lbnQgPT09ICdyaWdodCcpIHtcclxuICAgICAgICB2YXIgb2Zmc2V0UmlnaHQgPSBvcmlnaW4ucG9zaXRpb24oKS5sZWZ0ICsgb3JpZ2luLm91dGVyV2lkdGgoKSAtIGFjdGl2YXRlcy5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgZ3V0dGVyU3BhY2luZyA9IC1vcHRpb25zLmd1dHRlcjtcclxuICAgICAgICBsZWZ0UG9zaXRpb24gPSAgb2Zmc2V0UmlnaHQgKyBndXR0ZXJTcGFjaW5nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQb3NpdGlvbiBkcm9wZG93blxyXG4gICAgICBhY3RpdmF0ZXMuY3NzKHtcclxuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgICB0b3A6IG9yaWdpbi5wb3NpdGlvbigpLnRvcCArIHZlcnRpY2FsT2Zmc2V0ICsgc2Nyb2xsT2Zmc2V0LFxyXG4gICAgICAgIGxlZnQ6IGxlZnRQb3NpdGlvblxyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICAvLyBTaG93IGRyb3Bkb3duXHJcbiAgICAgIGFjdGl2YXRlcy5zdG9wKHRydWUsIHRydWUpLmNzcygnb3BhY2l0eScsIDApXHJcbiAgICAgICAgLnNsaWRlRG93bih7XHJcbiAgICAgICAgcXVldWU6IGZhbHNlLFxyXG4gICAgICAgIGR1cmF0aW9uOiBvcHRpb25zLmluRHVyYXRpb24sXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZU91dEN1YmljJyxcclxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAkKHRoaXMpLmNzcygnaGVpZ2h0JywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgICAuYW5pbWF0ZSgge29wYWNpdHk6IDF9LCB7cXVldWU6IGZhbHNlLCBkdXJhdGlvbjogb3B0aW9ucy5pbkR1cmF0aW9uLCBlYXNpbmc6ICdlYXNlT3V0U2luZSd9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoaWRlRHJvcGRvd24oKSB7XHJcbiAgICAgIC8vIENoZWNrIGZvciBzaW11bHRhbmVvdXMgZm9jdXMgYW5kIGNsaWNrIGV2ZW50cy5cclxuICAgICAgaXNGb2N1c2VkID0gZmFsc2U7XHJcbiAgICAgIGFjdGl2YXRlcy5mYWRlT3V0KG9wdGlvbnMub3V0RHVyYXRpb24pO1xyXG4gICAgICBhY3RpdmF0ZXMucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICBvcmlnaW4ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBhY3RpdmF0ZXMuY3NzKCdtYXgtaGVpZ2h0JywgJycpOyB9LCBvcHRpb25zLm91dER1cmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIb3ZlclxyXG4gICAgaWYgKG9wdGlvbnMuaG92ZXIpIHtcclxuICAgICAgdmFyIG9wZW4gPSBmYWxzZTtcclxuICAgICAgb3JpZ2luLnVuYmluZCgnY2xpY2suJyArIG9yaWdpbi5hdHRyKCdpZCcpKTtcclxuICAgICAgLy8gSG92ZXIgaGFuZGxlciB0byBzaG93IGRyb3Bkb3duXHJcbiAgICAgIG9yaWdpbi5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGUpeyAvLyBNb3VzZSBvdmVyXHJcbiAgICAgICAgaWYgKG9wZW4gPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBwbGFjZURyb3Bkb3duKCk7XHJcbiAgICAgICAgICBvcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBvcmlnaW4ub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAvLyBJZiBob3ZlciBvbiBvcmlnaW4gdGhlbiB0byBzb21ldGhpbmcgb3RoZXIgdGhhbiBkcm9wZG93biBjb250ZW50LCB0aGVuIGNsb3NlXHJcbiAgICAgICAgdmFyIHRvRWwgPSBlLnRvRWxlbWVudCB8fCBlLnJlbGF0ZWRUYXJnZXQ7IC8vIGFkZGVkIGJyb3dzZXIgY29tcGF0aWJpbGl0eSBmb3IgdGFyZ2V0IGVsZW1lbnRcclxuICAgICAgICBpZighJCh0b0VsKS5jbG9zZXN0KCcuZHJvcGRvd24tY29udGVudCcpLmlzKGFjdGl2YXRlcykpIHtcclxuICAgICAgICAgIGFjdGl2YXRlcy5zdG9wKHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgaGlkZURyb3Bkb3duKCk7XHJcbiAgICAgICAgICBvcGVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFjdGl2YXRlcy5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKGUpeyAvLyBNb3VzZSBvdXRcclxuICAgICAgICB2YXIgdG9FbCA9IGUudG9FbGVtZW50IHx8IGUucmVsYXRlZFRhcmdldDtcclxuICAgICAgICBpZighJCh0b0VsKS5jbG9zZXN0KCcuZHJvcGRvd24tYnV0dG9uJykuaXMob3JpZ2luKSkge1xyXG4gICAgICAgICAgYWN0aXZhdGVzLnN0b3AodHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICBoaWRlRHJvcGRvd24oKTtcclxuICAgICAgICAgIG9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIC8vIENsaWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBDbGljayBoYW5kbGVyIHRvIHNob3cgZHJvcGRvd25cclxuICAgICAgb3JpZ2luLnVuYmluZCgnY2xpY2suJyArIG9yaWdpbi5hdHRyKCdpZCcpKTtcclxuICAgICAgb3JpZ2luLmJpbmQoJ2NsaWNrLicrb3JpZ2luLmF0dHIoJ2lkJyksIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGlmICghaXNGb2N1c2VkKSB7XHJcbiAgICAgICAgICBpZiAoIG9yaWdpblswXSA9PSBlLmN1cnJlbnRUYXJnZXQgJiZcclxuICAgICAgICAgICAgICAgIW9yaWdpbi5oYXNDbGFzcygnYWN0aXZlJykgJiZcclxuICAgICAgICAgICAgICAgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5kcm9wZG93bi1jb250ZW50JykubGVuZ3RoID09PSAwKSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIFByZXZlbnRzIGJ1dHRvbiBjbGljayBmcm9tIG1vdmluZyB3aW5kb3dcclxuICAgICAgICAgICAgcGxhY2VEcm9wZG93bignY2xpY2snKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIElmIG9yaWdpbiBpcyBjbGlja2VkIGFuZCBtZW51IGlzIG9wZW4sIGNsb3NlIG1lbnVcclxuICAgICAgICAgIGVsc2UgaWYgKG9yaWdpbi5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgaGlkZURyb3Bkb3duKCk7XHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLnVuYmluZCgnY2xpY2suJysgYWN0aXZhdGVzLmF0dHIoJ2lkJykgKyAnIHRvdWNoc3RhcnQuJyArIGFjdGl2YXRlcy5hdHRyKCdpZCcpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIElmIG1lbnUgb3BlbiwgYWRkIGNsaWNrIGNsb3NlIGhhbmRsZXIgdG8gZG9jdW1lbnRcclxuICAgICAgICAgIGlmIChhY3RpdmF0ZXMuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLmJpbmQoJ2NsaWNrLicrIGFjdGl2YXRlcy5hdHRyKCdpZCcpICsgJyB0b3VjaHN0YXJ0LicgKyBhY3RpdmF0ZXMuYXR0cignaWQnKSwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICBpZiAoIWFjdGl2YXRlcy5pcyhlLnRhcmdldCkgJiYgIW9yaWdpbi5pcyhlLnRhcmdldCkgJiYgKCFvcmlnaW4uZmluZChlLnRhcmdldCkubGVuZ3RoKSApIHtcclxuICAgICAgICAgICAgICAgIGhpZGVEcm9wZG93bigpO1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkudW5iaW5kKCdjbGljay4nKyBhY3RpdmF0ZXMuYXR0cignaWQnKSArICcgdG91Y2hzdGFydC4nICsgYWN0aXZhdGVzLmF0dHIoJ2lkJykpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9IC8vIEVuZCBlbHNlXHJcblxyXG4gICAgLy8gTGlzdGVuIHRvIG9wZW4gYW5kIGNsb3NlIGV2ZW50IC0gdXNlZnVsIGZvciBzZWxlY3QgY29tcG9uZW50XHJcbiAgICBvcmlnaW4ub24oJ29wZW4nLCBmdW5jdGlvbihlLCBldmVudFR5cGUpIHtcclxuICAgICAgcGxhY2VEcm9wZG93bihldmVudFR5cGUpO1xyXG4gICAgfSk7XHJcbiAgICBvcmlnaW4ub24oJ2Nsb3NlJywgaGlkZURyb3Bkb3duKTtcclxuXHJcblxyXG4gICB9KTtcclxuICB9OyAvLyBFbmQgZHJvcGRvd24gcGx1Z2luXHJcblxyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAkKCcuZHJvcGRvd24tYnV0dG9uJykuZHJvcGRvd24oKTtcclxuICB9KTtcclxufSggalF1ZXJ5ICkpO1xyXG5cclxuXHJcbnZhciBkcm9wZG93blNlbGVjdG9ycyA9ICQoJy5kcm9wZG93biwgLmRyb3B1cCcpO1xyXG5cclxuICAgICAgICAvLyBDdXN0b20gZnVuY3Rpb24gdG8gcmVhZCBkcm9wZG93biBkYXRhXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgIGZ1bmN0aW9uIGRyb3Bkb3duRWZmZWN0RGF0YSh0YXJnZXQpIHtcclxuICAgICAgICAgICAgLy8gQHRvZG8gLSBwYWdlIGxldmVsIGdsb2JhbD9cclxuICAgICAgICAgICAgdmFyIGVmZmVjdEluRGVmYXVsdCA9IG51bGwsXHJcbiAgICAgICAgICAgICAgICBlZmZlY3RPdXREZWZhdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGRyb3Bkb3duID0gJCh0YXJnZXQpLFxyXG4gICAgICAgICAgICAgICAgZHJvcGRvd25NZW51ID0gJCgnLmRyb3Bkb3duLW1lbnUnLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50VWwgPSBkcm9wZG93bi5wYXJlbnRzKCd1bC5uYXYnKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHBhcmVudCBpcyB1bC5uYXYgYWxsb3cgZ2xvYmFsIGVmZmVjdCBzZXR0aW5nc1xyXG4gICAgICAgICAgICBpZiAocGFyZW50VWwuaGVpZ2h0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZWZmZWN0SW5EZWZhdWx0ID0gcGFyZW50VWwuZGF0YSgnZHJvcGRvd24taW4nKSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgZWZmZWN0T3V0RGVmYXVsdCA9IHBhcmVudFVsLmRhdGEoJ2Ryb3Bkb3duLW91dCcpIHx8IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgICAgICAgICAgIGRyb3Bkb3duOiBkcm9wZG93bixcclxuICAgICAgICAgICAgICAgIGRyb3Bkb3duTWVudTogZHJvcGRvd25NZW51LFxyXG4gICAgICAgICAgICAgICAgZWZmZWN0SW46IGRyb3Bkb3duTWVudS5kYXRhKCdkcm9wZG93bi1pbicpIHx8IGVmZmVjdEluRGVmYXVsdCxcclxuICAgICAgICAgICAgICAgIGVmZmVjdE91dDogZHJvcGRvd25NZW51LmRhdGEoJ2Ryb3Bkb3duLW91dCcpIHx8IGVmZmVjdE91dERlZmF1bHQsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDdXN0b20gZnVuY3Rpb24gdG8gc3RhcnQgZWZmZWN0IChpbiBvciBvdXQpXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgIGZ1bmN0aW9uIGRyb3Bkb3duRWZmZWN0U3RhcnQoZGF0YSwgZWZmZWN0VG9TdGFydCkge1xyXG4gICAgICAgICAgICBpZiAoZWZmZWN0VG9TdGFydCkge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5kcm9wZG93bi5hZGRDbGFzcygnZHJvcGRvd24tYW5pbWF0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmRyb3Bkb3duTWVudS5hZGRDbGFzcygnYW5pbWF0ZWQnKTtcclxuICAgICAgICAgICAgICAgIGRhdGEuZHJvcGRvd25NZW51LmFkZENsYXNzKGVmZmVjdFRvU3RhcnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDdXN0b20gZnVuY3Rpb24gdG8gcmVhZCB3aGVuIGFuaW1hdGlvbiBpcyBvdmVyXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgIGZ1bmN0aW9uIGRyb3Bkb3duRWZmZWN0RW5kKGRhdGEsIGNhbGxiYWNrRnVuYykge1xyXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uRW5kID0gJ3dlYmtpdEFuaW1hdGlvbkVuZCBtb3pBbmltYXRpb25FbmQgTVNBbmltYXRpb25FbmQgb2FuaW1hdGlvbmVuZCBhbmltYXRpb25lbmQnO1xyXG4gICAgICAgICAgICBkYXRhLmRyb3Bkb3duLm9uZShhbmltYXRpb25FbmQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuZHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ2Ryb3Bkb3duLWFuaW1hdGluZycpO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5kcm9wZG93bk1lbnUucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkJyk7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmRyb3Bkb3duTWVudS5yZW1vdmVDbGFzcyhkYXRhLmVmZmVjdEluKTtcclxuICAgICAgICAgICAgICAgIGRhdGEuZHJvcGRvd25NZW51LnJlbW92ZUNsYXNzKGRhdGEuZWZmZWN0T3V0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDdXN0b20gY2FsbGJhY2sgb3B0aW9uLCB1c2VkIHRvIHJlbW92ZSBvcGVuIGNsYXNzIGluIG91dCBlZmZlY3RcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2tGdW5jID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja0Z1bmMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBCb290c3RyYXAgQVBJIGhvb2tzXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgIGRyb3Bkb3duU2VsZWN0b3JzLm9uKHtcclxuICAgICAgICAgICAgXCJzaG93LmJzLmRyb3Bkb3duXCI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIE9uIHNob3csIHN0YXJ0IGluIGVmZmVjdFxyXG4gICAgICAgICAgICAgICAgdmFyIGRyb3Bkb3duID0gZHJvcGRvd25FZmZlY3REYXRhKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgZHJvcGRvd25FZmZlY3RTdGFydChkcm9wZG93biwgZHJvcGRvd24uZWZmZWN0SW4pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcInNob3duLmJzLmRyb3Bkb3duXCI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIE9uIHNob3duLCByZW1vdmUgaW4gZWZmZWN0IG9uY2UgY29tcGxldGVcclxuICAgICAgICAgICAgICAgIHZhciBkcm9wZG93biA9IGRyb3Bkb3duRWZmZWN0RGF0YSh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmIChkcm9wZG93bi5lZmZlY3RJbiAmJiBkcm9wZG93bi5lZmZlY3RPdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkVmZmVjdEVuZChkcm9wZG93biwgZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImhpZGUuYnMuZHJvcGRvd25cIjogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIE9uIGhpZGUsIHN0YXJ0IG91dCBlZmZlY3RcclxuICAgICAgICAgICAgICAgIHZhciBkcm9wZG93biA9IGRyb3Bkb3duRWZmZWN0RGF0YSh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmIChkcm9wZG93bi5lZmZlY3RPdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25FZmZlY3RTdGFydChkcm9wZG93biwgZHJvcGRvd24uZWZmZWN0T3V0KTtcclxuICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkVmZmVjdEVuZChkcm9wZG93biwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5kcm9wZG93bi5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5kcm9wZG93bi5yZW1vdmVDbGFzcygnc2hvdycpOyAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4iLCIvKiBGT1JNUyAqL1xyXG5cclxuOyhmdW5jdGlvbiAoJCkge1xyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBGdW5jdGlvbiB0byB1cGRhdGUgbGFiZWxzIG9mIHRleHQgZmllbGRzXHJcbiAgICBNYXRlcmlhbGl6ZS51cGRhdGVUZXh0RmllbGRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgaW5wdXRfc2VsZWN0b3IgPSAnaW5wdXRbdHlwZT10ZXh0XSwgaW5wdXRbdHlwZT1wYXNzd29yZF0sIGlucHV0W3R5cGU9ZW1haWxdLCBpbnB1dFt0eXBlPXVybF0sIGlucHV0W3R5cGU9dGVsXSwgaW5wdXRbdHlwZT1udW1iZXJdLCBpbnB1dFt0eXBlPXNlYXJjaF0sIHRleHRhcmVhJ1xyXG4gICAgICAkKGlucHV0X3NlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAgIGlmICgkKGVsZW1lbnQpLnZhbCgpLmxlbmd0aCA+IDAgfHwgZWxlbWVudC5hdXRvZm9jdXMgfHwgJCh0aGlzKS5hdHRyKCdwbGFjZWhvbGRlcicpICE9PSB1bmRlZmluZWQgfHwgJChlbGVtZW50KVswXS52YWxpZGl0eS5iYWRJbnB1dCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwsIGknKS5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCdsYWJlbCwgaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBUZXh0IGJhc2VkIGlucHV0c1xyXG4gICAgdmFyIGlucHV0X3NlbGVjdG9yID0gJ2lucHV0W3R5cGU9dGV4dF0sIGlucHV0W3R5cGU9cGFzc3dvcmRdLCBpbnB1dFt0eXBlPWVtYWlsXSwgaW5wdXRbdHlwZT11cmxdLCBpbnB1dFt0eXBlPXRlbF0sIGlucHV0W3R5cGU9bnVtYmVyXSwgaW5wdXRbdHlwZT1zZWFyY2hdLCB0ZXh0YXJlYSdcclxuXHJcbiAgICAvLyBBZGQgYWN0aXZlIGlmIGZvcm0gYXV0byBjb21wbGV0ZVxyXG4gICAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsIGlucHV0X3NlbGVjdG9yLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkKHRoaXMpLnZhbCgpLmxlbmd0aCAhPT0gMCB8fCAkKHRoaXMpLmF0dHIoJ3BsYWNlaG9sZGVyJykgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICQodGhpcykuc2libGluZ3MoJ2xhYmVsJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgIH1cclxuICAgICAgdmFsaWRhdGVfZmllbGQoJCh0aGlzKSlcclxuICAgIH0pXHJcblxyXG4gICAgLy8gQWRkIGFjdGl2ZSBpZiBpbnB1dCBlbGVtZW50IGhhcyBiZWVuIHByZS1wb3B1bGF0ZWQgb24gZG9jdW1lbnQgcmVhZHlcclxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgTWF0ZXJpYWxpemUudXBkYXRlVGV4dEZpZWxkcygpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIEhUTUwgRE9NIEZPUk0gUkVTRVQgaGFuZGxpbmdcclxuICAgICQoZG9jdW1lbnQpLm9uKCdyZXNldCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciBmb3JtUmVzZXQgPSAkKGUudGFyZ2V0KVxyXG4gICAgICBpZiAoZm9ybVJlc2V0LmlzKCdmb3JtJykpIHtcclxuICAgICAgICBmb3JtUmVzZXQuZmluZChpbnB1dF9zZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ3ZhbGlkJykucmVtb3ZlQ2xhc3MoJ2ludmFsaWQnKVxyXG4gICAgICAgIGZvcm1SZXNldC5maW5kKGlucHV0X3NlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ3ZhbHVlJykgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJ2xhYmVsLCBpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gUmVzZXQgc2VsZWN0XHJcbiAgICAgICAgZm9ybVJlc2V0LmZpbmQoJ3NlbGVjdC5pbml0aWFsaXplZCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIHJlc2V0X3RleHQgPSBmb3JtUmVzZXQuZmluZCgnb3B0aW9uW3NlbGVjdGVkXScpLnRleHQoKVxyXG4gICAgICAgICAgZm9ybVJlc2V0LnNpYmxpbmdzKCdpbnB1dC5zZWxlY3QtZHJvcGRvd24nKS52YWwocmVzZXRfdGV4dClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIEFkZCBhY3RpdmUgd2hlbiBlbGVtZW50IGhhcyBmb2N1c1xyXG4gICAgJChkb2N1bWVudCkub24oJ2ZvY3VzJywgaW5wdXRfc2VsZWN0b3IsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwsIGknKS5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgIH0pXHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2JsdXInLCBpbnB1dF9zZWxlY3RvciwgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJGlucHV0RWxlbWVudCA9ICQodGhpcylcclxuICAgICAgaWYgKCRpbnB1dEVsZW1lbnQudmFsKCkubGVuZ3RoID09PSAwICYmICRpbnB1dEVsZW1lbnRbMF0udmFsaWRpdHkuYmFkSW5wdXQgIT09IHRydWUgJiYgJGlucHV0RWxlbWVudC5hdHRyKCdwbGFjZWhvbGRlcicpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAkaW5wdXRFbGVtZW50LnNpYmxpbmdzKCdsYWJlbCwgaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoJGlucHV0RWxlbWVudC52YWwoKS5sZW5ndGggPT09IDAgJiYgJGlucHV0RWxlbWVudFswXS52YWxpZGl0eS5iYWRJbnB1dCAhPT0gdHJ1ZSAmJiAkaW5wdXRFbGVtZW50LmF0dHIoJ3BsYWNlaG9sZGVyJykgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICRpbnB1dEVsZW1lbnQuc2libGluZ3MoJ2knKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgfVxyXG4gICAgICB2YWxpZGF0ZV9maWVsZCgkaW5wdXRFbGVtZW50KVxyXG4gICAgfSlcclxuXHJcbiAgICB3aW5kb3cudmFsaWRhdGVfZmllbGQgPSBmdW5jdGlvbiAob2JqZWN0KSB7XHJcbiAgICAgIHZhciBoYXNMZW5ndGggPSBvYmplY3QuYXR0cignbGVuZ3RoJykgIT09IHVuZGVmaW5lZFxyXG4gICAgICB2YXIgbGVuQXR0ciA9IHBhcnNlSW50KG9iamVjdC5hdHRyKCdsZW5ndGgnKSlcclxuICAgICAgdmFyIGxlbiA9IG9iamVjdC52YWwoKS5sZW5ndGhcclxuXHJcbiAgICAgIGlmIChvYmplY3QudmFsKCkubGVuZ3RoID09PSAwICYmIG9iamVjdFswXS52YWxpZGl0eS5iYWRJbnB1dCA9PT0gZmFsc2UpIHtcclxuICAgICAgICBpZiAob2JqZWN0Lmhhc0NsYXNzKCd2YWxpZGF0ZScpKSB7XHJcbiAgICAgICAgICBvYmplY3QucmVtb3ZlQ2xhc3MoJ3ZhbGlkJylcclxuICAgICAgICAgIG9iamVjdC5yZW1vdmVDbGFzcygnaW52YWxpZCcpXHJcbiAgICAgICAgfVxyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgaWYgKG9iamVjdC5oYXNDbGFzcygndmFsaWRhdGUnKSkge1xyXG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIGNoYXJhY3RlciBjb3VudGVyIGF0dHJpYnV0ZXNcclxuICAgICAgICAgIGlmICgob2JqZWN0LmlzKCc6dmFsaWQnKSAmJiBoYXNMZW5ndGggJiYgKGxlbiA8PSBsZW5BdHRyKSkgfHwgKG9iamVjdC5pcygnOnZhbGlkJykgJiYgIWhhc0xlbmd0aCkpIHtcclxuICAgICAgICAgICAgb2JqZWN0LnJlbW92ZUNsYXNzKCdpbnZhbGlkJylcclxuICAgICAgICAgICAgb2JqZWN0LmFkZENsYXNzKCd2YWxpZCcpXHJcbiAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIG9iamVjdC5yZW1vdmVDbGFzcygndmFsaWQnKVxyXG4gICAgICAgICAgICBvYmplY3QuYWRkQ2xhc3MoJ2ludmFsaWQnKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRleHRhcmVhIEF1dG8gUmVzaXplXHJcbiAgICB2YXIgaGlkZGVuRGl2ID0gJCgnLmhpZGRlbmRpdicpLmZpcnN0KClcclxuICAgIGlmICghaGlkZGVuRGl2Lmxlbmd0aCkge1xyXG4gICAgICBoaWRkZW5EaXYgPSAkKCc8ZGl2IGNsYXNzPVwiaGlkZGVuZGl2IGNvbW1vblwiPjwvZGl2PicpXHJcbiAgICAgICQoJ2JvZHknKS5hcHBlbmQoaGlkZGVuRGl2KVxyXG4gICAgfVxyXG4gICAgdmFyIHRleHRfYXJlYV9zZWxlY3RvciA9ICcubWF0ZXJpYWxpemUtdGV4dGFyZWEnXHJcblxyXG4gICAgZnVuY3Rpb24gdGV4dGFyZWFBdXRvUmVzaXplICgkdGV4dGFyZWEpIHtcclxuICAgICAgLy8gU2V0IGZvbnQgcHJvcGVydGllcyBvZiBoaWRkZW5EaXZcclxuXHJcbiAgICAgIHZhciBmb250RmFtaWx5ID0gJHRleHRhcmVhLmNzcygnZm9udC1mYW1pbHknKVxyXG4gICAgICB2YXIgZm9udFNpemUgPSAkdGV4dGFyZWEuY3NzKCdmb250LXNpemUnKVxyXG5cclxuICAgICAgaWYgKGZvbnRTaXplKSB7IGhpZGRlbkRpdi5jc3MoJ2ZvbnQtc2l6ZScsIGZvbnRTaXplKTsgfVxyXG4gICAgICBpZiAoZm9udEZhbWlseSkgeyBoaWRkZW5EaXYuY3NzKCdmb250LWZhbWlseScsIGZvbnRGYW1pbHkpOyB9XHJcblxyXG4gICAgICBpZiAoJHRleHRhcmVhLmF0dHIoJ3dyYXAnKSA9PT0gJ29mZicpIHtcclxuICAgICAgICBoaWRkZW5EaXYuY3NzKCdvdmVyZmxvdy13cmFwJywgJ25vcm1hbCcpXHJcbiAgICAgICAgICAuY3NzKCd3aGl0ZS1zcGFjZScsICdwcmUnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBoaWRkZW5EaXYudGV4dCgkdGV4dGFyZWEudmFsKCkgKyAnXFxuJylcclxuICAgICAgdmFyIGNvbnRlbnQgPSBoaWRkZW5EaXYuaHRtbCgpLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpXHJcbiAgICAgIGhpZGRlbkRpdi5odG1sKGNvbnRlbnQpXHJcblxyXG4gICAgICAvLyBXaGVuIHRleHRhcmVhIGlzIGhpZGRlbiwgd2lkdGggZ29lcyBjcmF6eS5cclxuICAgICAgLy8gQXBwcm94aW1hdGUgd2l0aCBoYWxmIG9mIHdpbmRvdyBzaXplXHJcblxyXG4gICAgICBpZiAoJHRleHRhcmVhLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgaGlkZGVuRGl2LmNzcygnd2lkdGgnLCAkdGV4dGFyZWEud2lkdGgoKSlcclxuICAgICAgfWVsc2Uge1xyXG4gICAgICAgIGhpZGRlbkRpdi5jc3MoJ3dpZHRoJywgJCh3aW5kb3cpLndpZHRoKCkgLyAyKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkdGV4dGFyZWEuY3NzKCdoZWlnaHQnLCBoaWRkZW5EaXYuaGVpZ2h0KCkpXHJcbiAgICB9XHJcblxyXG4gICAgJCh0ZXh0X2FyZWFfc2VsZWN0b3IpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJHRleHRhcmVhID0gJCh0aGlzKVxyXG4gICAgICBpZiAoJHRleHRhcmVhLnZhbCgpLmxlbmd0aCkge1xyXG4gICAgICAgIHRleHRhcmVhQXV0b1Jlc2l6ZSgkdGV4dGFyZWEpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdrZXl1cCBrZXlkb3duIGF1dG9yZXNpemUnLCB0ZXh0X2FyZWFfc2VsZWN0b3IsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGV4dGFyZWFBdXRvUmVzaXplKCQodGhpcykpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIEZpbGUgSW5wdXQgUGF0aFxyXG4gICAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsICcuZmlsZS1maWVsZCBpbnB1dFt0eXBlPVwiZmlsZVwiXScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGZpbGVfZmllbGQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5maWxlLWZpZWxkJylcclxuICAgICAgdmFyIHBhdGhfaW5wdXQgPSBmaWxlX2ZpZWxkLmZpbmQoJ2lucHV0LmZpbGUtcGF0aCcpXHJcbiAgICAgIHZhciBmaWxlcyA9ICQodGhpcylbMF0uZmlsZXNcclxuICAgICAgdmFyIGZpbGVfbmFtZXMgPSBbXVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZmlsZV9uYW1lcy5wdXNoKGZpbGVzW2ldLm5hbWUpXHJcbiAgICAgIH1cclxuICAgICAgcGF0aF9pbnB1dC52YWwoZmlsZV9uYW1lcy5qb2luKCcsICcpKVxyXG4gICAgICBwYXRoX2lucHV0LnRyaWdnZXIoJ2NoYW5nZScpXHJcbiAgICB9KVxyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqXHJcbiAgICAqICBSYW5nZSBJbnB1dCAgKlxyXG4gICAgKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICB2YXIgcmFuZ2VfdHlwZSA9ICdpbnB1dFt0eXBlPXJhbmdlXSdcclxuICAgIHZhciByYW5nZV9tb3VzZWRvd24gPSBmYWxzZVxyXG4gICAgdmFyIGxlZnRcclxuXHJcbiAgICAkKHJhbmdlX3R5cGUpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdGh1bWIgPSAkKCc8c3BhbiBjbGFzcz1cInRodW1iXCI+PHNwYW4gY2xhc3M9XCJ2YWx1ZVwiPjwvc3Bhbj48L3NwYW4+JylcclxuICAgICAgJCh0aGlzKS5hZnRlcih0aHVtYilcclxuICAgIH0pXHJcblxyXG4gICAgdmFyIHJhbmdlX3dyYXBwZXIgPSAnLnJhbmdlLWZpZWxkJ1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsIHJhbmdlX3R5cGUsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciB0aHVtYiA9ICQodGhpcykuc2libGluZ3MoJy50aHVtYicpXHJcbiAgICAgIHRodW1iLmZpbmQoJy52YWx1ZScpLmh0bWwoJCh0aGlzKS52YWwoKSlcclxuICAgIH0pXHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2lucHV0IG1vdXNlZG93biB0b3VjaHN0YXJ0JywgcmFuZ2VfdHlwZSwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIHRodW1iID0gJCh0aGlzKS5zaWJsaW5ncygnLnRodW1iJylcclxuICAgICAgdmFyIHdpZHRoID0gJCh0aGlzKS5vdXRlcldpZHRoKClcclxuXHJcbiAgICAgIC8vIElmIHRodW1iIGluZGljYXRvciBkb2VzIG5vdCBleGlzdCB5ZXQsIGNyZWF0ZSBpdFxyXG4gICAgICBpZiAodGh1bWIubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICB0aHVtYiA9ICQoJzxzcGFuIGNsYXNzPVwidGh1bWJcIj48c3BhbiBjbGFzcz1cInZhbHVlXCI+PC9zcGFuPjwvc3Bhbj4nKVxyXG4gICAgICAgICQodGhpcykuYWZ0ZXIodGh1bWIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNldCBpbmRpY2F0b3IgdmFsdWVcclxuICAgICAgdGh1bWIuZmluZCgnLnZhbHVlJykuaHRtbCgkKHRoaXMpLnZhbCgpKVxyXG5cclxuICAgICAgcmFuZ2VfbW91c2Vkb3duID0gdHJ1ZVxyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cclxuICAgICAgaWYgKCF0aHVtYi5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICB0aHVtYi52ZWxvY2l0eSh7IGhlaWdodDogJzMwcHgnLCB3aWR0aDogJzMwcHgnLCB0b3A6ICctMjBweCcsIG1hcmdpbkxlZnQ6ICctMTVweCd9LCB7IGR1cmF0aW9uOiAzMDAsIGVhc2luZzogJ2Vhc2VPdXRFeHBvJyB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZS50eXBlICE9PSAnaW5wdXQnKSB7XHJcbiAgICAgICAgaWYgKGUucGFnZVggPT09IHVuZGVmaW5lZCB8fCBlLnBhZ2VYID09PSBudWxsKSB7IC8vIG1vYmlsZVxyXG4gICAgICAgICAgbGVmdCA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLnBhZ2VYIC0gJCh0aGlzKS5vZmZzZXQoKS5sZWZ0XHJcbiAgICAgICAgfWVsc2UgeyAvLyBkZXNrdG9wXHJcbiAgICAgICAgICBsZWZ0ID0gZS5wYWdlWCAtICQodGhpcykub2Zmc2V0KCkubGVmdFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGVmdCA8IDApIHtcclxuICAgICAgICAgIGxlZnQgPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGxlZnQgPiB3aWR0aCkge1xyXG4gICAgICAgICAgbGVmdCA9IHdpZHRoXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRodW1iLmFkZENsYXNzKCdhY3RpdmUnKS5jc3MoJ2xlZnQnLCBsZWZ0KVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aHVtYi5maW5kKCcudmFsdWUnKS5odG1sKCQodGhpcykudmFsKCkpXHJcbiAgICB9KVxyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZXVwIHRvdWNoZW5kJywgcmFuZ2Vfd3JhcHBlciwgZnVuY3Rpb24gKCkge1xyXG4gICAgICByYW5nZV9tb3VzZWRvd24gPSBmYWxzZVxyXG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignbW91c2Vtb3ZlIHRvdWNobW92ZScsIHJhbmdlX3dyYXBwZXIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciB0aHVtYiA9ICQodGhpcykuY2hpbGRyZW4oJy50aHVtYicpXHJcbiAgICAgIHZhciBsZWZ0XHJcbiAgICAgIGlmIChyYW5nZV9tb3VzZWRvd24pIHtcclxuICAgICAgICBpZiAoIXRodW1iLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgdGh1bWIudmVsb2NpdHkoeyBoZWlnaHQ6ICczMHB4Jywgd2lkdGg6ICczMHB4JywgdG9wOiAnLTIwcHgnLCBtYXJnaW5MZWZ0OiAnLTE1cHgnfSwgeyBkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlT3V0RXhwbycgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUucGFnZVggPT09IHVuZGVmaW5lZCB8fCBlLnBhZ2VYID09PSBudWxsKSB7IC8vIG1vYmlsZVxyXG4gICAgICAgICAgbGVmdCA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLnBhZ2VYIC0gJCh0aGlzKS5vZmZzZXQoKS5sZWZ0XHJcbiAgICAgICAgfWVsc2UgeyAvLyBkZXNrdG9wXHJcbiAgICAgICAgICBsZWZ0ID0gZS5wYWdlWCAtICQodGhpcykub2Zmc2V0KCkubGVmdFxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgd2lkdGggPSAkKHRoaXMpLm91dGVyV2lkdGgoKVxyXG5cclxuICAgICAgICBpZiAobGVmdCA8IDApIHtcclxuICAgICAgICAgIGxlZnQgPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGxlZnQgPiB3aWR0aCkge1xyXG4gICAgICAgICAgbGVmdCA9IHdpZHRoXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRodW1iLmFkZENsYXNzKCdhY3RpdmUnKS5jc3MoJ2xlZnQnLCBsZWZ0KVxyXG4gICAgICAgIHRodW1iLmZpbmQoJy52YWx1ZScpLmh0bWwodGh1bWIuc2libGluZ3MocmFuZ2VfdHlwZSkudmFsKCkpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ21vdXNlb3V0IHRvdWNobGVhdmUnLCByYW5nZV93cmFwcGVyLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghcmFuZ2VfbW91c2Vkb3duKSB7XHJcbiAgICAgICAgdmFyIHRodW1iID0gJCh0aGlzKS5jaGlsZHJlbignLnRodW1iJylcclxuXHJcbiAgICAgICAgaWYgKHRodW1iLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgdGh1bWIudmVsb2NpdHkoeyBoZWlnaHQ6ICcwJywgd2lkdGg6ICcwJywgdG9wOiAnMTBweCcsIG1hcmdpbkxlZnQ6ICctNnB4J30sIHsgZHVyYXRpb246IDEwMCB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aHVtYi5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9KTsgLy8gRW5kIG9mICQoZG9jdW1lbnQpLnJlYWR5XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqXHJcbiAgICogIFNlbGVjdCBQbHVnaW4gICpcclxuICAgKioqKioqKioqKioqKioqKioqL1xyXG4gICQuZm4ubWF0ZXJpYWxfc2VsZWN0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAkKHRoaXMpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJHNlbGVjdCA9ICQodGhpcylcclxuXHJcbiAgICAgIGlmICgkc2VsZWN0Lmhhc0NsYXNzKCdicm93c2VyLWRlZmF1bHQnKSkge1xyXG4gICAgICAgIHJldHVybjsgLy8gQ29udGludWUgdG8gbmV4dCAocmV0dXJuIGZhbHNlIGJyZWFrcyBvdXQgb2YgZW50aXJlIGxvb3ApXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBtdWx0aXBsZSA9ICRzZWxlY3QuYXR0cignbXVsdGlwbGUnKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICBsYXN0SUQgPSAkc2VsZWN0LmRhdGEoJ3NlbGVjdC1pZCcpIC8vIFRlYXIgZG93biBzdHJ1Y3R1cmUgaWYgU2VsZWN0IG5lZWRzIHRvIGJlIHJlYnVpbHRcclxuXHJcbiAgICAgIGlmIChsYXN0SUQpIHtcclxuICAgICAgICAkc2VsZWN0LnBhcmVudCgpLmZpbmQoJ3NwYW4uY2FyZXQnKS5yZW1vdmUoKVxyXG4gICAgICAgICRzZWxlY3QucGFyZW50KCkuZmluZCgnaW5wdXQnKS5yZW1vdmUoKVxyXG5cclxuICAgICAgICAkc2VsZWN0LnVud3JhcCgpXHJcbiAgICAgICAgJCgndWwjc2VsZWN0LW9wdGlvbnMtJyArIGxhc3RJRCkucmVtb3ZlKClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgZGVzdHJveWluZyB0aGUgc2VsZWN0LCByZW1vdmUgdGhlIHNlbGVsY3QtaWQgYW5kIHJlc2V0IGl0IHRvIGl0J3MgdW5pbml0aWFsaXplZCBzdGF0ZS5cclxuICAgICAgaWYgKGNhbGxiYWNrID09PSAnZGVzdHJveScpIHtcclxuICAgICAgICAkc2VsZWN0LmRhdGEoJ3NlbGVjdC1pZCcsIG51bGwpLnJlbW92ZUNsYXNzKCdpbml0aWFsaXplZCcpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB1bmlxdWVJRCA9IE1hdGVyaWFsaXplLmd1aWQoKVxyXG4gICAgICAkc2VsZWN0LmRhdGEoJ3NlbGVjdC1pZCcsIHVuaXF1ZUlEKVxyXG4gICAgICB2YXIgd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJzZWxlY3Qtd3JhcHBlclwiPjwvZGl2PicpXHJcbiAgICAgIHdyYXBwZXIuYWRkQ2xhc3MoJHNlbGVjdC5hdHRyKCdjbGFzcycpKVxyXG4gICAgICB2YXIgb3B0aW9ucyA9ICQoJzx1bCBpZD1cInNlbGVjdC1vcHRpb25zLScgKyB1bmlxdWVJRCArICdcIiBjbGFzcz1cImRyb3Bkb3duLWNvbnRlbnQgc2VsZWN0LWRyb3Bkb3duICcgKyAobXVsdGlwbGUgPyAnbXVsdGlwbGUtc2VsZWN0LWRyb3Bkb3duJyA6ICcnKSArICdcIj48L3VsPicpLFxyXG4gICAgICAgIHNlbGVjdENoaWxkcmVuID0gJHNlbGVjdC5jaGlsZHJlbignb3B0aW9uLCBvcHRncm91cCcpLFxyXG4gICAgICAgIHZhbHVlc1NlbGVjdGVkID0gW10sXHJcbiAgICAgICAgb3B0aW9uc0hvdmVyID0gZmFsc2VcclxuXHJcbiAgICAgIHZhciBsYWJlbCA9ICRzZWxlY3QuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuaHRtbCgpIHx8ICRzZWxlY3QuZmluZCgnb3B0aW9uOmZpcnN0JykuaHRtbCgpIHx8ICcnXHJcblxyXG4gICAgICAvLyBGdW5jdGlvbiB0aGF0IHJlbmRlcnMgYW5kIGFwcGVuZHMgdGhlIG9wdGlvbiB0YWtpbmcgaW50b1xyXG4gICAgICAvLyBhY2NvdW50IHR5cGUgYW5kIHBvc3NpYmxlIGltYWdlIGljb24uXHJcbiAgICAgIHZhciBhcHBlbmRPcHRpb25XaXRoSWNvbiA9IGZ1bmN0aW9uIChzZWxlY3QsIG9wdGlvbiwgdHlwZSkge1xyXG4gICAgICAgIC8vIEFkZCBkaXNhYmxlZCBhdHRyIGlmIGRpc2FibGVkXHJcbiAgICAgICAgdmFyIGRpc2FibGVkQ2xhc3MgPSAob3B0aW9uLmlzKCc6ZGlzYWJsZWQnKSkgPyAnZGlzYWJsZWQgJyA6ICcnXHJcblxyXG4gICAgICAgIC8vIGFkZCBpY29uc1xyXG4gICAgICAgIHZhciBpY29uX3VybCA9IG9wdGlvbi5kYXRhKCdpY29uJylcclxuICAgICAgICB2YXIgY2xhc3NlcyA9IG9wdGlvbi5hdHRyKCdjbGFzcycpXHJcbiAgICAgICAgaWYgKCEhaWNvbl91cmwpIHtcclxuICAgICAgICAgIHZhciBjbGFzc1N0cmluZyA9ICcnXHJcbiAgICAgICAgICBpZiAoISFjbGFzc2VzKSBjbGFzc1N0cmluZyA9ICcgY2xhc3M9XCInICsgY2xhc3NlcyArICdcIidcclxuXHJcbiAgICAgICAgICAvLyBDaGVjayBmb3IgbXVsdGlwbGUgdHlwZS5cclxuICAgICAgICAgIGlmICh0eXBlID09PSAnbXVsdGlwbGUnKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuYXBwZW5kKCQoJzxsaSBjbGFzcz1cIicgKyBkaXNhYmxlZENsYXNzICsgJ1wiPjxpbWcgc3JjPVwiJyArIGljb25fdXJsICsgJ1wiJyArIGNsYXNzU3RyaW5nICsgJz48c3Bhbj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCInICsgZGlzYWJsZWRDbGFzcyArICcvPjxsYWJlbD48L2xhYmVsPicgKyBvcHRpb24uaHRtbCgpICsgJzwvc3Bhbj48L2xpPicpKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5hcHBlbmQoJCgnPGxpIGNsYXNzPVwiJyArIGRpc2FibGVkQ2xhc3MgKyAnXCI+PGltZyBzcmM9XCInICsgaWNvbl91cmwgKyAnXCInICsgY2xhc3NTdHJpbmcgKyAnPjxzcGFuPicgKyBvcHRpb24uaHRtbCgpICsgJzwvc3Bhbj48L2xpPicpKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciBtdWx0aXBsZSB0eXBlLlxyXG4gICAgICAgIGlmICh0eXBlID09PSAnbXVsdGlwbGUnKSB7XHJcbiAgICAgICAgICBvcHRpb25zLmFwcGVuZCgkKCc8bGkgY2xhc3M9XCInICsgZGlzYWJsZWRDbGFzcyArICdcIj48c3Bhbj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCInICsgZGlzYWJsZWRDbGFzcyArICcvPjxsYWJlbD48L2xhYmVsPicgKyBvcHRpb24uaHRtbCgpICsgJzwvc3Bhbj48L2xpPicpKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvcHRpb25zLmFwcGVuZCgkKCc8bGkgY2xhc3M9XCInICsgZGlzYWJsZWRDbGFzcyArICdcIj48c3Bhbj4nICsgb3B0aW9uLmh0bWwoKSArICc8L3NwYW4+PC9saT4nKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qIENyZWF0ZSBkcm9wZG93biBzdHJ1Y3R1cmUuICovXHJcbiAgICAgIGlmIChzZWxlY3RDaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgICBzZWxlY3RDaGlsZHJlbi5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmICgkKHRoaXMpLmlzKCdvcHRpb24nKSkge1xyXG4gICAgICAgICAgICAvLyBEaXJlY3QgZGVzY2VuZGFudCBvcHRpb24uXHJcbiAgICAgICAgICAgIGlmIChtdWx0aXBsZSkge1xyXG4gICAgICAgICAgICAgIGFwcGVuZE9wdGlvbldpdGhJY29uKCRzZWxlY3QsICQodGhpcyksICdtdWx0aXBsZScpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYXBwZW5kT3B0aW9uV2l0aEljb24oJHNlbGVjdCwgJCh0aGlzKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmlzKCdvcHRncm91cCcpKSB7XHJcbiAgICAgICAgICAgIC8vIE9wdGdyb3VwLlxyXG4gICAgICAgICAgICB2YXIgc2VsZWN0T3B0aW9ucyA9ICQodGhpcykuY2hpbGRyZW4oJ29wdGlvbicpXHJcbiAgICAgICAgICAgIG9wdGlvbnMuYXBwZW5kKCQoJzxsaSBjbGFzcz1cIm9wdGdyb3VwXCI+PHNwYW4+JyArICQodGhpcykuYXR0cignbGFiZWwnKSArICc8L3NwYW4+PC9saT4nKSlcclxuXHJcbiAgICAgICAgICAgIHNlbGVjdE9wdGlvbnMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgYXBwZW5kT3B0aW9uV2l0aEljb24oJHNlbGVjdCwgJCh0aGlzKSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBvcHRpb25zLmZpbmQoJ2xpOm5vdCgub3B0Z3JvdXApJykuZWFjaChmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgICQodGhpcykuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIC8vIENoZWNrIGlmIG9wdGlvbiBlbGVtZW50IGlzIGRpc2FibGVkXHJcbiAgICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykgJiYgISQodGhpcykuaGFzQ2xhc3MoJ29wdGdyb3VwJykpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gdHJ1ZVxyXG5cclxuICAgICAgICAgICAgaWYgKG11bHRpcGxlKSB7XHJcbiAgICAgICAgICAgICAgJCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgdGhpcykucHJvcCgnY2hlY2tlZCcsIGZ1bmN0aW9uIChpLCB2KSB7IHJldHVybiAhdjsgfSlcclxuICAgICAgICAgICAgICBzZWxlY3RlZCA9IHRvZ2dsZUVudHJ5RnJvbUFycmF5KHZhbHVlc1NlbGVjdGVkLCAkKHRoaXMpLmluZGV4KCksICRzZWxlY3QpXHJcbiAgICAgICAgICAgICAgJG5ld1NlbGVjdC50cmlnZ2VyKCdmb2N1cycpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgb3B0aW9ucy5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgJG5ld1NlbGVjdC52YWwoJCh0aGlzKS50ZXh0KCkpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFjdGl2YXRlT3B0aW9uKG9wdGlvbnMsICQodGhpcykpXHJcbiAgICAgICAgICAgICRzZWxlY3QuZmluZCgnb3B0aW9uJykuZXEoaSkucHJvcCgnc2VsZWN0ZWQnLCBzZWxlY3RlZClcclxuICAgICAgICAgICAgLy8gVHJpZ2dlciBvbmNoYW5nZSgpIGV2ZW50XHJcbiAgICAgICAgICAgICRzZWxlY3QudHJpZ2dlcignY2hhbmdlJylcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ3VuZGVmaW5lZCcpIGNhbGxiYWNrKClcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIFdyYXAgRWxlbWVudHNcclxuICAgICAgJHNlbGVjdC53cmFwKHdyYXBwZXIpXHJcbiAgICAgIC8vIEFkZCBTZWxlY3QgRGlzcGxheSBFbGVtZW50XHJcbiAgICAgIHZhciBkcm9wZG93bkljb24gPSAkKCc8c3BhbiBjbGFzcz1cImNhcmV0XCI+JiM5NjYwOzwvc3Bhbj4nKVxyXG4gICAgICBpZiAoJHNlbGVjdC5pcygnOmRpc2FibGVkJykpXHJcbiAgICAgICAgZHJvcGRvd25JY29uLmFkZENsYXNzKCdkaXNhYmxlZCcpXHJcblxyXG4gICAgICAvLyBlc2NhcGUgZG91YmxlIHF1b3Rlc1xyXG4gICAgICB2YXIgc2FuaXRpemVkTGFiZWxIdG1sID0gbGFiZWwucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXHJcblxyXG4gICAgICB2YXIgJG5ld1NlbGVjdCA9ICQoJzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwic2VsZWN0LWRyb3Bkb3duXCIgcmVhZG9ubHk9XCJ0cnVlXCIgJyArICgoJHNlbGVjdC5pcygnOmRpc2FibGVkJykpID8gJ2Rpc2FibGVkJyA6ICcnKSArICcgZGF0YS1hY3RpdmF0ZXM9XCJzZWxlY3Qtb3B0aW9ucy0nICsgdW5pcXVlSUQgKyAnXCIgdmFsdWU9XCInICsgc2FuaXRpemVkTGFiZWxIdG1sICsgJ1wiLz4nKVxyXG4gICAgICAkc2VsZWN0LmJlZm9yZSgkbmV3U2VsZWN0KVxyXG4gICAgICAkbmV3U2VsZWN0LmJlZm9yZShkcm9wZG93bkljb24pXHJcblxyXG4gICAgICAkbmV3U2VsZWN0LmFmdGVyKG9wdGlvbnMpXHJcbiAgICAgIC8vIENoZWNrIGlmIHNlY3Rpb24gZWxlbWVudCBpcyBkaXNhYmxlZFxyXG4gICAgICBpZiAoISRzZWxlY3QuaXMoJzpkaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgJG5ld1NlbGVjdC5kcm9wZG93bih7J2hvdmVyJzogZmFsc2UsICdjbG9zZU9uQ2xpY2snOiBmYWxzZX0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENvcHkgdGFiaW5kZXhcclxuICAgICAgaWYgKCRzZWxlY3QuYXR0cigndGFiaW5kZXgnKSkge1xyXG4gICAgICAgICQoJG5ld1NlbGVjdFswXSkuYXR0cigndGFiaW5kZXgnLCAkc2VsZWN0LmF0dHIoJ3RhYmluZGV4JykpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzZWxlY3QuYWRkQ2xhc3MoJ2luaXRpYWxpemVkJylcclxuXHJcbiAgICAgICRuZXdTZWxlY3Qub24oe1xyXG4gICAgICAgICdmb2N1cyc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmICgkKCd1bC5zZWxlY3QtZHJvcGRvd24nKS5ub3Qob3B0aW9uc1swXSkuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgJCgnaW5wdXQuc2VsZWN0LWRyb3Bkb3duJykudHJpZ2dlcignY2xvc2UnKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCFvcHRpb25zLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignb3BlbicsIFsnZm9jdXMnXSlcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gJCh0aGlzKS52YWwoKVxyXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRPcHRpb24gPSBvcHRpb25zLmZpbmQoJ2xpJykuZmlsdGVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS50ZXh0KCkudG9Mb3dlckNhc2UoKSA9PT0gbGFiZWwudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgICAgICB9KVswXVxyXG4gICAgICAgICAgICBhY3RpdmF0ZU9wdGlvbihvcHRpb25zLCBzZWxlY3RlZE9wdGlvbilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgICd0b3VjaGVuZCBjbGljayc6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgJG5ld1NlbGVjdC5vbignYmx1cicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIW11bHRpcGxlKSB7XHJcbiAgICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ2Nsb3NlJylcclxuICAgICAgICB9XHJcbiAgICAgICAgb3B0aW9ucy5maW5kKCdsaS5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBvcHRpb25zLmhvdmVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBvcHRpb25zSG92ZXIgPSB0cnVlXHJcbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBvcHRpb25zSG92ZXIgPSBmYWxzZVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgJCh3aW5kb3cpLm9uKHtcclxuICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBtdWx0aXBsZSAmJiAob3B0aW9uc0hvdmVyIHx8ICRuZXdTZWxlY3QudHJpZ2dlcignY2xvc2UnKSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBBZGQgaW5pdGlhbCBtdWx0aXBsZSBzZWxlY3Rpb25zLlxyXG4gICAgICBpZiAobXVsdGlwbGUpIHtcclxuICAgICAgICAkc2VsZWN0LmZpbmQoJ29wdGlvbjpzZWxlY3RlZDpub3QoOmRpc2FibGVkKScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGluZGV4ID0gJCh0aGlzKS5pbmRleCgpXHJcblxyXG4gICAgICAgICAgdG9nZ2xlRW50cnlGcm9tQXJyYXkodmFsdWVzU2VsZWN0ZWQsIGluZGV4LCAkc2VsZWN0KVxyXG4gICAgICAgICAgb3B0aW9ucy5maW5kKCdsaScpLmVxKGluZGV4KS5maW5kKCc6Y2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBNYWtlIG9wdGlvbiBhcyBzZWxlY3RlZCBhbmQgc2Nyb2xsIHRvIHNlbGVjdGVkIHBvc2l0aW9uXHJcbiAgICAgIGFjdGl2YXRlT3B0aW9uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIG5ld09wdGlvbikge1xyXG4gICAgICAgIGlmIChuZXdPcHRpb24pIHtcclxuICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCgnbGkuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgdmFyIG9wdGlvbiA9ICQobmV3T3B0aW9uKVxyXG4gICAgICAgICAgb3B0aW9uLmFkZENsYXNzKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgICBvcHRpb25zLnNjcm9sbFRvKG9wdGlvbilcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFsbG93IHVzZXIgdG8gc2VhcmNoIGJ5IHR5cGluZ1xyXG4gICAgICAvLyB0aGlzIGFycmF5IGlzIGNsZWFyZWQgYWZ0ZXIgMSBzZWNvbmRcclxuICAgICAgdmFyIGZpbHRlclF1ZXJ5ID0gW10sXHJcbiAgICAgICAgb25LZXlEb3duID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIC8vIFRBQiAtIHN3aXRjaCB0byBhbm90aGVyIGlucHV0XHJcbiAgICAgICAgICBpZiAoZS53aGljaCA9PSA5KSB7XHJcbiAgICAgICAgICAgICRuZXdTZWxlY3QudHJpZ2dlcignY2xvc2UnKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBBUlJPVyBET1dOIFdIRU4gU0VMRUNUIElTIENMT1NFRCAtIG9wZW4gc2VsZWN0IG9wdGlvbnNcclxuICAgICAgICAgIGlmIChlLndoaWNoID09IDQwICYmICFvcHRpb25zLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICRuZXdTZWxlY3QudHJpZ2dlcignb3BlbicpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIEVOVEVSIFdIRU4gU0VMRUNUIElTIENMT1NFRCAtIHN1Ym1pdCBmb3JtXHJcbiAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMyAmJiAhb3B0aW9ucy5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAgICAgICAvLyBDQVNFIFdIRU4gVVNFUiBUWVBFIExFVFRFUlNcclxuICAgICAgICAgIHZhciBsZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgIG5vbkxldHRlcnMgPSBbOSwgMTMsIDI3LCAzOCwgNDBdXHJcbiAgICAgICAgICBpZiAobGV0dGVyICYmIChub25MZXR0ZXJzLmluZGV4T2YoZS53aGljaCkgPT09IC0xKSkge1xyXG4gICAgICAgICAgICBmaWx0ZXJRdWVyeS5wdXNoKGxldHRlcilcclxuXHJcbiAgICAgICAgICAgIHZhciBzdHJpbmcgPSBmaWx0ZXJRdWVyeS5qb2luKCcnKSxcclxuICAgICAgICAgICAgICBuZXdPcHRpb24gPSBvcHRpb25zLmZpbmQoJ2xpJykuZmlsdGVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLnRleHQoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc3RyaW5nKSA9PT0gMFxyXG4gICAgICAgICAgICAgIH0pWzBdXHJcblxyXG4gICAgICAgICAgICBpZiAobmV3T3B0aW9uKSB7XHJcbiAgICAgICAgICAgICAgYWN0aXZhdGVPcHRpb24ob3B0aW9ucywgbmV3T3B0aW9uKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gRU5URVIgLSBzZWxlY3Qgb3B0aW9uIGFuZCBjbG9zZSB3aGVuIHNlbGVjdCBvcHRpb25zIGFyZSBvcGVuZWRcclxuICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgICAgIHZhciBhY3RpdmVPcHRpb24gPSBvcHRpb25zLmZpbmQoJ2xpLnNlbGVjdGVkOm5vdCguZGlzYWJsZWQpJylbMF1cclxuICAgICAgICAgICAgaWYgKGFjdGl2ZU9wdGlvbikge1xyXG4gICAgICAgICAgICAgICQoYWN0aXZlT3B0aW9uKS50cmlnZ2VyKCdjbGljaycpXHJcbiAgICAgICAgICAgICAgaWYgKCFtdWx0aXBsZSkge1xyXG4gICAgICAgICAgICAgICAgJG5ld1NlbGVjdC50cmlnZ2VyKCdjbG9zZScpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gQVJST1cgRE9XTiAtIG1vdmUgdG8gbmV4dCBub3QgZGlzYWJsZWQgb3B0aW9uXHJcbiAgICAgICAgICBpZiAoZS53aGljaCA9PSA0MCkge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5maW5kKCdsaS5zZWxlY3RlZCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIG5ld09wdGlvbiA9IG9wdGlvbnMuZmluZCgnbGkuc2VsZWN0ZWQnKS5uZXh0KCdsaTpub3QoLmRpc2FibGVkKScpWzBdXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbmV3T3B0aW9uID0gb3B0aW9ucy5maW5kKCdsaTpub3QoLmRpc2FibGVkKScpWzBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWN0aXZhdGVPcHRpb24ob3B0aW9ucywgbmV3T3B0aW9uKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIEVTQyAtIGNsb3NlIG9wdGlvbnNcclxuICAgICAgICAgIGlmIChlLndoaWNoID09IDI3KSB7XHJcbiAgICAgICAgICAgICRuZXdTZWxlY3QudHJpZ2dlcignY2xvc2UnKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIEFSUk9XIFVQIC0gbW92ZSB0byBwcmV2aW91cyBub3QgZGlzYWJsZWQgb3B0aW9uXHJcbiAgICAgICAgICBpZiAoZS53aGljaCA9PSAzOCkge1xyXG4gICAgICAgICAgICBuZXdPcHRpb24gPSBvcHRpb25zLmZpbmQoJ2xpLnNlbGVjdGVkJykucHJldignbGk6bm90KC5kaXNhYmxlZCknKVswXVxyXG4gICAgICAgICAgICBpZiAobmV3T3B0aW9uKVxyXG4gICAgICAgICAgICAgIGFjdGl2YXRlT3B0aW9uKG9wdGlvbnMsIG5ld09wdGlvbilcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBBdXRvbWF0aWNhbHkgY2xlYW4gZmlsdGVyIHF1ZXJ5IHNvIHVzZXIgY2FuIHNlYXJjaCBhZ2FpbiBieSBzdGFydGluZyBsZXR0ZXJzXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgZmlsdGVyUXVlcnkgPSBbXTsgfSwgMTAwMClcclxuICAgICAgfVxyXG5cclxuICAgICAgJG5ld1NlbGVjdC5vbigna2V5ZG93bicsIG9uS2V5RG93bilcclxuICAgIH0pXHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlRW50cnlGcm9tQXJyYXkgKGVudHJpZXNBcnJheSwgZW50cnlJbmRleCwgc2VsZWN0KSB7XHJcbiAgICAgIHZhciBpbmRleCA9IGVudHJpZXNBcnJheS5pbmRleE9mKGVudHJ5SW5kZXgpLFxyXG4gICAgICAgIG5vdEFkZGVkID0gaW5kZXggPT09IC0xXHJcblxyXG4gICAgICBpZiAobm90QWRkZWQpIHtcclxuICAgICAgICBlbnRyaWVzQXJyYXkucHVzaChlbnRyeUluZGV4KVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVudHJpZXNBcnJheS5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGVjdC5zaWJsaW5ncygndWwuZHJvcGRvd24tY29udGVudCcpLmZpbmQoJ2xpJykuZXEoZW50cnlJbmRleCkudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAvLyB1c2Ugbm90QWRkZWQgaW5zdGVhZCBvZiB0cnVlICh0byBkZXRlY3QgaWYgdGhlIG9wdGlvbiBpcyBzZWxlY3RlZCBvciBub3QpXHJcbiAgICAgIHNlbGVjdC5maW5kKCdvcHRpb24nKS5lcShlbnRyeUluZGV4KS5wcm9wKCdzZWxlY3RlZCcsIG5vdEFkZGVkKVxyXG4gICAgICBzZXRWYWx1ZVRvSW5wdXQoZW50cmllc0FycmF5LCBzZWxlY3QpXHJcblxyXG4gICAgICByZXR1cm4gbm90QWRkZWRcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXRWYWx1ZVRvSW5wdXQgKGVudHJpZXNBcnJheSwgc2VsZWN0KSB7XHJcbiAgICAgIHZhciB2YWx1ZSA9ICcnXHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMCwgY291bnQgPSBlbnRyaWVzQXJyYXkubGVuZ3RoOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgIHZhciB0ZXh0ID0gc2VsZWN0LmZpbmQoJ29wdGlvbicpLmVxKGVudHJpZXNBcnJheVtpXSkudGV4dCgpXHJcblxyXG4gICAgICAgIGkgPT09IDAgPyB2YWx1ZSArPSB0ZXh0IDogdmFsdWUgKz0gJywgJyArIHRleHRcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHZhbHVlID09PSAnJykge1xyXG4gICAgICAgIHZhbHVlID0gc2VsZWN0LmZpbmQoJ29wdGlvbjpkaXNhYmxlZCcpLmVxKDApLnRleHQoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxlY3Quc2libGluZ3MoJ2lucHV0LnNlbGVjdC1kcm9wZG93bicpLnZhbCh2YWx1ZSlcclxuICAgIH1cclxuICB9XHJcbn0oalF1ZXJ5KSk7XHJcblxyXG5qUXVlcnkoJ3NlbGVjdCcpLnNpYmxpbmdzKCdpbnB1dC5zZWxlY3QtZHJvcGRvd24nKS5vbignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHtcclxuICBpZiAoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XHJcbiAgICBpZiAoZS5jbGllbnRYID49IGUudGFyZ2V0LmNsaWVudFdpZHRoIHx8IGUuY2xpZW50WSA+PSBlLnRhcmdldC5jbGllbnRIZWlnaHQpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIiwiLy8gUmVxdWlyZWQgZm9yIE1ldGVvciBwYWNrYWdlLCB0aGUgdXNlIG9mIHdpbmRvdyBwcmV2ZW50cyBleHBvcnQgYnkgTWV0ZW9yXHJcbihmdW5jdGlvbih3aW5kb3cpe1xyXG4gIGlmKHdpbmRvdy5QYWNrYWdlKXtcclxuICAgIE1hdGVyaWFsaXplID0ge307XHJcbiAgfSBlbHNlIHtcclxuICAgIHdpbmRvdy5NYXRlcmlhbGl6ZSA9IHt9O1xyXG4gIH1cclxufSkod2luZG93KTtcclxuXHJcblxyXG4vLyBVbmlxdWUgSURcclxuTWF0ZXJpYWxpemUuZ3VpZCA9IChmdW5jdGlvbigpIHtcclxuICBmdW5jdGlvbiBzNCgpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgfVxyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBzNCgpICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICtcclxuICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gIH07XHJcbn0pKCk7XHJcblxyXG5NYXRlcmlhbGl6ZS5lbGVtZW50T3JQYXJlbnRJc0ZpeGVkID0gZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KTtcclxuICAgIHZhciAkY2hlY2tFbGVtZW50cyA9ICRlbGVtZW50LmFkZCgkZWxlbWVudC5wYXJlbnRzKCkpO1xyXG4gICAgdmFyIGlzRml4ZWQgPSBmYWxzZTtcclxuICAgICRjaGVja0VsZW1lbnRzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiAoJCh0aGlzKS5jc3MoXCJwb3NpdGlvblwiKSA9PT0gXCJmaXhlZFwiKSB7XHJcbiAgICAgICAgICAgIGlzRml4ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gaXNGaXhlZDtcclxufTtcclxuXHJcbi8vIFZlbG9jaXR5IGhhcyBjb25mbGljdHMgd2hlbiBsb2FkZWQgd2l0aCBqUXVlcnksIHRoaXMgd2lsbCBjaGVjayBmb3IgaXRcclxudmFyIFZlbDtcclxuaWYgKCQpIHtcclxuICBWZWwgPSAkLlZlbG9jaXR5O1xyXG59IGVsc2UgaWYgKGpRdWVyeSkge1xyXG4gIFZlbCA9IGpRdWVyeS5WZWxvY2l0eTtcclxufSBlbHNlIHtcclxuICBWZWwgPSBWZWxvY2l0eTtcclxufVxyXG4iLCIvKlxyXG4gKiBqUXVlcnkgRWFzaW5nIHYxLjMgLSBodHRwOi8vZ3NnZC5jby51ay9zYW5kYm94L2pxdWVyeS9lYXNpbmcvXHJcbiAqXHJcbiAqIFVzZXMgdGhlIGJ1aWx0IGluIGVhc2luZyBjYXBhYmlsaXRpZXMgYWRkZWQgSW4galF1ZXJ5IDEuMVxyXG4gKiB0byBvZmZlciBtdWx0aXBsZSBlYXNpbmcgb3B0aW9uc1xyXG4gKlxyXG4gKiBURVJNUyBPRiBVU0UgLSBqUXVlcnkgRWFzaW5nXHJcbiAqXHJcbiAqIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS5cclxuICpcclxuICogQ29weXJpZ2h0IMKpIDIwMDggR2VvcmdlIE1jR2lubGV5IFNtaXRoXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sXHJcbiAqIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuICpcclxuICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2ZcclxuICogY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG4gKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdFxyXG4gKiBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFsc1xyXG4gKiBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXHJcbiAqXHJcbiAqIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGF1dGhvciBub3IgdGhlIG5hbWVzIG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlXHJcbiAqIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcbiAqXHJcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTllcclxuICogRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GXHJcbiAqIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiAgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxyXG4gKiAgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFXHJcbiAqICBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRURcclxuICogQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcclxuICogIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEXHJcbiAqIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cclxuICpcclxuKi9cclxuXHJcbi8vIHQ6IGN1cnJlbnQgdGltZSwgYjogYmVnSW5uSW5nIHZhbHVlLCBjOiBjaGFuZ2UgSW4gdmFsdWUsIGQ6IGR1cmF0aW9uXHJcbmpRdWVyeS5lYXNpbmdbJ2pzd2luZyddID0galF1ZXJ5LmVhc2luZ1snc3dpbmcnXTtcclxuXHJcbmpRdWVyeS5leHRlbmQoIGpRdWVyeS5lYXNpbmcsXHJcbntcclxuXHRkZWY6ICdlYXNlT3V0UXVhZCcsXHJcblx0c3dpbmc6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHQvL2FsZXJ0KGpRdWVyeS5lYXNpbmcuZGVmYXVsdCk7XHJcblx0XHRyZXR1cm4galF1ZXJ5LmVhc2luZ1tqUXVlcnkuZWFzaW5nLmRlZl0oeCwgdCwgYiwgYywgZCk7XHJcblx0fSxcclxuXHRlYXNlSW5RdWFkOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0cmV0dXJuIGMqKHQvPWQpKnQgKyBiO1xyXG5cdH0sXHJcblx0ZWFzZU91dFF1YWQ6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRyZXR1cm4gLWMgKih0Lz1kKSoodC0yKSArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQgKyBiO1xyXG5cdFx0cmV0dXJuIC1jLzIgKiAoKC0tdCkqKHQtMikgLSAxKSArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5DdWJpYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdHJldHVybiBjKih0Lz1kKSp0KnQgKyBiO1xyXG5cdH0sXHJcblx0ZWFzZU91dEN1YmljOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0cmV0dXJuIGMqKCh0PXQvZC0xKSp0KnQgKyAxKSArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQgKyBiO1xyXG5cdFx0cmV0dXJuIGMvMiooKHQtPTIpKnQqdCArIDIpICsgYjtcclxuXHR9LFxyXG5cdGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0cmV0dXJuIGMqKHQvPWQpKnQqdCp0ICsgYjtcclxuXHR9LFxyXG5cdGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdHJldHVybiAtYyAqICgodD10L2QtMSkqdCp0KnQgLSAxKSArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCArIGI7XHJcblx0XHRyZXR1cm4gLWMvMiAqICgodC09MikqdCp0KnQgLSAyKSArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5RdWludDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdHJldHVybiBjKih0Lz1kKSp0KnQqdCp0ICsgYjtcclxuXHR9LFxyXG5cdGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdHJldHVybiBjKigodD10L2QtMSkqdCp0KnQqdCArIDEpICsgYjtcclxuXHR9LFxyXG5cdGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQqdCp0KnQgKyBiO1xyXG5cdFx0cmV0dXJuIGMvMiooKHQtPTIpKnQqdCp0KnQgKyAyKSArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5TaW5lOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0cmV0dXJuIC1jICogTWF0aC5jb3ModC9kICogKE1hdGguUEkvMikpICsgYyArIGI7XHJcblx0fSxcclxuXHRlYXNlT3V0U2luZTogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdHJldHVybiBjICogTWF0aC5zaW4odC9kICogKE1hdGguUEkvMikpICsgYjtcclxuXHR9LFxyXG5cdGVhc2VJbk91dFNpbmU6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRyZXR1cm4gLWMvMiAqIChNYXRoLmNvcyhNYXRoLlBJKnQvZCkgLSAxKSArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5FeHBvOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0cmV0dXJuICh0PT0wKSA/IGIgOiBjICogTWF0aC5wb3coMiwgMTAgKiAodC9kIC0gMSkpICsgYjtcclxuXHR9LFxyXG5cdGVhc2VPdXRFeHBvOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0cmV0dXJuICh0PT1kKSA/IGIrYyA6IGMgKiAoLU1hdGgucG93KDIsIC0xMCAqIHQvZCkgKyAxKSArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0aWYgKHQ9PTApIHJldHVybiBiO1xyXG5cdFx0aWYgKHQ9PWQpIHJldHVybiBiK2M7XHJcblx0XHRpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gYy8yICogTWF0aC5wb3coMiwgMTAgKiAodCAtIDEpKSArIGI7XHJcblx0XHRyZXR1cm4gYy8yICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLXQpICsgMikgKyBiO1xyXG5cdH0sXHJcblx0ZWFzZUluQ2lyYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdHJldHVybiAtYyAqIChNYXRoLnNxcnQoMSAtICh0Lz1kKSp0KSAtIDEpICsgYjtcclxuXHR9LFxyXG5cdGVhc2VPdXRDaXJjOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0cmV0dXJuIGMgKiBNYXRoLnNxcnQoMSAtICh0PXQvZC0xKSp0KSArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIC1jLzIgKiAoTWF0aC5zcXJ0KDEgLSB0KnQpIC0gMSkgKyBiO1xyXG5cdFx0cmV0dXJuIGMvMiAqIChNYXRoLnNxcnQoMSAtICh0LT0yKSp0KSArIDEpICsgYjtcclxuXHR9LFxyXG5cdGVhc2VJbkVsYXN0aWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcz0xLjcwMTU4O3ZhciBwPTA7dmFyIGE9YztcclxuXHRcdGlmICh0PT0wKSByZXR1cm4gYjsgIGlmICgodC89ZCk9PTEpIHJldHVybiBiK2M7ICBpZiAoIXApIHA9ZCouMztcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHsgYT1jOyB2YXIgcz1wLzQ7IH1cclxuXHRcdGVsc2UgdmFyIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luIChjL2EpO1xyXG5cdFx0cmV0dXJuIC0oYSpNYXRoLnBvdygyLDEwKih0LT0xKSkgKiBNYXRoLnNpbiggKHQqZC1zKSooMipNYXRoLlBJKS9wICkpICsgYjtcclxuXHR9LFxyXG5cdGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHM9MS43MDE1ODt2YXIgcD0wO3ZhciBhPWM7XHJcblx0XHRpZiAodD09MCkgcmV0dXJuIGI7ICBpZiAoKHQvPWQpPT0xKSByZXR1cm4gYitjOyAgaWYgKCFwKSBwPWQqLjM7XHJcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7IGE9YzsgdmFyIHM9cC80OyB9XHJcblx0XHRlbHNlIHZhciBzID0gcC8oMipNYXRoLlBJKSAqIE1hdGguYXNpbiAoYy9hKTtcclxuXHRcdHJldHVybiBhKk1hdGgucG93KDIsLTEwKnQpICogTWF0aC5zaW4oICh0KmQtcykqKDIqTWF0aC5QSSkvcCApICsgYyArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5PdXRFbGFzdGljOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHM9MS43MDE1ODt2YXIgcD0wO3ZhciBhPWM7XHJcblx0XHRpZiAodD09MCkgcmV0dXJuIGI7ICBpZiAoKHQvPWQvMik9PTIpIHJldHVybiBiK2M7ICBpZiAoIXApIHA9ZCooLjMqMS41KTtcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHsgYT1jOyB2YXIgcz1wLzQ7IH1cclxuXHRcdGVsc2UgdmFyIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luIChjL2EpO1xyXG5cdFx0aWYgKHQgPCAxKSByZXR1cm4gLS41KihhKk1hdGgucG93KDIsMTAqKHQtPTEpKSAqIE1hdGguc2luKCAodCpkLXMpKigyKk1hdGguUEkpL3AgKSkgKyBiO1xyXG5cdFx0cmV0dXJuIGEqTWF0aC5wb3coMiwtMTAqKHQtPTEpKSAqIE1hdGguc2luKCAodCpkLXMpKigyKk1hdGguUEkpL3AgKSouNSArIGMgKyBiO1xyXG5cdH0sXHJcblx0ZWFzZUluQmFjazogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyoodC89ZCkqdCooKHMrMSkqdCAtIHMpICsgYjtcclxuXHR9LFxyXG5cdGVhc2VPdXRCYWNrOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCwgcykge1xyXG5cdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcclxuXHRcdHJldHVybiBjKigodD10L2QtMSkqdCooKHMrMSkqdCArIHMpICsgMSkgKyBiO1xyXG5cdH0sXHJcblx0ZWFzZUluT3V0QmFjazogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gYy8yKih0KnQqKCgocyo9KDEuNTI1KSkrMSkqdCAtIHMpKSArIGI7XHJcblx0XHRyZXR1cm4gYy8yKigodC09MikqdCooKChzKj0oMS41MjUpKSsxKSp0ICsgcykgKyAyKSArIGI7XHJcblx0fSxcclxuXHRlYXNlSW5Cb3VuY2U6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRyZXR1cm4gYyAtIGpRdWVyeS5lYXNpbmcuZWFzZU91dEJvdW5jZSAoeCwgZC10LCAwLCBjLCBkKSArIGI7XHJcblx0fSxcclxuXHRlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0aWYgKCh0Lz1kKSA8ICgxLzIuNzUpKSB7XHJcblx0XHRcdHJldHVybiBjKig3LjU2MjUqdCp0KSArIGI7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAoMi8yLjc1KSkge1xyXG5cdFx0XHRyZXR1cm4gYyooNy41NjI1Kih0LT0oMS41LzIuNzUpKSp0ICsgLjc1KSArIGI7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAoMi41LzIuNzUpKSB7XHJcblx0XHRcdHJldHVybiBjKig3LjU2MjUqKHQtPSgyLjI1LzIuNzUpKSp0ICsgLjkzNzUpICsgYjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBjKig3LjU2MjUqKHQtPSgyLjYyNS8yLjc1KSkqdCArIC45ODQzNzUpICsgYjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGVhc2VJbk91dEJvdW5jZTogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdGlmICh0IDwgZC8yKSByZXR1cm4galF1ZXJ5LmVhc2luZy5lYXNlSW5Cb3VuY2UgKHgsIHQqMiwgMCwgYywgZCkgKiAuNSArIGI7XHJcblx0XHRyZXR1cm4galF1ZXJ5LmVhc2luZy5lYXNlT3V0Qm91bmNlICh4LCB0KjItZCwgMCwgYywgZCkgKiAuNSArIGMqLjUgKyBiO1xyXG5cdH1cclxufSk7XHJcblxyXG4vKlxyXG4gKlxyXG4gKiBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXHJcbiAqXHJcbiAqIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS5cclxuICpcclxuICogQ29weXJpZ2h0IMKpIDIwMDEgUm9iZXJ0IFBlbm5lclxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLFxyXG4gKiBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbiAqXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mXHJcbiAqIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3RcclxuICogb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHNcclxuICogcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4gKlxyXG4gKiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBhdXRob3Igbm9yIHRoZSBuYW1lcyBvZiBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZVxyXG4gKiBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxyXG4gKlxyXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZXHJcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRlxyXG4gKiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuICogIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcclxuICogIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURVxyXG4gKiAgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEXHJcbiAqIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXHJcbiAqICBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRFxyXG4gKiBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXHJcbiAqXHJcbiAqLyIsIi8vIG1hdGVyaWFsX3NlbGVjdFxuLy8gbm8gc2ltcGxlIHdheSB0byBtYW5hZ2UgdGhlc2UgZHVtYiBNREJvb3RzdHJhcCBjb21wb25lbnRzXG5yZXF1aXJlKCdtZGJvb3RzdHJhcC9qcy9tb2R1bGVzL2dsb2JhbCcpXG5yZXF1aXJlKCdtZGJvb3RzdHJhcC9qcy9tb2R1bGVzL2pxdWVyeS1lYXNpbmcnKVxucmVxdWlyZSgnbWRib290c3RyYXAvanMvbW9kdWxlcy9kcm9wZG93bicpXG5yZXF1aXJlKCdtZGJvb3RzdHJhcC9qcy9tb2R1bGVzL2Zvcm1zJylcblxuLy8gYXVnbWVudHMgTURCb290c3RyYXAncyBtYXRlcmlhbF9zZWxlY3QoKVxud2luZG93LmFjY2VsU2VsZWN0ID0gZnVuY3Rpb24oJHNlbGVjdG9yKSB7XG4gICRzZWxlY3Rvci5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICBsZXQgJHNlbGVjdEVsID0gJCh0aGlzKVxuICAgIGxldCBpbml0U2VsZWN0ZWRJbmRleCA9ICRzZWxlY3RFbC5maW5kKCdvcHRpb25bc2VsZWN0ZWRdJykuaW5kZXgoKVxuXG4gICAgJHNlbGVjdEVsLm1hdGVyaWFsX3NlbGVjdCgpXG5cbiAgICAvLyBhZGQgJ2FjdGl2ZScgY2xhc3MgdG8gaW5pdGlhbCBzZWxlY3Rpb25cbiAgICAkc2VsZWN0RWxcbiAgICAgIC5zaWJsaW5ncygndWwnKVxuICAgICAgLmZpbmQoJ2xpJylcbiAgICAgIC5lcShpbml0U2VsZWN0ZWRJbmRleClcbiAgICAgIC5hZGRDbGFzcygnYWN0aXZlIHNlbGVjdGVkJylcblxuICAgIGFwcGx5T3B0aW9uQ2xhc3Nlcygkc2VsZWN0RWwpXG5cbiAgICAkc2VsZWN0RWwub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIHVwZGF0ZVNlbGVjdCgkc2VsZWN0RWwpXG4gICAgfSlcbiAgfSlcbn1cblxuLy8gYXBwbGllcyBjbGFzc2VzIG9uIDxvcHRpb24+IHRvIG1hdGNoaW5nIGNyZWF0ZWQgPGxpPlxuZnVuY3Rpb24gYXBwbHlPcHRpb25DbGFzc2VzKCRzZWxlY3RFbCkge1xuICAkc2VsZWN0RWwuZmluZCgnb3B0aW9uJykuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgbGV0IGNsYXNzZXMgPSAkKHRoaXMpLmF0dHIoJ2NsYXNzJylcbiAgICBsZXQgb3B0aW9uSW5kZXggPSAkKHRoaXMpLmluZGV4KClcblxuICAgICRzZWxlY3RFbFxuICAgICAgLnNpYmxpbmdzKCd1bCcpXG4gICAgICAuZmluZCgnbGknKVxuICAgICAgLmVxKG9wdGlvbkluZGV4KVxuICAgICAgLmFkZENsYXNzKGNsYXNzZXMpXG4gIH0pXG59XG5cbi8vIHVwZGF0ZSAxc3QgPGxpPiB3aXRoIHNlbGVjdGlvblxuZnVuY3Rpb24gdXBkYXRlU2VsZWN0KCRzZWxlY3RFbCkge1xuICBsZXQgJHNlbGVjdFVsID0gJHNlbGVjdEVsLnNpYmxpbmdzKCd1bCcpXG5cbiAgJHNlbGVjdFVsXG4gICAgLmZpbmQoJ2xpOmZpcnN0LWNoaWxkJylcbiAgICAucmVtb3ZlKClcbiAgJHNlbGVjdFVsXG4gICAgLmZpbmQoJ2xpLnNlbGVjdGVkJylcbiAgICAuY2xvbmUoKVxuICAgIC5yZW1vdmVDbGFzcygpXG4gICAgLmFkZENsYXNzKCdkaXNhYmxlZCcpXG4gICAgLnByZXBlbmRUbygkc2VsZWN0VWwpXG59XG4iLCJyZXF1aXJlKCdkcm9wZG93bicpXG5cbiQoKCkgPT4ge1xuICBhY2NlbFNlbGVjdCgkKCcubWRiLXNlbGVjdCcpKVxufSlcbiIsInJlcXVpcmUoJ2xhbmctc2VsZWN0JylcblxuJCgoKSA9PiB7XG4gIGNvbnN0IHBhZ2VDbGFzcyA9ICcucGFnZS1sb2dpbidcbiAgY29uc3QgJHdpbiA9ICQod2luZG93KVxuICBjb25zdCAkaGVhZGVyID0gJChwYWdlQ2xhc3MgKyAnX19oZWFkZXInKVxuICBjb25zdCAkZm9vdGVyID0gJChwYWdlQ2xhc3MgKyAnX19mb290ZXInKVxuICBjb25zdCAkYm9keSA9ICQocGFnZUNsYXNzICsgJ19fYm9keScpXG4gIGNvbnN0ICRoZWxwU2NyaW0gPSAkKHBhZ2VDbGFzcyArICdfX2Rlc2t0b3AtaGVscC1zY3JpbScpXG4gIGNvbnN0ICRoZWxwUGFuZWwgPSAkKHBhZ2VDbGFzcyArICdfX2Rlc2t0b3AtaGVscC1wYW5lbCcpXG5cbiAgLy8gR2xvYmFsXG4gIC8vIG9uIGRlc2t0b3AsIHdoZW4gY29udGVudCBpcyB0YWxsLCBjaGFuZ2UgZm9vdGVyIHRvIHBvc2l0aW9uXG4gIC8vIHJlbGF0aXZlIHNvIGNvbnRlbnQgYW5kIGZvb3RlciBkb24ndCBpbnRlcnNlY3RcbiAgaWYoJGJvZHkuaGFzQ2xhc3MoJ2lzLXJlbGF0aXZlJykpIHtcbiAgICBjb25zdCBjaGVja0NvbnRlbnRIZWlnaHQgPSAoKSA9PiB7XG4gICAgICBpZigkd2luLndpZHRoKCkgPCA3NjgpIHJldHVyblxuICAgICAgbGV0IHBhZCA9IDIwMFxuICAgICAgbGV0IGF2YWlsSCA9ICR3aW4uaGVpZ2h0KCkgLSAoJGhlYWRlci5oZWlnaHQoKSArICRmb290ZXIuaGVpZ2h0KCkpIC0gcGFkXG4gICAgICAkZm9vdGVyLnRvZ2dsZUNsYXNzKCdpcy1maXhlZCcsIChhdmFpbEggPiAkYm9keS5oZWlnaHQoKSkpXG4gICAgfVxuXG4gICAgJHdpbi5vbigncmVzaXplJywgXy5kZWJvdW5jZShjaGVja0NvbnRlbnRIZWlnaHQsIDIwMCkpXG4gICAgY2hlY2tDb250ZW50SGVpZ2h0KClcbiAgfVxuXG4gIC8vIGRlc2t0b3AgaGVscCBtZW51IGxpbmtcbiAgJChwYWdlQ2xhc3MgKyAnX19oZWxwLXByb21wdCcpLm9uKCdjbGljaycsIGUgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHNob3dMb2dpbkhlbHBQYW5lbCgpXG4gIH0pXG5cbiAgJGhlbHBTY3JpbS5vbignY2xpY2snLCBoaWRlTG9naW5IZWxwUGFuZWwpXG5cbiAgLy8gZGVza3RvcCBoZWxwIGNsb3NlIHBhbmVsIGxpbmtcbiAgJChwYWdlQ2xhc3MgKyAnX19kZXNrdG9wLWhlbHAtcGFuZWwtaGVhZGVyJykub24oJ2NsaWNrJywgZSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGlkZUxvZ2luSGVscFBhbmVsKClcbiAgfSlcblxuICBmdW5jdGlvbiBzaG93TG9naW5IZWxwUGFuZWwoKSB7XG4gICAgJGhlbHBTY3JpbS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAkaGVscFBhbmVsLmFkZENsYXNzKCdhY3RpdmUnKVxuICB9XG5cbiAgZnVuY3Rpb24gaGlkZUxvZ2luSGVscFBhbmVsKCkge1xuICAgICRoZWxwU2NyaW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgJGhlbHBQYW5lbC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgfVxuXG5cbiAgLy8gUm9sZSBTZWxlY3RcbiAgLy8gaGlkZSBib3R0b20gYm9yZGVyIG9mIHRoZSBpdGVtIGFib3ZlIHRoYXQgd2hpY2ggaXMgaG92ZXJlZFxuICAvLyBhbmQgZGltIG5vbi1zZWxlY3RlZCBpdGVtc1xuICAkKHBhZ2VDbGFzcyArICdfX3JvbGUtbGlzdC1pdGVtJykuaG92ZXIoZSA9PiB7XG4gICAgJChlLmN1cnJlbnRUYXJnZXQpLnByZXYoKS5hZGRDbGFzcygnbm8tYm9yZGVyJylcbiAgICAkKGUuY3VycmVudFRhcmdldCkuc2libGluZ3MoKS5hZGRDbGFzcygnZGVzZWxlY3RlZCcpXG4gIH0sIGUgPT4ge1xuICAgICQoZS5jdXJyZW50VGFyZ2V0KS5wcmV2KCkucmVtb3ZlQ2xhc3MoJ25vLWJvcmRlcicpXG4gICAgJChlLmN1cnJlbnRUYXJnZXQpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2Rlc2VsZWN0ZWQnKVxuICB9KVxufSlcbiJdfQ==
