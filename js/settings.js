
// Config drawing settings

$(function () {

  // --- color picker ---

  $('#js_branch_color').colorpicker({
    color: Settings.branchColor
  }).on('hidePicker', function () {
    Settings.branchColor = $(this).data('colorpicker').color.toHex();
  });

  // --- slider ---

  $('#js_nest').slider({
    min: 1, max: 7, step: 1,
    value: Settings.nest
  }).on('slideStop', function () {
    Settings.nest = $(this).data('slider').getValue();
  });

  $('#js_radius').slider({
    min: 100, max: 500, step: 10,
    value: Settings.radius
  }).on('slideStop', function () {
    Settings.radius = $(this).data('slider').getValue();
  });

  $('#js_strutFactor').slider({
    min: -0.5, max: 0.5, step: 0.01,
    value: Settings.strutFactor
  }).on('slideStop', function () {
    Settings.strutFactor = $(this).data('slider').getValue();
  });

  $('#js_strutTarget').slider({
    min: 1, max: 10, step: 1,
    value: Settings.strutTarget
  }).on('slideStop', function () {
    Settings.strutTarget = $(this).data('slider').getValue();
  });

  $('#js_numSides').slider({
    min: 1, max: 10, step: 1,
    value: Settings.numSides
  }).on('slideStop', function () {
    Settings.numSides = $(this).data('slider').getValue();
  });

});
