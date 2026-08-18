import { getEntries, getEntryById, saveEntry, deleteEntry, resetEntriesToDefault } from './entriesStore.js';

window.addEventListener('DOMContentLoaded', () => {
  const entriesList = document.getElementById('entries-list');
  const entriesCount = document.getElementById('entries-count');
  const inputSearch = document.getElementById('input-search');
  const btnCreateNew = document.getElementById('btn-create-new');
  const btnResetData = document.getElementById('btn-reset-data');

  const entryForm = document.getElementById('entry-form');
  const formTitle = document.getElementById('form-title');
  const formModeBadge = document.getElementById('form-mode-badge');
  const fieldId = document.getElementById('entry-id');
  const fieldTitle = document.getElementById('field-title');
  const fieldSubtitle = document.getElementById('field-subtitle');
  const fieldDescription = document.getElementById('field-description');
  const fieldAddress = document.getElementById('field-address');
  const fieldGmaps = document.getElementById('field-gmaps');
  const fieldCover = document.getElementById('field-cover');
  const fieldPosTop = document.getElementById('field-pos-top');
  const fieldPosLeft = document.getElementById('field-pos-left');
  const fieldRefLinks = document.getElementById('field-ref-links');

  const pickerMap = document.getElementById('picker-map');
  const pickerPin = document.getElementById('picker-pin');

  const scenesContainer = document.getElementById('scenes-container');
  const btnAddScene = document.getElementById('btn-add-scene');

  const btnDeleteEntry = document.getElementById('btn-delete-entry');
  const btnCancel = document.getElementById('btn-cancel');

  let currentEntries = [];
  let selectedEntryId = null;

  function loadAndRenderEntries() {
    currentEntries = getEntries();
    const query = (inputSearch.value || '').toLowerCase().trim();
    
    const filtered = currentEntries.filter(e => 
      e.title.toLowerCase().includes(query) || 
      (e.subtitle && e.subtitle.toLowerCase().includes(query)) ||
      (e.address && e.address.toLowerCase().includes(query))
    );

    entriesCount.textContent = currentEntries.length;
    entriesList.innerHTML = '';

    filtered.forEach(entry => {
      const card = document.createElement('div');
      card.className = `entry-card-item ${entry.id === selectedEntryId ? 'active' : ''}`;
      card.dataset.id = entry.id;

      card.innerHTML = `
        <img src="${entry.coverImage || '/casita-bari.webp'}" class="entry-card-thumb" alt="${entry.title}" />
        <div class="entry-card-info">
          <h3>${entry.title}</h3>
          <p>${entry.subtitle || entry.address || 'Sin ubicación'}</p>
          <div class="entry-card-meta">
            <span>${entry.scenes ? entry.scenes.length : 0} Escenas 360°</span> • 
            <span>Top: ${entry.mapPos.top}% Left: ${entry.mapPos.left}%</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        selectEntry(entry.id);
      });

      entriesList.appendChild(card);
    });
  }

  function resetFormToNew() {
    selectedEntryId = null;
    fieldId.value = '';
    fieldTitle.value = '';
    fieldSubtitle.value = '';
    fieldDescription.value = '';
    fieldAddress.value = '';
    fieldGmaps.value = '';
    fieldCover.value = '/casita-bari.webp';
    fieldPosTop.value = '50.0';
    fieldPosLeft.value = '50.0';
    fieldRefLinks.value = '';

    formTitle.textContent = 'Crear Nueva Entrada';
    formModeBadge.textContent = 'Nueva';
    formModeBadge.className = 'badge-new';

    btnDeleteEntry.classList.add('hidden');
    updatePickerPinPosition(50.0, 50.0);

    // Initial default scene
    renderScenes([
      { id: 'scene-' + Date.now(), title: 'Vista Principal 360°', panoramaUrl: '/casita-bari.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]);

    loadAndRenderEntries();
  }

  function selectEntry(id) {
    const entry = getEntryById(id);
    if (!entry) return;

    selectedEntryId = id;
    fieldId.value = entry.id;
    fieldTitle.value = entry.title || '';
    fieldSubtitle.value = entry.subtitle || '';
    fieldDescription.value = entry.description || '';
    fieldAddress.value = entry.address || '';
    fieldGmaps.value = entry.googleMapsUrl || '';
    fieldCover.value = entry.coverImage || '';

    const topVal = entry.mapPos ? entry.mapPos.top : 50.0;
    const leftVal = entry.mapPos ? entry.mapPos.left : 50.0;
    fieldPosTop.value = topVal.toFixed(1);
    fieldPosLeft.value = leftVal.toFixed(1);

    if (entry.referenceLinks && Array.isArray(entry.referenceLinks)) {
      fieldRefLinks.value = entry.referenceLinks.map(l => `${l.label} | ${l.url}`).join('\n');
    } else {
      fieldRefLinks.value = '';
    }

    formTitle.textContent = `Editar: ${entry.title}`;
    formModeBadge.textContent = 'Edición';
    formModeBadge.className = 'badge-edit';

    btnDeleteEntry.classList.remove('hidden');
    updatePickerPinPosition(topVal, leftVal);

    renderScenes(entry.scenes || []);
    loadAndRenderEntries();
  }

  function updatePickerPinPosition(top, left) {
    if (pickerPin) {
      pickerPin.style.top = `${top}%`;
      pickerPin.style.left = `${left}%`;
    }
  }

  // Interactive Map Location Picker
  if (pickerMap) {
    let isPicking = false;

    const setPosFromPointer = (e) => {
      const rect = pickerMap.getBoundingClientRect();
      const leftPerc = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      const topPerc = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));

      fieldPosTop.value = topPerc.toFixed(1);
      fieldPosLeft.value = leftPerc.toFixed(1);
      updatePickerPinPosition(topPerc, leftPerc);
    };

    pickerMap.addEventListener('pointerdown', (e) => {
      isPicking = true;
      setPosFromPointer(e);
    });

    pickerMap.addEventListener('pointermove', (e) => {
      if (isPicking) setPosFromPointer(e);
    });

    const stopPicking = () => { isPicking = false; };
    pickerMap.addEventListener('pointerup', stopPicking);
    pickerMap.addEventListener('pointercancel', stopPicking);
  }

  // Bind numeric coordinate inputs
  fieldPosTop.addEventListener('input', () => {
    updatePickerPinPosition(parseFloat(fieldPosTop.value) || 0, parseFloat(fieldPosLeft.value) || 0);
  });
  fieldPosLeft.addEventListener('input', () => {
    updatePickerPinPosition(parseFloat(fieldPosTop.value) || 0, parseFloat(fieldPosLeft.value) || 0);
  });

  // Scenes Manager
  function renderScenes(scenesList) {
    scenesContainer.innerHTML = '';
    if (scenesList.length === 0) {
      scenesList.push({ id: 'scene-' + Date.now(), title: 'Vista Principal 360°', panoramaUrl: '/casita-bari.webp', pitch: 0, yaw: 0, hfov: 100 });
    }

    scenesList.forEach((sc, idx) => {
      const card = document.createElement('div');
      card.className = 'scene-item-card';

      card.innerHTML = `
        <span style="font-size:11px; font-weight:700; color:#f97316;">#${idx + 1}</span>
        <input type="text" class="scene-title-input" placeholder="Título de la escena" value="${sc.title || ''}" style="flex:1;" />
        <input type="text" class="scene-url-input" placeholder="URL Panorama 360° (/casita-bari.webp)" value="${sc.panoramaUrl || ''}" style="flex:1.5;" />
        <button type="button" class="btn-remove-scene" title="Eliminar Escena">✕</button>
      `;

      const removeBtn = card.querySelector('.btn-remove-scene');
      removeBtn.addEventListener('click', () => {
        card.remove();
      });

      scenesContainer.appendChild(card);
    });
  }

  if (btnAddScene) {
    btnAddScene.addEventListener('click', () => {
      const newCard = document.createElement('div');
      newCard.className = 'scene-item-card';
      const idx = scenesContainer.children.length + 1;

      newCard.innerHTML = `
        <span style="font-size:11px; font-weight:700; color:#f97316;">#${idx}</span>
        <input type="text" class="scene-title-input" placeholder="Título de la escena" value="Ángulo ${idx} 360°" style="flex:1;" />
        <input type="text" class="scene-url-input" placeholder="URL Panorama 360°" value="/casita-bari.webp" style="flex:1.5;" />
        <button type="button" class="btn-remove-scene" title="Eliminar Escena">✕</button>
      `;

      newCard.querySelector('.btn-remove-scene').addEventListener('click', () => {
        newCard.remove();
      });

      scenesContainer.appendChild(newCard);
    });
  }

  // Form Submit
  entryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Parse reference links text
    const linksRaw = fieldRefLinks.value.split('\n');
    const refLinks = [];
    linksRaw.forEach(line => {
      const parts = line.split('|');
      if (parts.length >= 2) {
        refLinks.push({ label: parts[0].trim(), url: parts[1].trim() });
      }
    });

    // Collect scenes
    const sceneCards = scenesContainer.querySelectorAll('.scene-item-card');
    const scenes = [];
    sceneCards.forEach((scCard, idx) => {
      const title = scCard.querySelector('.scene-title-input').value.trim() || `Escena ${idx + 1}`;
      const panoramaUrl = scCard.querySelector('.scene-url-input').value.trim() || '/casita-bari.webp';
      scenes.push({
        id: `scene-${Date.now()}-${idx}`,
        title,
        panoramaUrl,
        pitch: 0,
        yaw: 0,
        hfov: 100
      });
    });

    const entryData = {
      id: fieldId.value || ('entry-' + Date.now()),
      title: fieldTitle.value.trim(),
      subtitle: fieldSubtitle.value.trim(),
      description: fieldDescription.value.trim(),
      address: fieldAddress.value.trim(),
      googleMapsUrl: fieldGmaps.value.trim(),
      coverImage: fieldCover.value.trim() || '/casita-bari.webp',
      mapPos: {
        top: parseFloat(fieldPosTop.value) || 50.0,
        left: parseFloat(fieldPosLeft.value) || 50.0
      },
      referenceLinks: refLinks,
      scenes: scenes
    };

    saveEntry(entryData);
    selectEntry(entryData.id);
    alert('Locación guardada correctamente');
  });

  // Delete Entry
  if (btnDeleteEntry) {
    btnDeleteEntry.addEventListener('click', () => {
      if (!selectedEntryId) return;
      if (confirm('¿Estás seguro de eliminar esta locación?')) {
        deleteEntry(selectedEntryId);
        resetFormToNew();
      }
    });
  }

  // Cancel & New
  if (btnCancel) btnCancel.addEventListener('click', resetFormToNew);
  if (btnCreateNew) btnCreateNew.addEventListener('click', resetFormToNew);

  // Search Filter
  inputSearch.addEventListener('input', loadAndRenderEntries);

  // Reset Data
  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      if (confirm('¿Restablecer todas las locaciones a los datos iniciales?')) {
        resetEntriesToDefault();
        resetFormToNew();
      }
    });
  }

  // Initial Load
  resetFormToNew();
});
