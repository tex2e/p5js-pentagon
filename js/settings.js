'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const palettes = {
    paper: { background: '#F4F1EA', ink: '#30343B' },
    night: { background: '#101820', ink: '#8CB9B5' },
    copper: { background: '#191715', ink: '#C49A73' },
  };

  const settingNames = {
    js_nest: 'nest',
    js_radius: 'radius',
    js_lineWeight: 'lineWeight',
    js_strutFactor: 'strutFactor',
    js_strutTarget: 'strutTarget',
    js_subStrutTarget: 'subStrutTarget',
    js_numSides: 'numSides',
  };

  let drawTimer;
  const scheduleDraw = (immediate) => {
    window.clearTimeout(drawTimer);
    if (immediate) {
      drawFractal();
    } else {
      drawTimer = window.setTimeout(drawFractal, 90);
    }
  };

  Object.entries(settingNames).forEach(([id, setting]) => {
    const input = document.getElementById(id);
    const output = document.querySelector(`[data-value-for="${id}"]`);

    const update = (immediate) => {
      Settings[setting] = Number(input.value);
      output.value = setting === 'strutFactor'
        ? Settings[setting].toFixed(2)
        : setting === 'lineWeight'
          ? Settings[setting].toFixed(1)
          : String(Settings[setting]);
      scheduleDraw(immediate);
    };

    input.addEventListener('input', () => update(false));
    input.addEventListener('change', () => update(true));
  });

  document.querySelectorAll('[data-palette]').forEach((button) => {
    button.addEventListener('click', () => {
      const palette = palettes[button.dataset.palette];
      if (!palette) return;

      Settings.backgroundColor = palette.background;
      Settings.branchColor = palette.ink;

      document.querySelectorAll('[data-palette]').forEach((option) => {
        const selected = option === button;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-pressed', String(selected));
      });

      drawFractal();
    });
  });

  document.getElementById('save-artwork').addEventListener('click', saveArtwork);
});
