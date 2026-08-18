const MEDIA_STORAGE_KEY = 'barivision_360_media_v1';

const DEFAULT_SYSTEM_MEDIA = [
  { id: 'media-bahia-serena', title: 'Bahía Serena 360°', url: '/360/bahia-serena.webp', thumbUrl: '/360/thumbs/bahia-serena.webp', type: '360°', source: 'Sistema' },
  { id: 'media-catedral-huapi-1', title: 'Catedral Huapi 1 - Mirador 360°', url: '/360/catedral-huapi-1.webp', thumbUrl: '/360/thumbs/catedral-huapi-1.webp', type: '360°', source: 'Sistema' },
  { id: 'media-catedral-huapi-2', title: 'Catedral Huapi 2 - Costa 360°', url: '/360/catedral-huapi-2.webp', thumbUrl: '/360/thumbs/catedral-huapi-2.webp', type: '360°', source: 'Sistema' },
  { id: 'media-cerro-campanario-1', title: 'Cerro Campanario 1 - Cumbre 360°', url: '/360/cerro-campanario-1.webp', thumbUrl: '/360/thumbs/cerro-campanario-1.webp', type: '360°', source: 'Sistema' },
  { id: 'media-cerro-campanario-2', title: 'Cerro Campanario 2 - Lagos 360°', url: '/360/cerro-campanario-2.webp', thumbUrl: '/360/thumbs/cerro-campanario-2.webp', type: '360°', source: 'Sistema' },
  { id: 'media-cerro-catedral', title: 'Cerro Catedral 360°', url: '/360/cerro-catedral.webp', thumbUrl: '/360/thumbs/cerro-catedral.webp', type: '360°', source: 'Sistema' },
  { id: 'media-civico', title: 'Centro Cívico 360°', url: '/360/civico.webp', thumbUrl: '/360/thumbs/civico.webp', type: '360°', source: 'Sistema' },
  { id: 'media-iglesia-san-eduardo', title: 'Iglesia San Eduardo 360°', url: '/360/iglesia-san-eduardo.webp', thumbUrl: '/360/thumbs/iglesia-san-eduardo.webp', type: '360°', source: 'Sistema' },
  { id: 'media-lago-circuito-chico', title: 'Lago Circuito Chico 360°', url: '/360/lago-circuito-chico.webp', thumbUrl: '/360/thumbs/lago-circuito-chico.webp', type: '360°', source: 'Sistema' },
  { id: 'media-lago-escondido', title: 'Lago Escondido 360°', url: '/360/lago-escondido.webp', type: '360°', thumbUrl: '/360/thumbs/lago-escondido.webp', source: 'Sistema' },
  { id: 'media-llao-llao', title: 'Llao Llao 360°', url: '/360/llao-llao.webp', thumbUrl: '/360/thumbs/llao-llao.webp', type: '360°', source: 'Sistema' },
  { id: 'media-panoramico-circuito-chico', title: 'Panorámico Circuito Chico 360°', url: '/360/panoramico-circuito-chico.webp', thumbUrl: '/360/thumbs/panoramico-circuito-chico.webp', type: '360°', source: 'Sistema' },
  { id: 'media-pasarela-1', title: 'Pasarela 360°', url: '/360/pasarela-1.webp', thumbUrl: '/360/thumbs/pasarela-1.webp', type: '360°', source: 'Sistema' },
  { id: 'media-piedra-catedral', title: 'Piedra Catedral 360°', url: '/360/piedra-catedral.webp', thumbUrl: '/360/thumbs/piedra-catedral.webp', type: '360°', source: 'Sistema' },
  { id: 'media-playa-bonita', title: 'Playa Bonita 360°', url: '/360/playa-bonita.webp', thumbUrl: '/360/thumbs/playa-bonita.webp', type: '360°', source: 'Sistema' },
  { id: 'media-playa-sin-viento', title: 'Playa Sin Viento 360°', url: '/360/playa-sin-viento.webp', thumbUrl: '/360/thumbs/playa-sin-viento.webp', type: '360°', source: 'Sistema' }
];

export function getMediaLibrary() {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(DEFAULT_SYSTEM_MEDIA));
      return DEFAULT_SYSTEM_MEDIA;
    }
    const parsed = JSON.parse(raw);
    
    // Purge outdated unsplash or old casita placeholders if present in cached localStorage
    const hasOldMedia = parsed.some(m => !m.thumbUrl || (m.url && (m.url.includes('unsplash') || m.url.includes('casita-bari.webp'))));
    if (hasOldMedia) {
      const userUploads = parsed.filter(m => m.source === 'Usuario' && !m.url.includes('unsplash'));
      const cleanLibrary = [...userUploads, ...DEFAULT_SYSTEM_MEDIA];
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(cleanLibrary));
      return cleanLibrary;
    }

    return parsed;
  } catch (err) {
    console.error('Error reading media library store:', err);
    return DEFAULT_SYSTEM_MEDIA;
  }
}

export function addMediaItem(title, url, type = 'WebP Optimizada', source = 'Usuario', meta = {}) {
  const library = getMediaLibrary();
  const newItem = {
    id: 'media-' + Date.now(),
    title: title || 'Imagen ' + (library.length + 1),
    url,
    thumbUrl: meta.thumbUrl || url,
    type,
    source,
    originalSize: meta.originalSize || 0,
    optimizedSize: meta.optimizedSize || 0,
    ratio: meta.ratio || 0,
    width: meta.width || 0,
    height: meta.height || 0
  };
  library.unshift(newItem);
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(library));
  return newItem;
}

export function deleteMediaItem(id) {
  const library = getMediaLibrary();
  const filtered = library.filter(m => m.id !== id);
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}
