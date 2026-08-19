// Storage module for Barivision 360 Entries

const STORAGE_KEY = 'barivision_360_entries_v5';

const DEFAULT_ENTRIES = [
  {
    id: 'entry-llao-llao',
    title: 'Llao Llao',
    subtitle: 'Puerto & Península Llao Llao',
    description: 'Icónica península de Llao Llao con vistas panorámicas al lago Nahuel Huapi y el hotel histórico.',
    coverImage: '/360/llao-llao.webp',
    lat: -41.0531,
    lng: -71.5302,
    mapPos: { top: 22.0, left: 16.0 },
    address: 'Península Llao Llao, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0531,-71.5302',
    referenceLinks: [],
    scenes: [
      { id: 'sc-llao-llao-1', title: 'Llao Llao 360°', panoramaUrl: '/360/llao-llao.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-iglesia-san-eduardo',
    title: 'Iglesia San Eduardo',
    subtitle: 'Llao Llao • Capilla Histórica',
    description: 'Pintoresca capilla construida en 1938 con maderas regionales y vitrales históricos.',
    coverImage: '/360/iglesia-san-eduardo.webp',
    lat: -41.0562,
    lng: -71.5312,
    mapPos: { top: 25.0, left: 21.0 },
    address: 'Llao Llao, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0562,-71.5312',
    referenceLinks: [
      { label: 'Patrimonio Llao Llao', url: 'https://barilocheturismo.gob.ar' }
    ],
    scenes: [
      { id: 'sc-san-eduardo-1', title: 'Iglesia San Eduardo 360°', panoramaUrl: '/360/iglesia-san-eduardo.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-lago-escondido',
    title: 'Lago Escondido',
    subtitle: 'Sendero & Laguna Natural',
    description: 'Escondida laguna natural de aguas calmas rodeada de bosques autóctonos.',
    coverImage: '/360/lago-escondido.webp',
    lat: -41.0512,
    lng: -71.5453,
    mapPos: { top: 28.5, left: 13.5 },
    address: 'Circuito Chico, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0512,-71.5453',
    referenceLinks: [],
    scenes: [
      { id: 'sc-lago-escondido-1', title: 'Lago Escondido 360°', panoramaUrl: '/360/lago-escondido.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-pasarela',
    title: 'Arroyo La Angostura',
    subtitle: 'Puente & Pasarela sobre el Arroyo',
    description: 'Hermosa pasarela de madera sobre el arroyo La Angostura que une el Lago Moreno con el Lago Nahuel Huapi.',
    coverImage: '/360/pasarela-1.webp',
    lat: -41.0583,
    lng: -71.5284,
    mapPos: { top: 35.5, left: 17.5 },
    address: 'Arroyo La Angostura, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0583,-71.5284',
    referenceLinks: [],
    scenes: [
      { id: 'sc-pasarela-1', title: 'Arroyo La Angostura 360°', panoramaUrl: '/360/pasarela-1.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-panoramico-circuito-chico',
    title: 'Panorámico Circuito Chico',
    subtitle: 'Punto de Vista Mirador',
    description: 'Punto estratégico de observación para admirar el lago Moreno y el Hotel Llao Llao.',
    coverImage: '/360/panoramico-circuito-chico.webp',
    lat: -41.0702,
    lng: -71.5152,
    mapPos: { top: 38.0, left: 22.5 },
    address: 'Punto Panorámico, Circuito Chico',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0702,-71.5152',
    referenceLinks: [],
    scenes: [
      { id: 'sc-panoramico-1', title: 'Panorámico Circuito Chico 360°', panoramaUrl: '/360/panoramico-circuito-chico.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-lago-circuito-chico',
    title: 'Lago Moreno (Mirador)',
    subtitle: 'Vista Panorámica del Lago Moreno',
    description: 'Impresionante vista panorámica del Lago Moreno desde el recorrido de Circuito Chico.',
    coverImage: '/360/lago-circuito-chico.webp',
    lat: -41.0652,
    lng: -71.5102,
    mapPos: { top: 43.0, left: 27.0 },
    address: 'Circuito Chico, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0652,-71.5102',
    referenceLinks: [],
    scenes: [
      { id: 'sc-lago-circuito-1', title: 'Lago Moreno (Mirador) 360°', panoramaUrl: '/360/lago-circuito-chico.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-colonia-suiza',
    title: 'Colonia Suiza',
    subtitle: 'Aldea Histórica & Gastronomía',
    description: 'Pintoresca aldea histórica entre cerros y bosques, famosa por su curanto y repostería artesanal.',
    coverImage: '/360/lago-circuito-chico.webp',
    lat: -41.0965,
    lng: -71.5053,
    mapPos: { top: 48.0, left: 29.0 },
    address: 'Colonia Suiza, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0965,-71.5053',
    referenceLinks: [],
    scenes: [
      { id: 'sc-colonia-suiza-1', title: 'Colonia Suiza 360°', panoramaUrl: '/360/lago-circuito-chico.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-playa-sin-viento',
    title: 'Playa Sin Viento',
    subtitle: 'Lago Moreno • Puerto Moreno',
    description: 'Resguardada playa sobre el Lago Moreno, ideal para deportes náuticos y tranquilidad.',
    coverImage: '/360/playa-sin-viento.webp',
    lat: -41.0851,
    lng: -71.4952,
    mapPos: { top: 46.0, left: 33.0 },
    address: 'Puerto Moreno, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0851,-71.4952',
    referenceLinks: [],
    scenes: [
      { id: 'sc-playa-sin-viento-1', title: 'Playa Sin Viento 360°', panoramaUrl: '/360/playa-sin-viento.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-cerro-campanario',
    title: 'Cerro Campanario',
    subtitle: 'Mirador Panorámico • 2 Escenas 360°',
    description: 'Reconocida por National Geographic como una de las mejores vistas panorámicas del mundo.',
    coverImage: '/360/cerro-campanario-1.webp',
    lat: -41.0772,
    lng: -71.4722,
    mapPos: { top: 32.0, left: 36.0 },
    address: 'Av. Bustillo Km 17.5, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0772,-71.4722',
    referenceLinks: [
      { label: 'Aerosilla Cerro Campanario', url: 'http://www.cerrocampanario.com.ar' }
    ],
    scenes: [
      { id: 'sc-campanario-1', title: 'Ángulo 1 - Cumbre', panoramaUrl: '/360/cerro-campanario-1.webp', pitch: 0, yaw: 0, hfov: 100 },
      { id: 'sc-campanario-2', title: 'Ángulo 2 - Vista Lagos', panoramaUrl: '/360/cerro-campanario-2.webp', pitch: 0, yaw: 90, hfov: 100 }
    ]
  },
  {
    id: 'entry-bahia-serena',
    title: 'Bahía Serena',
    subtitle: 'Playa Nahuel Huapi • Km 12',
    description: 'Tranquila bahía sobre el lago Nahuel Huapi de arenas finas y aguas calmas.',
    coverImage: '/360/bahia-serena.webp',
    lat: -41.1182,
    lng: -71.4352,
    mapPos: { top: 34.5, left: 44.0 },
    address: 'Av. Bustillo Km 12, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1182,-71.4352',
    referenceLinks: [
      { label: 'Información Turística', url: 'https://barilocheturismo.gob.ar' }
    ],
    scenes: [
      { id: 'sc-bahia-1', title: 'Bahía Serena 360°', panoramaUrl: '/360/bahia-serena.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-playa-bonita',
    title: 'Playa Bonita',
    subtitle: 'Playa Nahuel Huapi • Km 8',
    description: 'Popular playa de piedra con vista directa a la Isla Huemul.',
    coverImage: '/360/playa-bonita.webp',
    lat: -41.1252,
    lng: -71.3952,
    mapPos: { top: 37.0, left: 52.0 },
    address: 'Av. Bustillo Km 8, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1252,-71.3952',
    referenceLinks: [],
    scenes: [
      { id: 'sc-playa-bonita-1', title: 'Playa Bonita 360°', panoramaUrl: '/360/playa-bonita.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-catedral-huapi',
    title: 'Catedral Nuestra Señora del Nahuel Huapi',
    subtitle: 'Catedral de Bariloche • 2 Escenas 360°',
    description: 'Histórica catedral neogótica ubicada en el centro de San Carlos de Bariloche junto a la costa del Lago Nahuel Huapi.',
    coverImage: '/360/catedral-huapi-1.webp',
    lat: -41.1332,
    lng: -71.3055,
    mapPos: { top: 40.0, left: 76.0 },
    address: 'San Carlos de Bariloche, Río Negro',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1332,-71.3055',
    referenceLinks: [
      { label: 'Catedral de Bariloche', url: 'https://barilocheturismo.gob.ar' }
    ],
    scenes: [
      { id: 'sc-cat-huapi-1', title: 'Ángulo 1 - Mirador', panoramaUrl: '/360/catedral-huapi-1.webp', pitch: 0, yaw: 0, hfov: 100 },
      { id: 'sc-cat-huapi-2', title: 'Ángulo 2 - Vista Costa', panoramaUrl: '/360/catedral-huapi-2.webp', pitch: 0, yaw: 45, hfov: 100 }
    ]
  },
  {
    id: 'entry-centro-civico',
    title: 'Centro Cívico',
    subtitle: 'Plaza Histórica • Bariloche',
    description: 'Monumento histórico nacional y corazón arquitectónico con estilo alpino en madera y piedra.',
    coverImage: '/360/civico.webp',
    lat: -41.1335,
    lng: -71.3103,
    mapPos: { top: 41.5, left: 74.0 },
    address: 'Centro Cívico, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1335,-71.3103',
    referenceLinks: [
      { label: 'Museo de la Patagonia', url: 'https://barilocheturismo.gob.ar' }
    ],
    scenes: [
      { id: 'sc-civico-1', title: 'Centro Cívico 360°', panoramaUrl: '/360/civico.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-cerro-catedral',
    title: 'Cerro Catedral',
    subtitle: 'Centro de Esquí & Montaña • Villa Catedral',
    description: 'El centro de esquí más grande de Sudamérica con vistas a la Cordillera de los Andes.',
    coverImage: '/360/cerro-catedral.webp',
    lat: -41.1702,
    lng: -71.4402,
    mapPos: { top: 68.0, left: 42.0 },
    address: 'Villa Catedral, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1702,-71.4402',
    referenceLinks: [
      { label: 'Catedral Alta Patagonia', url: 'https://catedralaltapatagonia.com' }
    ],
    scenes: [
      { id: 'sc-cerro-cat-1', title: 'Cerro Catedral 360°', panoramaUrl: '/360/cerro-catedral.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-piedra-catedral',
    title: 'Mirador de Lago Gutiérrez y Nahuel Huapi',
    subtitle: 'Vista Panorámica de Lagos y Cordillera',
    description: 'Espectacular punto panorámico en las alturas con vista simultánea al Lago Gutiérrez y al Lago Nahuel Huapi.',
    coverImage: '/360/piedra-catedral.webp',
    lat: -41.1752,
    lng: -71.4352,
    mapPos: { top: 74.0, left: 54.0 },
    address: 'Mirador Lago Gutiérrez y Nahuel Huapi, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1752,-71.4352',
    referenceLinks: [],
    scenes: [
      { id: 'sc-piedra-cat-1', title: 'Mirador Lago Gutiérrez y Nahuel Huapi 360°', panoramaUrl: '/360/piedra-catedral.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  }
];

let memoryEntriesCache = null;

export async function fetchRemoteEntries() {
  try {
    const res = await fetch('/api/entries');
    if (res.ok) {
      const remoteData = await res.json();
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        memoryEntriesCache = remoteData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
        return remoteData;
      }
    }
  } catch (err) {
    console.warn('API /api/entries not reachable, using cached entries:', err.message);
  }

  // If DB/API is empty, seed defaults to backend!
  try {
    await fetch('/api/entries/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEFAULT_ENTRIES)
    });
  } catch (e) {}

  return getEntries();
}

export function getEntries() {
  if (memoryEntriesCache && memoryEntriesCache.length > 0) {
    return memoryEntriesCache;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveAllEntries(DEFAULT_ENTRIES);
    return DEFAULT_ENTRIES;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveAllEntries(DEFAULT_ENTRIES);
      return DEFAULT_ENTRIES;
    }
    memoryEntriesCache = parsed;
    return parsed;
  } catch (e) {
    console.error('Failed to parse entries from localStorage, preserving defaults:', e);
    saveAllEntries(DEFAULT_ENTRIES);
    return DEFAULT_ENTRIES;
  }
}

export async function saveAllEntries(entries) {
  memoryEntriesCache = entries;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  try {
    await fetch('/api/entries/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries)
    });
  } catch (e) {
    console.warn('Could not sync saveAllEntries to backend:', e.message);
  }
}

export function getEntryById(id) {
  const entries = getEntries();
  return entries.find(e => e.id === id) || null;
}

export async function saveEntry(entryData) {
  const entries = getEntries();
  const existingIndex = entries.findIndex(e => e.id === entryData.id);
  let updatedEntry = { ...entryData };

  if (existingIndex >= 0) {
    entries[existingIndex] = { ...entries[existingIndex], ...entryData };
    updatedEntry = entries[existingIndex];
  } else {
    if (!updatedEntry.id) {
      updatedEntry.id = 'entry-' + Date.now();
    }
    entries.push(updatedEntry);
  }

  memoryEntriesCache = entries;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

  try {
    await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEntry)
    });
  } catch (e) {
    console.warn('Could not sync saveEntry to backend:', e.message);
  }

  return updatedEntry;
}

export async function deleteEntry(id) {
  const entries = getEntries();
  const filtered = entries.filter(e => e.id !== id);
  memoryEntriesCache = filtered;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

  try {
    await fetch(`/api/entries/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('Could not sync deleteEntry to backend:', e.message);
  }
}

export async function resetEntriesToDefault() {
  await saveAllEntries(DEFAULT_ENTRIES);
  return DEFAULT_ENTRIES;
}
