// Saves options to localStorage.
function save_options() {
  var options = {'trigger_hover' : document.getElementById("HTTTriggerHover").checked,
                  'HTTtooltipDelay' : document.getElementById("HTTTriggerHoverDelay").value,

                  'trigger_click' : document.getElementById("HTTTriggerClick").checked,
                  'trigger_click_ctrl' : document.getElementById("HTTTriggerClickCtrl").checked,
                  'trigger_click_alt' : document.getElementById("HTTTriggerClickAlt").checked,
                  'trigger_click_shift' : document.getElementById("HTTTriggerClickShift").checked,

                  'trigger_highlight' : document.getElementById("HTTTriggerHighlight").checked,
                  'trigger_highlight_ctrl' : document.getElementById("HTTTriggerHighlightCtrl").checked,
                  'trigger_highlight_alt' : document.getElementById("HTTTriggerHighlightAlt").checked,
                  'trigger_highlight_shift' : document.getElementById("HTTTriggerHighlightShift").checked,

                  'trigger_keyboard' : document.getElementById("HTTTriggerKeyboard").checked,
                  'trigger_keyboard_ctrl' : document.getElementById("HTTTriggerKeyboardCtrl").checked,
                  'trigger_keyboard_alt' : document.getElementById("HTTTriggerKeyboardAlt").checked,
                  'trigger_keyboard_shift' : document.getElementById("HTTTriggerKeyboardShift").checked,
                  'HTTtooltipCharacter' : document.getElementById("HTTTriggerKeyboardCharacter").value,

                  'hide_move' : document.getElementById("HTTHideMove").checked,
                  'hide_click' : document.getElementById("HTTHideClick").checked,
                  'hide_scroll' : document.getElementById("HTTHideScroll").checked,
                  'hide_keyboard' : document.getElementById("HTTHideKeyboard").checked,

                  'align_top' : document.getElementById("HTTLocationY1").checked,
                  'align_left' : document.getElementById("HTTLocationX1").checked,
                  'keep_on_screen' : document.getElementById("HTTKeepOnScreen").checked,
                  
                  'activity_indicator' : document.getElementById("HTTActivityIndicator").checked};
  localStorage["options"] = JSON.stringify(options);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var options = localStorage['options'] && JSON.parse(localStorage['options']);
  if (!options) {
    options = {};
  }
  if(options['trigger_hover'] == undefined) options['trigger_hover'] = 1;
  if(options['HTTtooltipDelay'] == undefined) options['HTTtooltipDelay'] = 1000;

  if(options['trigger_click'] == undefined) options['trigger_click'] = 0;
  if(options['trigger_click_ctrl'] == undefined) options['trigger_click_ctrl'] = 0;
  if(options['trigger_click_alt'] == undefined) options['trigger_click_alt'] = 0;
  if(options['trigger_click_shift'] == undefined) options['trigger_click_shift'] = 0;
  
  if(options['trigger_highlight'] == undefined) options['trigger_highlight'] = 0;
  if(options['trigger_highlight_ctrl'] == undefined) options['trigger_highlight_ctrl'] = 0;
  if(options['trigger_highlight_alt'] == undefined) options['trigger_highlight_alt'] = 0;
  if(options['trigger_highlight_shift'] == undefined) options['trigger_highlight_shift'] = 0;

  if(options['trigger_keyboard'] == undefined) options['trigger_keyboard'] = 0;
  if(options['trigger_keyboard_ctrl'] == undefined) options['trigger_keyboard_ctrl'] = 0;
  if(options['trigger_keyboard_alt'] == undefined) options['trigger_keyboard_alt'] = 0;
  if(options['trigger_keyboard_shift'] == undefined) options['trigger_keyboard_shift'] = 0;
  if(options['HTTtooltipCharacter'] == undefined) options['HTTtooltipCharacter'] = 'T';

  if(options['hide_move'] == undefined) options['hide_move'] = 1;
  if(options['hide_click'] == undefined) options['hide_click'] = 1;
  if(options['hide_scroll'] == undefined) options['hide_scroll'] = 1;
  if(options['hide_keyboard'] == undefined) options['hide_keyboard'] = 1;

  if(options['align_top'] == undefined) options['align_top'] = 1;
  if(options['align_left'] == undefined) options['align_left'] = 1;
  if(options['keep_on_screen'] == undefined) options['keep_on_screen'] = 1;
  
  if(options['activity_indicator'] == undefined) options['activity_indicator'] = 1;

  document.getElementById("HTTTriggerHover").checked = options['trigger_hover'];
  document.getElementById("HTTTriggerHoverDelay").value = options['HTTtooltipDelay'];

  document.getElementById("HTTTriggerClick").checked = options['trigger_click'];
  document.getElementById("HTTTriggerClickCtrl").checked = options['trigger_click_ctrl'];
  document.getElementById("HTTTriggerClickAlt").checked = options['trigger_click_alt'];
  document.getElementById("HTTTriggerClickShift").checked = options['trigger_click_shift'];

  document.getElementById("HTTTriggerHighlight").checked = options['trigger_highlight'];
  document.getElementById("HTTTriggerHighlightCtrl").checked = options['trigger_highlight_ctrl'];
  document.getElementById("HTTTriggerHighlightAlt").checked = options['trigger_highlight_alt'];
  document.getElementById("HTTTriggerHighlightShift").checked = options['trigger_highlight_shift'];

  document.getElementById("HTTTriggerKeyboard").checked = options['trigger_keyboard'];
  document.getElementById("HTTTriggerKeyboardCtrl").checked = options['trigger_keyboard_ctrl'];
  document.getElementById("HTTTriggerKeyboardAlt").checked = options['trigger_keyboard_alt'];
  document.getElementById("HTTTriggerKeyboardShift").checked = options['trigger_keyboard_shift'];
  document.getElementById("HTTTriggerKeyboardCharacter").value = options['HTTtooltipCharacter'];

  document.getElementById("HTTHideMove").checked = options['hide_move'];
  document.getElementById("HTTHideClick").checked = options['hide_click'];
  document.getElementById("HTTHideScroll").checked = options['hide_scroll'];
  document.getElementById("HTTHideKeyboard").checked = options['hide_keyboard'];

  document.getElementById("HTTLocationY1").checked = options['align_top'];
  document.getElementById("HTTLocationX1").checked = options['align_left'];
  document.getElementById("HTTLocationY0").checked = !options['align_top'];
  document.getElementById("HTTLocationX0").checked = !options['align_left'];
  document.getElementById("HTTKeepOnScreen").checked = options['keep_on_screen'];
  
  document.getElementById("HTTActivityIndicator").checked = options['activity_indicator'];
}

document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("save_button").addEventListener('click', save_options);
}, false);