import { getEntries, fetchRemoteEntries, getEntryById, saveEntry, deleteEntry } from './entriesStore.js';
import { isLoggedIn, loginAdmin, logoutAdmin } from './authStore.js';
import { getMediaLibrary, addMediaItem, deleteMediaItem } from './mediaStore.js';
import { optimizeImageToWebP, formatBytes } from './imageOptimizer.js';

// Wait for DOM content to be fully loaded
window.addEventListener('DOMContentLoaded', () => {
  let viewer;
  let experienceStarted = false;
  let idleTimer;
  const idleTimeoutMs = 3500;

  const hubScreen = document.getElementById('hub-screen');
  const loadingScreen = document.getElementById('loading-screen');
  const ctrlHubBtn = document.getElementById('ctrl-hub');
  const hudOverlay = document.querySelector('.hud-overlay');

  // Ensure site starts ON THE MAP HUB BY DEFAULT
  if (hubScreen) hubScreen.classList.remove('hidden');
  if (loadingScreen) loadingScreen.classList.add('hidden');

  // Async fetch remote entries from database and sync pins
  fetchRemoteEntries().then(() => {
    renderDynamicMapPins();
  });

  let currentActiveEntry = null;
  let currentActiveScene = null;

  // Admin Controls & Modal Elements
  const btnAdminGear = document.getElementById('btn-admin-gear');
  const btnAdminStatus = document.getElementById('btn-admin-status');
  const adminStatusText = document.getElementById('admin-status-text');
  const btnLogoutHeader = document.getElementById('btn-logout-header');
  const btnAddPoiMap = document.getElementById('btn-add-poi-map');
  const adminOnlyCtrls = document.querySelectorAll('.admin-only-ctrl');

  const modalAdminLogin = document.getElementById('modal-admin-login');
  const formAdminLogin = document.getElementById('form-admin-login');
  const inputAdminPassword = document.getElementById('input-admin-password');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const btnCloseLogin = document.getElementById('btn-close-login');
  const btnCancelLogin = document.getElementById('btn-cancel-login');

  const adminDrawer = document.getElementById('admin-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawerEntryForm = document.getElementById('drawer-entry-form');
  const drawerHeading = document.getElementById('drawer-heading');
  const drawerEntryId = document.getElementById('drawer-entry-id');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerSubtitle = document.getElementById('drawer-subtitle');
  const drawerDescription = document.getElementById('drawer-description');
  const drawerAddress = document.getElementById('drawer-address');
  const drawerGmaps = document.getElementById('drawer-gmaps');
  const drawerCover = document.getElementById('drawer-cover');
  const btnOpenCoverMedia = document.getElementById('btn-open-cover-media');
  const drawerPosTop = document.getElementById('drawer-pos-top');
  const drawerPosLeft = document.getElementById('drawer-pos-left');
  const drawerRefLinks = document.getElementById('drawer-ref-links');
  const drawerScenesList = document.getElementById('drawer-scenes-list');
  const drawerAddScene = document.getElementById('drawer-add-scene');
  const drawerBtnDelete = document.getElementById('drawer-btn-delete');
  const drawerBtnLogout = document.getElementById('drawer-btn-logout');
  const drawerBtnCancel = document.getElementById('drawer-btn-cancel');

  // Interactive Map Location Picker Elements
  const mapPickerBanner = document.getElementById('map-picker-banner');
  const pickerBannerText = document.getElementById('picker-banner-text');
  const btnCancelPicker = document.getElementById('btn-cancel-picker');
  let isMapPickingMode = false;
  let mapPickingCallback = null;

  // Media Library & WebP Optimizer Elements
  const modalMediaLibrary = document.getElementById('modal-media-library');
  const btnCloseMediaLibrary = document.getElementById('btn-close-media-library');
  const tabMediaGallery = document.getElementById('tab-media-gallery');
  const tabMediaUpload = document.getElementById('tab-media-upload');
  const mediaPanelGallery = document.getElementById('media-panel-gallery');
  const mediaPanelUpload = document.getElementById('media-panel-upload');
  const mediaSearchInput = document.getElementById('media-search-input');
  const mediaGrid = document.getElementById('media-grid');
  const mediaDropzone = document.getElementById('media-dropzone');
  const mediaFileInput = document.getElementById('media-file-input');
  const mediaCustomUrlInput = document.getElementById('media-custom-url-input');
  const btnUseCustomUrl = document.getElementById('btn-use-custom-url');
  const mediaSelectedInfo = document.getElementById('media-selected-info');
  const btnDeleteSelectedMedia = document.getElementById('btn-delete-selected-media');
  const btnCancelMedia = document.getElementById('btn-cancel-media');
  const btnConfirmMedia = document.getElementById('btn-confirm-media');

  // WebP Optimization Dashboard Elements
  const webpOptimizationCard = document.getElementById('webp-optimization-card');
  const webpRatioBadge = document.getElementById('webp-ratio-badge');
  const webpOrigSize = document.getElementById('webp-orig-size');
  const webpOptSize = document.getElementById('webp-opt-size');
  const webpDimensions = document.getElementById('webp-dimensions');

  let onMediaSelectCallback = null;
  let currentSelectedMediaItem = null;

  function handleLogout() {
    logoutAdmin();
    closeDrawer();
    closeLoginModal();
    closeMediaLibrary();
    updateAdminUI();
  }

  if (btnLogoutHeader) btnLogoutHeader.addEventListener('click', (e) => {
    e.stopPropagation();
    handleLogout();
  });
  if (drawerBtnLogout) drawerBtnLogout.addEventListener('click', (e) => {
    e.stopPropagation();
    handleLogout();
  });

  let isPanoramaLoaded = false;

  function initOrLoadPanorama(panoramaUrl, pitch = 0, yaw = 0, hfov = 100) {
    isPanoramaLoaded = false;
    if (loadingScreen) loadingScreen.classList.remove('hidden');

    if (viewer && typeof viewer.destroy === 'function') {
      try { viewer.destroy(); } catch (err) {}
      viewer = null;
    }

    const preloaderImg = new Image();
    const handleReady = () => {
      if (viewer && typeof viewer.destroy === 'function') {
        try { viewer.destroy(); } catch (err) {}
      }

      viewer = pannellum.viewer('panorama', {
        type: 'equirectangular',
        panorama: panoramaUrl,
        autoLoad: true,
        autoRotate: -2,
        showControls: false,
        yaw: yaw,
        pitch: pitch,
        hfov: hfov,
        minHfov: 30,
        maxHfov: 120,
        keyboardZoom: true,
        mouseZoom: true
      });

      viewer.on('load', () => {
        isPanoramaLoaded = true;
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
          loadingScreen.classList.add('hidden');
          enterExperience();
        }
      });

      setTimeout(() => {
        isPanoramaLoaded = true;
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
          loadingScreen.classList.add('hidden');
          enterExperience();
        }
      }, 600);
    };

    preloaderImg.onload = handleReady;
    preloaderImg.onerror = handleReady;
    preloaderImg.src = panoramaUrl;
  }

  // Multi-Scene Pagination HUD Elements
  const scenePaginationBar = document.getElementById('scene-pagination-bar');
  const scenePillsContainer = document.getElementById('scene-pills-container');
  const btnPrevScene = document.getElementById('btn-prev-scene');
  const btnNextScene = document.getElementById('btn-next-scene');
  let currentActiveSceneIndex = 0;

  function renderScenePagination(entry, activeIndex) {
    if (!scenePaginationBar || !scenePillsContainer) return;

    if (!entry.scenes || entry.scenes.length <= 1) {
      scenePaginationBar.classList.add('hidden');
      return;
    }

    scenePaginationBar.classList.remove('hidden');
    scenePillsContainer.innerHTML = '';

    entry.scenes.forEach((sc, idx) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `scene-pill ${idx === activeIndex ? 'active' : ''}`;
      pill.textContent = sc.title || `Ángulo ${idx + 1}`;

      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        switchSceneInViewer(entry, idx);
      });

      scenePillsContainer.appendChild(pill);
    });

    if (btnPrevScene) {
      btnPrevScene.onclick = (e) => {
        e.stopPropagation();
        const prevIdx = (activeIndex - 1 + entry.scenes.length) % entry.scenes.length;
        switchSceneInViewer(entry, prevIdx);
      };
    }

    if (btnNextScene) {
      btnNextScene.onclick = (e) => {
        e.stopPropagation();
        const nextIdx = (activeIndex + 1) % entry.scenes.length;
        switchSceneInViewer(entry, nextIdx);
      };
    }
  }

  function switchSceneInViewer(entry, sceneIndex) {
    currentActiveSceneIndex = sceneIndex;
    const scene = entry.scenes[sceneIndex];
    currentActiveScene = scene;

    const brandDesc = document.querySelector('.brand-desc');
    if (brandDesc) brandDesc.textContent = scene.title || entry.subtitle || 'Recorrido 360°';

    initOrLoadPanorama(scene.panoramaUrl, scene.pitch || 0, scene.yaw || 0, scene.hfov || 100);
    renderScenePagination(entry, sceneIndex);
  }

  function startExperienceWithEntry(entry, sceneIndex = 0) {
    currentActiveEntry = entry;
    currentActiveSceneIndex = sceneIndex;

    const scene = (entry.scenes && entry.scenes[sceneIndex]) ? entry.scenes[sceneIndex] : {
      title: entry.title,
      panoramaUrl: entry.coverImage || '/360/bahia-serena.webp',
      pitch: 0, yaw: 0, hfov: 100
    };
    currentActiveScene = scene;

    const brandTitle = document.querySelector('.brand-title');
    const brandDesc = document.querySelector('.brand-desc');
    if (brandTitle) brandTitle.textContent = entry.title;
    if (brandDesc) brandDesc.textContent = scene.title || entry.subtitle || 'Recorrido 360°';

    renderScenePagination(entry, sceneIndex);
    initOrLoadPanorama(scene.panoramaUrl, scene.pitch || 0, scene.yaw || 0, scene.hfov || 100);

    hubScreen.classList.add('hidden');
    loadingScreen.classList.remove('hidden');
  }

  // --- Admin State & UI Synchronization ---
  function updateAdminUI() {
    const adminActive = isLoggedIn();

    if (btnAdminGear) {
      if (adminActive) {
        btnAdminGear.classList.add('is-logged-in');
        btnAdminGear.title = 'Modo Admin Activo';
      } else {
        btnAdminGear.classList.remove('is-logged-in');
        btnAdminGear.title = 'Administración';
      }
    }

    if (adminStatusText) {
      adminStatusText.textContent = adminActive ? 'Modo Admin' : 'Acceso Admin';
    }

    if (btnAdminStatus) {
      if (adminActive) btnAdminStatus.classList.add('admin-active');
      else btnAdminStatus.classList.remove('admin-active');
    }

    if (btnLogoutHeader) {
      if (adminActive) btnLogoutHeader.classList.remove('hidden');
      else btnLogoutHeader.classList.add('hidden');
    }

    if (btnAddPoiMap) {
      if (adminActive) btnAddPoiMap.classList.remove('hidden');
      else btnAddPoiMap.classList.add('hidden');
    }

    adminOnlyCtrls.forEach(ctrl => {
      if (adminActive) ctrl.classList.remove('hidden');
      else ctrl.classList.add('hidden');
    });

    renderDynamicMapPins();
  }

  // Handle Login Modal
  function openLoginModal() {
    if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
    if (inputAdminPassword) inputAdminPassword.value = '';
    if (modalAdminLogin) modalAdminLogin.classList.remove('hidden');
    setTimeout(() => { if (inputAdminPassword) inputAdminPassword.focus(); }, 100);
  }

  function closeLoginModal() {
    if (modalAdminLogin) modalAdminLogin.classList.add('hidden');
  }

  if (btnAdminGear) {
    btnAdminGear.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isLoggedIn()) {
        openDrawerForNewEntry();
      } else {
        openLoginModal();
      }
    });
  }

  if (btnAdminStatus) {
    btnAdminStatus.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isLoggedIn()) {
        if (confirm('¿Cerrar la sesión de administración?')) {
          logoutAdmin();
          updateAdminUI();
        }
      } else {
        openLoginModal();
      }
    });
  }

  if (btnCloseLogin) btnCloseLogin.addEventListener('click', closeLoginModal);
  if (btnCancelLogin) btnCancelLogin.addEventListener('click', closeLoginModal);

  if (formAdminLogin) {
    formAdminLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = inputAdminPassword.value;
      const res = loginAdmin(pass);
      if (res.success) {
        closeLoginModal();
        updateAdminUI();
      } else {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = res.message || 'Contraseña incorrecta';
          loginErrorMsg.classList.remove('hidden');
        }
      }
    });
  }

  // --- Interactive 2D Map Engine (Camera Viewport & MapWorld Architecture) ---
  const mapViewport = document.getElementById('hub-map-viewport');
  const mapWrapper = document.getElementById('hub-map-wrapper');
  const mapZoomInBtn = document.getElementById('map-zoom-in');
  const mapZoomOutBtn = document.getElementById('map-zoom-out');
  const mapZoomResetBtn = document.getElementById('map-zoom-reset');
  const mapZoomLevelLabel = document.getElementById('map-zoom-level');

  // Shared fixed MapWorld dimensions across all devices (Desktop, Mobile, Tablet, Portrait, Landscape)
  const MAP_WORLD_WIDTH = 1920;
  const MAP_WORLD_HEIGHT = 815;

  function isMobileOrTablet() {
    return window.innerWidth <= 1024;
  }

  function getMinScale() {
    return isMobileOrTablet() ? 1.5 : 1.0;
  }

  function getMaxScale() {
    return isMobileOrTablet() ? 2.5 : 2.0;
  }

  let mapScale = isMobileOrTablet() ? 1.5 : 1.0;
  let mapX = 0;
  let mapY = 0;
  let isDraggingMap = false;
  let hasMovedMapFar = false;

  let lastPointerX = 0;
  let lastPointerY = 0;
  let lastPointerTime = 0;
  let velocityX = 0;
  let velocityY = 0;
  let inertiaAnimId = null;

  function stopInertia() {
    if (inertiaAnimId !== null) {
      cancelAnimationFrame(inertiaAnimId);
      inertiaAnimId = null;
    }
  }

  function syncScaleLimits() {
    const curMin = getMinScale();
    const curMax = getMaxScale();
    if (mapScale < curMin) mapScale = curMin;
    if (mapScale > curMax) mapScale = curMax;
  }

  function getValidBounds() {
    if (!mapViewport) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    syncScaleLimits();
    const rect = mapViewport.getBoundingClientRect();
    const vpW = rect.width;
    const vpH = rect.height;

    const scaledW = MAP_WORLD_WIDTH * mapScale;
    const scaledH = MAP_WORLD_HEIGHT * mapScale;

    let minX, maxX, minY, maxY;

    // Horizontal Camera Clamping:
    if (scaledW > vpW) {
      // MapWorld is wider than camera viewport (mobile portrait/landscape): pan left/right between 0 and (vpW - scaledW)
      minX = vpW - scaledW;
      maxX = 0;
    } else {
      // Camera viewport is wider than MapWorld (desktop): center MapWorld horizontally
      minX = (vpW - scaledW) / 2;
      maxX = minX;
    }

    // Vertical Camera Clamping:
    if (scaledH > vpH) {
      // MapWorld is taller than camera viewport (mobile landscape/zoomed): pan top/bottom between 0 and (vpH - scaledH)
      minY = vpH - scaledH;
      maxY = 0;
    } else {
      // Camera viewport is taller than MapWorld (mobile portrait / desktop): center MapWorld vertically
      minY = (vpH - scaledH) / 2;
      maxY = minY;
    }

    return { minX, maxX, minY, maxY, vpW, vpH };
  }

  function centerMapCameraInitial() {
    syncScaleLimits();
    const bounds = getValidBounds();
    mapX = Math.min(bounds.maxX, Math.max(bounds.minX, (bounds.vpW - MAP_WORLD_WIDTH * mapScale) / 2));
    mapY = Math.min(bounds.maxY, Math.max(bounds.minY, (bounds.vpH - MAP_WORLD_HEIGHT * mapScale) / 2));
    renderMapTransform(false);
  }

  const mapResizeObserver = new ResizeObserver(() => {
    syncScaleLimits();
    const bounds = getValidBounds();
    mapX = Math.min(bounds.maxX, Math.max(bounds.minX, mapX));
    mapY = Math.min(bounds.maxY, Math.max(bounds.minY, mapY));
    renderMapTransform(false);
  });
  if (mapViewport) mapResizeObserver.observe(mapViewport);

  setTimeout(centerMapCameraInitial, 50);

  function startInertiaAndSpring() {
    stopInertia();
    let lastFrameTime = performance.now();
    const friction = 0.92;

    function stepInertia(now) {
      const deltaT = Math.min(0.032, (now - lastFrameTime) / 1000);
      lastFrameTime = now;

      const bounds = getValidBounds();
      velocityX *= friction;
      velocityY *= friction;

      let nextX = mapX + velocityX * deltaT;
      let nextY = mapY + velocityY * deltaT;

      if (nextX <= bounds.minX) { nextX = bounds.minX; velocityX = 0; }
      if (nextX >= bounds.maxX) { nextX = bounds.maxX; velocityX = 0; }
      if (nextY <= bounds.minY) { nextY = bounds.minY; velocityY = 0; }
      if (nextY >= bounds.maxY) { nextY = bounds.maxY; velocityY = 0; }

      mapX = nextX;
      mapY = nextY;

      renderMapTransform(false);

      if (Math.hypot(velocityX, velocityY) > 5) {
        inertiaAnimId = requestAnimationFrame(stepInertia);
      } else {
        renderMapTransform(true);
        inertiaAnimId = null;
      }
    }

    inertiaAnimId = requestAnimationFrame(stepInertia);
  }

  function renderMapTransform(animate = false) {
    if (mapViewport && mapWrapper) {
      syncScaleLimits();
      const curMin = getMinScale();
      const curMax = getMaxScale();

      if (animate) {
        mapWrapper.classList.add('animating');
      } else {
        mapWrapper.classList.remove('animating');
      }

      mapWrapper.style.transform = `translate3d(${mapX}px, ${mapY}px, 0px) scale(${mapScale})`;

      if (mapZoomLevelLabel) {
        mapZoomLevelLabel.textContent = `${Math.round(mapScale * 100)}%`;
      }

      if (mapZoomInBtn) {
        mapZoomInBtn.style.opacity = mapScale >= curMax ? '0.35' : '1';
        mapZoomInBtn.style.pointerEvents = mapScale >= curMax ? 'none' : 'auto';
      }
      if (mapZoomOutBtn) {
        mapZoomOutBtn.style.opacity = mapScale <= curMin ? '0.35' : '1';
        mapZoomOutBtn.style.pointerEvents = mapScale <= curMin ? 'none' : 'auto';
      }
    }
  }

  function setZoom(newScale, focalX = null, focalY = null, animate = true) {
    stopInertia();
    syncScaleLimits();
    const curMin = getMinScale();
    const curMax = getMaxScale();

    const clampedScale = Math.min(curMax, Math.max(curMin, newScale));
    if (clampedScale === mapScale) return;

    const rect = mapViewport.getBoundingClientRect();
    if (focalX === null) focalX = rect.width / 2;
    if (focalY === null) focalY = rect.height / 2;

    const pointX = (focalX - mapX) / mapScale;
    const pointY = (focalY - mapY) / mapScale;

    mapScale = clampedScale;
    mapX = focalX - pointX * mapScale;
    mapY = focalY - pointY * mapScale;

    const bounds = getValidBounds();
    mapX = Math.min(bounds.maxX, Math.max(bounds.minX, mapX));
    mapY = Math.min(bounds.maxY, Math.max(bounds.minY, mapY));

    renderMapTransform(animate);
  }

  function resetMapZoom() {
    stopInertia();
    mapScale = getMinScale();
    centerMapCameraInitial();
    renderMapTransform(true);
  }

  if (mapViewport && mapWrapper) {
    mapViewport.addEventListener('dragstart', (e) => e.preventDefault());

    mapViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      const rect = mapViewport.getBoundingClientRect();
      setZoom(mapScale + delta, e.clientX - rect.left, e.clientY - rect.top, false);
    }, { passive: false });

    mapViewport.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || e.target.closest('.poi-editor-panel') || e.target.closest('.modal-overlay') || e.target.closest('.admin-drawer-overlay')) return;

      stopInertia();
      isDraggingMap = true;
      hasMovedMapFar = false;

      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      lastPointerTime = performance.now();
      velocityX = 0;
      velocityY = 0;

      mapViewport.classList.add('is-dragging');
      mapWrapper.classList.remove('animating');

      try { mapViewport.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });

    mapViewport.addEventListener('pointermove', (e) => {
      if (!isDraggingMap) return;
      const now = performance.now();
      const dt = Math.max(0.008, (now - lastPointerTime) / 1000);

      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedMapFar = true;
      }

      const bounds = getValidBounds();
      mapX = Math.min(bounds.maxX, Math.max(bounds.minX, mapX + dx));
      mapY = Math.min(bounds.maxY, Math.max(bounds.minY, mapY + dy));

      velocityX = velocityX * 0.3 + (dx / dt) * 0.7;
      velocityY = velocityY * 0.3 + (dy / dt) * 0.7;

      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      lastPointerTime = now;

      renderMapTransform(false);
      e.preventDefault();
    });

    const endDrag = (e) => {
      if (!isDraggingMap) return;
      isDraggingMap = false;
      mapViewport.classList.remove('is-dragging');
      try { mapViewport.releasePointerCapture(e.pointerId); } catch (err) {}
      startInertiaAndSpring();

      // Handle Interactive Map Location Picker click
      if (isMapPickingMode && !hasMovedMapFar) {
        const rect = mapWrapper.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const topPerc = Math.min(100, Math.max(0, (clickY / rect.height) * 100));
        const leftPerc = Math.min(100, Math.max(0, (clickX / rect.width) * 100));

        const cb = mapPickingCallback;
        stopMapPickingMode();
        if (cb) cb(topPerc, leftPerc);
      }
    };

    mapViewport.addEventListener('pointerup', endDrag);
    mapViewport.addEventListener('pointercancel', endDrag);
  }

  // --- Interactive Map Location Picker Logic ---
  function startMapPickingMode(callback, bannerMessage = 'Haz clic en cualquier lugar del mapa para fijar la ubicación.') {
    isMapPickingMode = true;
    mapPickingCallback = callback;

    if (pickerBannerText) pickerBannerText.textContent = bannerMessage;
    if (mapPickerBanner) mapPickerBanner.classList.remove('hidden');
    if (mapWrapper) mapWrapper.classList.add('picking-mode');
  }

  function stopMapPickingMode() {
    isMapPickingMode = false;
    mapPickingCallback = null;

    if (mapPickerBanner) mapPickerBanner.classList.add('hidden');
    if (mapWrapper) mapWrapper.classList.remove('picking-mode');
  }

  if (btnCancelPicker) btnCancelPicker.addEventListener('click', stopMapPickingMode);

  // --- WordPress-style Media Library & WebP Optimization Engine ---
  function openMediaLibrary(callback) {
    onMediaSelectCallback = callback;
    currentSelectedMediaItem = null;
    if (mediaSelectedInfo) mediaSelectedInfo.textContent = 'Ningún archivo seleccionado';
    if (btnConfirmMedia) btnConfirmMedia.disabled = true;
    if (btnDeleteSelectedMedia) btnDeleteSelectedMedia.classList.add('hidden');
    if (webpOptimizationCard) webpOptimizationCard.classList.add('hidden');

    renderMediaGrid();
    if (modalMediaLibrary) modalMediaLibrary.classList.remove('hidden');
  }

  function closeMediaLibrary() {
    if (modalMediaLibrary) modalMediaLibrary.classList.add('hidden');
    onMediaSelectCallback = null;
  }

  function renderMediaGrid() {
    if (!mediaGrid) return;
    const mediaList = getMediaLibrary();
    const query = (mediaSearchInput ? mediaSearchInput.value : '').toLowerCase().trim();

    mediaGrid.innerHTML = '';

    const filtered = mediaList.filter(item => item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query));

    filtered.forEach(item => {
      const isSelected = currentSelectedMediaItem && currentSelectedMediaItem.id === item.id;
      const card = document.createElement('div');
      card.className = `media-item-card ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <span class="media-item-badge">${item.type}</span>
        <img src="${item.thumbUrl || item.url}" alt="${item.title}" loading="lazy" />
        <span class="media-item-title">${item.title}</span>
      `;

      card.addEventListener('click', () => {
        mediaGrid.querySelectorAll('.media-item-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        currentSelectedMediaItem = item;
        
        const sizeInfo = item.optimizedSize ? ` (${formatBytes(item.optimizedSize)})` : '';
        if (mediaSelectedInfo) mediaSelectedInfo.textContent = `Seleccionado: ${item.title}${sizeInfo}`;
        if (btnConfirmMedia) btnConfirmMedia.disabled = false;

        if (btnDeleteSelectedMedia) {
          if (item.source === 'Sistema') btnDeleteSelectedMedia.classList.add('hidden');
          else btnDeleteSelectedMedia.classList.remove('hidden');
        }
      });

      mediaGrid.appendChild(card);
    });
  }

  if (mediaSearchInput) mediaSearchInput.addEventListener('input', renderMediaGrid);

  if (tabMediaGallery && tabMediaUpload) {
    tabMediaGallery.addEventListener('click', () => {
      tabMediaGallery.classList.add('active');
      tabMediaUpload.classList.remove('active');
      mediaPanelGallery.classList.remove('hidden');
      mediaPanelUpload.classList.add('hidden');
    });

    tabMediaUpload.addEventListener('click', () => {
      tabMediaUpload.classList.add('active');
      tabMediaGallery.classList.remove('active');
      mediaPanelUpload.classList.remove('hidden');
      mediaPanelGallery.classList.add('hidden');
    });
  }

  if (mediaDropzone && mediaFileInput) {
    mediaDropzone.addEventListener('click', () => mediaFileInput.click());
    mediaFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        if (mediaDropzone) mediaDropzone.style.opacity = '0.5';
        if (mediaSelectedInfo) mediaSelectedInfo.textContent = 'Procesando y optimizando imagen a WebP...';

        const optResult = await optimizeImageToWebP(file, 0.82);

        const newItem = addMediaItem(
          file.name.replace(/\.[^/.]+$/, ''),
          optResult.dataUrl,
          'WebP Optimizada',
          'Usuario',
          {
            originalSize: optResult.originalSize,
            optimizedSize: optResult.optimizedSize,
            ratio: optResult.ratio,
            width: optResult.width,
            height: optResult.height
          }
        );

        if (webpOptimizationCard) webpOptimizationCard.classList.remove('hidden');
        if (webpOrigSize) webpOrigSize.textContent = formatBytes(optResult.originalSize);
        if (webpOptSize) webpOptSize.textContent = formatBytes(optResult.optimizedSize);
        if (webpDimensions) webpDimensions.textContent = `${optResult.width} x ${optResult.height}`;
        if (webpRatioBadge) webpRatioBadge.textContent = `-${optResult.ratio}% Tamaño`;

        renderMediaGrid();
        currentSelectedMediaItem = newItem;
        if (mediaSelectedInfo) mediaSelectedInfo.textContent = `Optimizado WebP: ${newItem.title} (-${optResult.ratio}%)`;
        if (btnConfirmMedia) btnConfirmMedia.disabled = false;

        if (mediaDropzone) mediaDropzone.style.opacity = '1';
      } catch (err) {
        alert(err.message || 'Error al procesar la imagen.');
        if (mediaDropzone) mediaDropzone.style.opacity = '1';
      }
    });
  }

  if (btnUseCustomUrl && mediaCustomUrlInput) {
    btnUseCustomUrl.addEventListener('click', () => {
      const url = mediaCustomUrlInput.value.trim();
      if (!url) return;
      const newItem = addMediaItem('Imagen Externa', url, 'URL Externa');
      renderMediaGrid();
      tabMediaGallery.click();
      currentSelectedMediaItem = newItem;
      if (mediaSelectedInfo) mediaSelectedInfo.textContent = `Agregado: ${newItem.title}`;
      if (btnConfirmMedia) btnConfirmMedia.disabled = false;
    });
  }

  if (btnDeleteSelectedMedia) {
    btnDeleteSelectedMedia.addEventListener('click', () => {
      if (!currentSelectedMediaItem) return;
      if (confirm(`¿Eliminar la imagen "${currentSelectedMediaItem.title}" de la biblioteca?`)) {
        deleteMediaItem(currentSelectedMediaItem.id);
        currentSelectedMediaItem = null;
        if (btnDeleteSelectedMedia) btnDeleteSelectedMedia.classList.add('hidden');
        if (btnConfirmMedia) btnConfirmMedia.disabled = true;
        if (mediaSelectedInfo) mediaSelectedInfo.textContent = 'Ningún archivo seleccionado';
        renderMediaGrid();
      }
    });
  }

  if (btnConfirmMedia) {
    btnConfirmMedia.addEventListener('click', () => {
      if (currentSelectedMediaItem && onMediaSelectCallback) {
        onMediaSelectCallback(currentSelectedMediaItem.url);
        closeMediaLibrary();
      }
    });
  }

  if (btnCancelMedia) btnCancelMedia.addEventListener('click', closeMediaLibrary);
  if (btnCloseMediaLibrary) btnCloseMediaLibrary.addEventListener('click', closeMediaLibrary);

  if (btnOpenCoverMedia && drawerCover) {
    btnOpenCoverMedia.addEventListener('click', () => {
      openMediaLibrary((selectedUrl) => {
        drawerCover.value = selectedUrl;
      });
    });
  }

  // --- Dynamic POI Pins Rendering with In-Context Admin Actions ---
  const poiSelect = document.getElementById('poi-select');
  let loadedEntries = [];
  let currentTargetPin = null;

  function renderDynamicMapPins() {
    if (!mapWrapper) return;

    const existingPins = mapWrapper.querySelectorAll('.map-pin');
    existingPins.forEach(p => p.remove());

    loadedEntries = getEntries();
    if (poiSelect) poiSelect.innerHTML = '';

    const adminActive = isLoggedIn();

    loadedEntries.forEach((entry) => {
      const topVal = entry.mapPos ? entry.mapPos.top : 50;
      const leftVal = entry.mapPos ? entry.mapPos.left : 50;

      // Edge Clamping position detection
      let edgeClasses = '';
      if (topVal < 30) edgeClasses += ' card-edge-top';
      if (topVal > 70) edgeClasses += ' card-edge-bottom';
      if (leftVal < 25) edgeClasses += ' card-edge-left';
      if (leftVal > 75) edgeClasses += ' card-edge-right';

      const pin = document.createElement('div');
      pin.id = `pin-${entry.id}`;
      pin.className = `map-pin${edgeClasses}`;
      pin.style.top = `${topVal}%`;
      pin.style.left = `${leftVal}%`;
      pin.dataset.id = entry.id;

      // In-Context Admin Actions HTML on card hover
      const adminActionsHtml = adminActive ? `
        <div class="pin-card-admin-actions">
          <button class="btn-pin-admin btn-pin-admin-edit" data-id="${entry.id}">Editar</button>
          <button class="btn-pin-admin btn-pin-admin-move" data-id="${entry.id}">Mover</button>
          <button class="btn-pin-admin btn-pin-admin-delete" data-id="${entry.id}">Eliminar</button>
        </div>
      ` : '';

      pin.innerHTML = `
        <div class="pin-pulse"></div>
        <div class="pin-dot">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div class="pin-card glass-card">
          <div class="pin-card-header">
            <span class="badge-live">${entry.scenes ? entry.scenes.length : 1} Escenas 360°</span>
          </div>
          <h3>${entry.title}</h3>
          <p>${entry.subtitle || entry.address || ''}</p>
          ${entry.googleMapsUrl ? `<a href="${entry.googleMapsUrl}" target="_blank" class="btn-gmaps-link" style="display:inline-block; font-size:10px; color:#3b82f6; margin-bottom:8px; text-decoration:none;">Google Maps</a>` : ''}
          <button class="btn-pin-action" data-id="${entry.id}">
            <span>Ingresar 360°</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          ${adminActionsHtml}
        </div>
      `;

      // 2.5s Hover Card Persistence & Z-Index Layering
      let hoverCardTimer = null;
      pin.addEventListener('mouseenter', () => {
        if (hoverCardTimer) clearTimeout(hoverCardTimer);
        mapWrapper.querySelectorAll('.map-pin').forEach(p => {
          if (p !== pin) p.classList.remove('is-card-hovered');
        });
        pin.classList.add('is-card-hovered');
      });

      pin.addEventListener('mouseleave', () => {
        if (hoverCardTimer) clearTimeout(hoverCardTimer);
        hoverCardTimer = setTimeout(() => {
          pin.classList.remove('is-card-hovered');
        }, 2500);
      });

      pin.addEventListener('click', (e) => {
        if (hasMovedMapFar) {
          e.stopPropagation();
          e.preventDefault();
        }
      }, true);

      // Actions bindings
      const actionBtn = pin.querySelector('.btn-pin-action');
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startExperienceWithEntry(entry);
      });

      if (adminActive) {
        const btnEdit = pin.querySelector('.btn-pin-admin-edit');
        const btnMove = pin.querySelector('.btn-pin-admin-move');
        const btnDel = pin.querySelector('.btn-pin-admin-delete');

        if (btnEdit) {
          btnEdit.addEventListener('click', (e) => {
            e.stopPropagation();
            openDrawerForEditEntry(entry);
          });
        }

        if (btnMove) {
          btnMove.addEventListener('click', (e) => {
            e.stopPropagation();
            startMapPickingMode((top, left) => {
              entry.mapPos = { top, left };
              saveEntry(entry);
              renderDynamicMapPins();
            }, `Haz clic en la nueva ubicación para el punto: ${entry.title}`);
          });
        }

        if (btnDel) {
          btnDel.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`¿Eliminar la entrada "${entry.title}"?`)) {
              deleteEntry(entry.id);
              renderDynamicMapPins();
            }
          });
        }
      }

      mapWrapper.appendChild(pin);

      if (poiSelect) {
        const opt = document.createElement('option');
        opt.value = entry.id;
        opt.textContent = entry.title;
        poiSelect.appendChild(opt);
      }
    });

    if (loadedEntries.length > 0) {
      const firstPin = mapWrapper.querySelector(`#pin-${loadedEntries[0].id}`);
      currentTargetPin = firstPin;
      updatePoiCoordDisplay();
    }
  }

  // --- Admin Drawer Entry Editor Logic ---
  function openDrawerForNewEntry(defaultTop = 50.0, defaultLeft = 50.0) {
    if (drawerHeading) drawerHeading.textContent = 'Crear Nueva Locación 360°';
    if (drawerEntryId) drawerEntryId.value = '';
    if (drawerTitle) drawerTitle.value = '';
    if (drawerSubtitle) drawerSubtitle.value = '';
    if (drawerDescription) drawerDescription.value = '';
    if (drawerAddress) drawerAddress.value = '';
    if (drawerGmaps) drawerGmaps.value = '';
    if (drawerCover) drawerCover.value = '/360/bahia-serena.webp';
    if (drawerPosTop) drawerPosTop.value = defaultTop.toFixed(1);
    if (drawerPosLeft) drawerPosLeft.value = defaultLeft.toFixed(1);
    if (drawerRefLinks) drawerRefLinks.value = '';
    if (drawerBtnDelete) drawerBtnDelete.classList.add('hidden');

    renderDrawerScenes([
      { id: 'sc-' + Date.now(), title: 'Vista Principal 360°', panoramaUrl: '/360/bahia-serena.webp' }
    ]);

    if (adminDrawer) adminDrawer.classList.remove('hidden');
  }

  function openDrawerForEditEntry(entry) {
    if (drawerHeading) drawerHeading.textContent = `Editar: ${entry.title}`;
    if (drawerEntryId) drawerEntryId.value = entry.id;
    if (drawerTitle) drawerTitle.value = entry.title || '';
    if (drawerSubtitle) drawerSubtitle.value = entry.subtitle || '';
    if (drawerDescription) drawerDescription.value = entry.description || '';
    if (drawerAddress) drawerAddress.value = entry.address || '';
    if (drawerGmaps) drawerGmaps.value = entry.googleMapsUrl || '';
    if (drawerCover) drawerCover.value = entry.coverImage || '';

    const topVal = entry.mapPos ? entry.mapPos.top : 50.0;
    const leftVal = entry.mapPos ? entry.mapPos.left : 50.0;
    if (drawerPosTop) drawerPosTop.value = topVal.toFixed(1);
    if (drawerPosLeft) drawerPosLeft.value = leftVal.toFixed(1);

    if (drawerRefLinks) {
      if (entry.referenceLinks && Array.isArray(entry.referenceLinks)) {
        drawerRefLinks.value = entry.referenceLinks.map(l => `${l.label} | ${l.url}`).join('\n');
      } else {
        drawerRefLinks.value = '';
      }
    }

    if (drawerBtnDelete) drawerBtnDelete.classList.remove('hidden');

    renderDrawerScenes(entry.scenes || []);

    if (adminDrawer) adminDrawer.classList.remove('hidden');
  }

  function closeDrawer() {
    if (adminDrawer) adminDrawer.classList.add('hidden');
  }

  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDrawer);
  if (drawerBtnCancel) drawerBtnCancel.addEventListener('click', closeDrawer);

  if (btnAddPoiMap) {
    btnAddPoiMap.addEventListener('click', (e) => {
      e.stopPropagation();
      startMapPickingMode((top, left) => {
        openDrawerForNewEntry(top, left);
      }, 'Haz clic en cualquier lugar del mapa para ubicar el nuevo punto.');
    });
  }

  function renderDrawerScenes(scenesList) {
    if (!drawerScenesList) return;
    drawerScenesList.innerHTML = '';

    scenesList.forEach((sc, idx) => {
      const item = document.createElement('div');
      item.className = 'scene-item-card';
      item.innerHTML = `
        <span style="font-size:10px; font-weight:700; color:#f97316;">#${idx + 1}</span>
        <input type="text" class="sc-title-in" placeholder="Título escena" value="${sc.title || ''}" style="flex:1; font-size:11px;" />
        <div style="display:flex; gap:4px; flex:1.4;">
          <input type="text" class="sc-url-in" placeholder="URL Panorama" value="${sc.panoramaUrl || ''}" style="flex:1; font-size:11px;" />
          <button type="button" class="btn-secondary btn-sc-browse" style="padding:6px 10px; font-size:10px;">Biblioteca</button>
        </div>
        <button type="button" class="btn-remove-scene" title="Eliminar">✕</button>
      `;

      const btnBrowse = item.querySelector('.btn-sc-browse');
      const urlInput = item.querySelector('.sc-url-in');
      if (btnBrowse) {
        btnBrowse.addEventListener('click', () => {
          openMediaLibrary((selectedUrl) => {
            urlInput.value = selectedUrl;
          });
        });
      }

      item.querySelector('.btn-remove-scene').addEventListener('click', () => item.remove());
      drawerScenesList.appendChild(item);
    });
  }

  if (drawerAddScene) {
    drawerAddScene.addEventListener('click', () => {
      const idx = drawerScenesList.children.length + 1;
      const item = document.createElement('div');
      item.className = 'scene-item-card';
      item.innerHTML = `
        <span style="font-size:10px; font-weight:700; color:#f97316;">#${idx}</span>
        <input type="text" class="sc-title-in" placeholder="Título escena" value="Ángulo ${idx} 360°" style="flex:1; font-size:11px;" />
        <div style="display:flex; gap:4px; flex:1.4;">
          <input type="text" class="sc-url-in" placeholder="URL Panorama" value="/360/bahia-serena.webp" style="flex:1; font-size:11px;" />
          <button type="button" class="btn-secondary btn-sc-browse" style="padding:6px 10px; font-size:10px;">Biblioteca</button>
        </div>
        <button type="button" class="btn-remove-scene" title="Eliminar">✕</button>
      `;

      const btnBrowse = item.querySelector('.btn-sc-browse');
      const urlInput = item.querySelector('.sc-url-in');
      if (btnBrowse) {
        btnBrowse.addEventListener('click', () => {
          openMediaLibrary((selectedUrl) => {
            urlInput.value = selectedUrl;
          });
        });
      }

      item.querySelector('.btn-remove-scene').addEventListener('click', () => item.remove());
      drawerScenesList.appendChild(item);
    });
  }

  if (drawerEntryForm) {
    drawerEntryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const linksRaw = drawerRefLinks.value.split('\n');
      const refLinks = [];
      linksRaw.forEach(line => {
        const parts = line.split('|');
        if (parts.length >= 2) refLinks.push({ label: parts[0].trim(), url: parts[1].trim() });
      });

      const scItems = drawerScenesList.querySelectorAll('.scene-item-card');
      const scenes = [];
      scItems.forEach((item, idx) => {
        const title = item.querySelector('.sc-title-in').value.trim() || `Escena ${idx + 1}`;
        const panoramaUrl = item.querySelector('.sc-url-in').value.trim() || '/casita-bari.webp';
        scenes.push({ id: `sc-${Date.now()}-${idx}`, title, panoramaUrl, pitch: 0, yaw: 0, hfov: 100 });
      });

      const entryData = {
        id: drawerEntryId.value || ('entry-' + Date.now()),
        title: drawerTitle.value.trim(),
        subtitle: drawerSubtitle.value.trim(),
        description: drawerDescription.value.trim(),
        address: drawerAddress.value.trim(),
        googleMapsUrl: drawerGmaps.value.trim(),
        coverImage: drawerCover.value.trim() || '/casita-bari.webp',
        mapPos: {
          top: parseFloat(drawerPosTop.value) || 50.0,
          left: parseFloat(drawerPosLeft.value) || 50.0
        },
        referenceLinks: refLinks,
        scenes: scenes
      };

      saveEntry(entryData);
      closeDrawer();
      renderDynamicMapPins();
    });
  }

  if (drawerBtnDelete) {
    drawerBtnDelete.addEventListener('click', () => {
      const id = drawerEntryId.value;
      if (id && confirm('¿Estás seguro de eliminar esta locación?')) {
        deleteEntry(id);
        closeDrawer();
        renderDynamicMapPins();
      }
    });
  }

  // --- POI Position Editor Wheel Logic ---
  const btnToggleEditor = document.getElementById('btn-toggle-editor');
  const poiEditorPanel = document.getElementById('poi-editor-panel');
  const btnClosePoiEditor = document.getElementById('btn-close-poi-editor');
  const wheelBtns = document.querySelectorAll('.wheel-btn');
  const btnSteps = document.querySelectorAll('.btn-step');
  const poiCoordTop = document.getElementById('poi-coord-top');
  const poiCoordLeft = document.getElementById('poi-coord-left');
  const btnCopyPoiCoords = document.getElementById('btn-copy-poi-coords');

  let poiEditorActive = false;
  let activeStep = 0.1;

  function updatePoiCoordDisplay() {
    if (!currentTargetPin) return;
    const topVal = parseFloat(currentTargetPin.style.top) || 0;
    const leftVal = parseFloat(currentTargetPin.style.left) || 0;

    if (poiCoordTop) poiCoordTop.textContent = `${topVal.toFixed(1)}%`;
    if (poiCoordLeft) poiCoordLeft.textContent = `${leftVal.toFixed(1)}%`;
  }

  function setPoiPosition(newTop, newLeft) {
    if (!currentTargetPin) return;
    const clampedTop = Math.min(100, Math.max(0, newTop));
    const clampedLeft = Math.min(100, Math.max(0, newLeft));

    currentTargetPin.style.top = `${clampedTop.toFixed(1)}%`;
    currentTargetPin.style.left = `${clampedLeft.toFixed(1)}%`;
    updatePoiCoordDisplay();

    const entryId = currentTargetPin.dataset.id;
    const entry = getEntryById(entryId);
    if (entry) {
      entry.mapPos = { top: parseFloat(clampedTop.toFixed(1)), left: parseFloat(clampedLeft.toFixed(1)) };
      saveEntry(entry);
    }
  }

  if (poiSelect) {
    poiSelect.addEventListener('change', () => {
      const entryId = poiSelect.value;
      if (currentTargetPin) currentTargetPin.classList.remove('is-editing');
      currentTargetPin = mapWrapper.querySelector(`#pin-${entryId}`);
      if (currentTargetPin && poiEditorActive) currentTargetPin.classList.add('is-editing');
      updatePoiCoordDisplay();
    });
  }

  function togglePoiEditor() {
    poiEditorActive = !poiEditorActive;
    if (poiEditorActive) {
      if (poiEditorPanel) poiEditorPanel.classList.remove('hidden');
      if (btnToggleEditor) btnToggleEditor.classList.add('active');
      if (currentTargetPin) currentTargetPin.classList.add('is-editing');
      updatePoiCoordDisplay();
    } else {
      if (poiEditorPanel) poiEditorPanel.classList.add('hidden');
      if (btnToggleEditor) btnToggleEditor.classList.remove('active');
      if (currentTargetPin) currentTargetPin.classList.remove('is-editing');
    }
  }

  if (btnToggleEditor) btnToggleEditor.addEventListener('click', togglePoiEditor);
  if (btnClosePoiEditor) btnClosePoiEditor.addEventListener('click', togglePoiEditor);

  btnSteps.forEach(btn => {
    btn.addEventListener('click', () => {
      btnSteps.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStep = parseFloat(btn.dataset.step) || 0.1;
    });
  });

  wheelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!currentTargetPin) return;
      let top = parseFloat(currentTargetPin.style.top) || 0;
      let left = parseFloat(currentTargetPin.style.left) || 0;
      const dir = btn.dataset.dir;

      if (dir === 'up') top -= activeStep;
      if (dir === 'down') top += activeStep;
      if (dir === 'left') left -= activeStep;
      if (dir === 'right') left += activeStep;

      setPoiPosition(top, left);
    });
  });

  if (btnCopyPoiCoords) {
    btnCopyPoiCoords.addEventListener('click', () => {
      if (!currentTargetPin) return;
      const cssString = `top: ${currentTargetPin.style.top}; left: ${currentTargetPin.style.left};`;
      navigator.clipboard.writeText(cssString).then(() => {
        btnCopyPoiCoords.textContent = '✓ ¡Copiado!';
        setTimeout(() => { btnCopyPoiCoords.textContent = '📋 Copiar Coordenadas CSS'; }, 1800);
      });
    });
  }

  // Zoom Buttons
  if (mapZoomInBtn) mapZoomInBtn.addEventListener('click', () => setZoom(mapScale + 0.25, null, null, true));
  if (mapZoomOutBtn) mapZoomOutBtn.addEventListener('click', () => setZoom(mapScale - 0.25, null, null, true));
  if (mapZoomResetBtn) mapZoomResetBtn.addEventListener('click', resetMapZoom);

  // Transition into 360 Experience
  function enterExperience() {
    if (hubScreen) hubScreen.classList.add('hidden');
    if (loadingScreen) loadingScreen.classList.add('hidden');
    document.body.classList.add('hud-active');
    experienceStarted = true;
    showHUD();
    resetIdleTimer();
    setupActivityListeners();
  }

  if (ctrlHubBtn) {
    ctrlHubBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      exitToMapHub();
    });
  }

  function exitToMapHub() {
    experienceStarted = false;
    clearTimeout(idleTimer);
    hideHUD();
    document.body.classList.remove('hud-active');
    if (hubScreen) hubScreen.classList.remove('hidden');
  }

  function showHUD() { if (experienceStarted) hudOverlay.classList.remove('hud-hidden'); }
  function hideHUD() { if (experienceStarted) hudOverlay.classList.add('hud-hidden'); }
  function resetIdleTimer() {
    if (!experienceStarted) return;
    showHUD();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(hideHUD, idleTimeoutMs);
  }

  function setupActivityListeners() {
    ['mousemove', 'mousedown', 'pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(evt => {
      document.addEventListener(evt, resetIdleTimer, { passive: true });
    });
  }

  // Initial load
  updateAdminUI();
});
