// Palmera Cover Studio — editor wiring.
//
// Loads the bundled sample photos (and any photos the reader adds from
// their own machine — read locally, never uploaded), keeps the cover
// state, repaints the live preview through cover.js, and exports the
// finished cover as a PNG. A ?shot= mode renders one fixed composition
// full-screen so the entry's screenshots can be captured from the app
// exactly as a reader would see it.

import {
  SIZES, LAYOUTS, GRADES, layoutById, defaultTexts, drawCover, exportCoverPNG,
} from './cover.js';

const SAMPLES = [
  { src: 'assets/boulevard.jpg', label: 'Boulevard' },
  { src: 'assets/pier.jpg', label: 'Pier' },
  { src: 'assets/beach.jpg', label: 'Beach' },
];

const state = {
  sizeKey: 'square',
  layoutId: 'poster-grid',
  gradeId: 'vice-sunset',
  photos: [],
  panelPhoto: [0, 1, 2],
  focus: [
    { zoom: 1, fx: 0.5, fy: 0.45 },
    { zoom: 1.3, fx: 0.35, fy: 0.4 },
    { zoom: 1.2, fx: 0.65, fy: 0.55 },
  ],
  texts: defaultTexts(),
  activePanel: 0,
};

const $ = (id) => document.getElementById(id);
const stage = $('stage');

function render() {
  const size = SIZES[state.sizeKey];
  if (stage.width !== size.w) { stage.width = size.w; stage.height = size.h; }
  if (state.photos.length) drawCover(stage.getContext('2d'), size.w, size.h, state);
}

function ensurePanelSlots() {
  const count = layoutById(state.layoutId).panels.length;
  while (state.panelPhoto.length < count) state.panelPhoto.push(0);
  while (state.focus.length < count) state.focus.push({ zoom: 1.15, fx: 0.5, fy: 0.5 });
  if (state.activePanel >= count) state.activePanel = 0;
}

function buildPickers() {
  const layoutBox = $('layout-picker');
  layoutBox.innerHTML = '';
  for (const layout of LAYOUTS) {
    const b = document.createElement('button');
    b.textContent = layout.name;
    b.className = layout.id === state.layoutId ? 'chip on' : 'chip';
    b.onclick = () => {
      state.layoutId = layout.id;
      ensurePanelSlots();
      buildPickers(); buildPanelEditor(); render();
    };
    layoutBox.appendChild(b);
  }
  const gradeBox = $('grade-picker');
  gradeBox.innerHTML = '';
  for (const grade of GRADES) {
    const b = document.createElement('button');
    b.textContent = grade.name;
    b.className = grade.id === state.gradeId ? 'chip on' : 'chip';
    b.onclick = () => { state.gradeId = grade.id; buildPickers(); render(); };
    gradeBox.appendChild(b);
  }
  const sizeBox = $('size-picker');
  sizeBox.innerHTML = '';
  for (const [key, size] of Object.entries(SIZES)) {
    const b = document.createElement('button');
    b.textContent = size.label;
    b.className = key === state.sizeKey ? 'chip on' : 'chip';
    b.onclick = () => { state.sizeKey = key; buildPickers(); render(); };
    sizeBox.appendChild(b);
  }
}

function buildTray() {
  const tray = $('tray');
  tray.innerHTML = '';
  state.photos.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'tray-item';
    const thumb = document.createElement('img');
    thumb.src = photo.img.src;
    thumb.alt = photo.label;
    const name = document.createElement('span');
    name.textContent = `${i + 1}. ${photo.label}`;
    item.append(thumb, name);
    tray.appendChild(item);
  });
}

function buildPanelEditor() {
  ensurePanelSlots();
  const box = $('panel-editor');
  box.innerHTML = '';
  layoutById(state.layoutId).panels.forEach((panel, i) => {
    const row = document.createElement('div');
    row.className = i === state.activePanel ? 'panel-row on' : 'panel-row';
    const title = document.createElement('button');
    title.className = 'panel-name';
    title.textContent = `Panel ${i + 1}`;
    title.onclick = () => { state.activePanel = i; buildPanelEditor(); syncSliders(); };
    const select = document.createElement('select');
    state.photos.forEach((photo, pi) => {
      const opt = document.createElement('option');
      opt.value = String(pi);
      opt.textContent = photo.label;
      select.appendChild(opt);
    });
    select.value = String(state.panelPhoto[i] ?? 0);
    select.onchange = () => { state.panelPhoto[i] = Number(select.value); render(); };
    row.append(title, select);
    box.appendChild(row);
  });
}

function syncSliders() {
  const f = state.focus[state.activePanel];
  $('zoom').value = String(f.zoom);
  $('pan-x').value = String(f.fx);
  $('pan-y').value = String(f.fy);
}

function bindControls() {
  for (const [id, key] of [
    ['t-masthead', 'masthead'], ['t-kicker', 'kicker'],
    ['t-line1', 'line1'], ['t-line2', 'line2'], ['t-line3', 'line3'],
    ['t-sticker', 'sticker'], ['t-issue', 'issue'], ['t-banner', 'banner'],
  ]) {
    const input = $(id);
    input.value = state.texts[key];
    input.addEventListener('input', () => { state.texts[key] = input.value; render(); });
  }
  for (const [id, key] of [['zoom', 'zoom'], ['pan-x', 'fx'], ['pan-y', 'fy']]) {
    $(id).addEventListener('input', (e) => {
      state.focus[state.activePanel][key] = Number(e.target.value);
      render();
    });
  }
  $('photo-input').addEventListener('change', (e) => {
    for (const file of e.target.files) {
      const img = new Image();
      img.onload = () => {
        state.photos.push({ img, label: file.name.replace(/\.[^.]+$/, '') });
        buildTray(); buildPanelEditor(); render();
      };
      img.src = URL.createObjectURL(file);
    }
    e.target.value = '';
  });
  $('export-btn').addEventListener('click', () => exportCoverPNG(state));
}

function loadSamples(done) {
  let loaded = 0;
  for (const sample of SAMPLES) {
    const img = new Image();
    img.onload = () => {
      state.photos.push({ img, label: sample.label });
      loaded += 1;
      render();
      if (loaded === SAMPLES.length) done();
    };
    img.src = sample.src;
  }
}

// --- screenshot modes -------------------------------------------------------

const SHOT_PRESETS = {
  wide: { sizeKey: 'wide', layoutId: 'poster-grid', gradeId: 'vice-sunset', panelPhoto: [0, 1, 2] },
  portrait: { sizeKey: 'portrait', layoutId: 'poster-grid', gradeId: 'golden-hour', panelPhoto: [2, 0, 1] },
  square: { sizeKey: 'square', layoutId: 'poster-grid', gradeId: 'vice-sunset', panelPhoto: [0, 2, 1] },
  editor: { sizeKey: 'square', layoutId: 'duo-split', gradeId: 'neon-nights', panelPhoto: [1, 0] },
};

function boot() {
  const shot = new URLSearchParams(location.search).get('shot');
  if (shot && SHOT_PRESETS[shot]) {
    Object.assign(state, SHOT_PRESETS[shot]);
    if (shot !== 'editor') document.body.classList.add('shot');
    else document.body.classList.add('shot-editor');
  }
  bindControls();
  buildPickers();
  loadSamples(() => {
    buildTray();
    buildPanelEditor();
    syncSliders();
    render();
    requestAnimationFrame(() => { window.__shotReady = true; });
  });
}

boot();
