// Storage module for Barivision 360 Entries

const STORAGE_KEY = 'barivision_360_entries_v1';

const DEFAULT_ENTRIES = [
  {
    id: 'entry-bahia-serena',
    title: 'Bahía Serena',
    subtitle: 'Playa Nahuel Huapi • Km 12',
    description: 'Tranquila bahía sobre el lago Nahuel Huapi de arenas finas y aguas calmas.',
    coverImage: '/360/bahia-serena.webp',
    mapPos: { top: 40.0, left: 32.0 },
    address: 'Av. Bustillo Km 12, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1180,-71.4350',
    referenceLinks: [
      { label: 'Información Turística', url: 'https://barilocheturismo.gob.ar' }
    ],
    scenes: [
      { id: 'sc-bahia-1', title: 'Bahía Serena 360°', panoramaUrl: '/360/bahia-serena.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-catedral-huapi',
    title: 'Catedral Huapi',
    subtitle: 'Mirador de Costa y Lago • 2 Escenas 360°',
    description: 'Impresionante perspectiva panorámica combinando vistas de la costa y las sierras.',
    coverImage: '/360/catedral-huapi-1.webp',
    mapPos: { top: 32.0, left: 45.0 },
    address: 'Costa Nahuel Huapi, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1200,-71.3800',
    referenceLinks: [
      { label: 'Guía de Miradores', url: 'https://barilocheturismo.gob.ar' }
    ],
    scenes: [
      { id: 'sc-cat-huapi-1', title: 'Ángulo 1 - Mirador', panoramaUrl: '/360/catedral-huapi-1.webp', pitch: 0, yaw: 0, hfov: 100 },
      { id: 'sc-cat-huapi-2', title: 'Ángulo 2 - Vista Costa', panoramaUrl: '/360/catedral-huapi-2.webp', pitch: 0, yaw: 45, hfov: 100 }
    ]
  },
  {
    id: 'entry-cerro-campanario',
    title: 'Cerro Campanario',
    subtitle: 'Mirador Panorámico • 2 Escenas 360°',
    description: 'Reconocida por National Geographic como una de las mejores vistas panorámicas del mundo.',
    coverImage: '/360/cerro-campanario-1.webp',
    mapPos: { top: 30.0, left: 25.0 },
    address: 'Av. Bustillo Km 17.5, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0770,-71.4720',
    referenceLinks: [
      { label: 'Aerosilla Cerro Campanario', url: 'http://www.cerrocampanario.com.ar' }
    ],
    scenes: [
      { id: 'sc-campanario-1', title: 'Ángulo 1 - Cumbre', panoramaUrl: '/360/cerro-campanario-1.webp', pitch: 0, yaw: 0, hfov: 100 },
      { id: 'sc-campanario-2', title: 'Ángulo 2 - Vista Lagos', panoramaUrl: '/360/cerro-campanario-2.webp', pitch: 0, yaw: 90, hfov: 100 }
    ]
  },
  {
    id: 'entry-cerro-catedral',
    title: 'Cerro Catedral',
    subtitle: 'Centro de Esquí & Montaña',
    description: 'El centro de esquí más grande de Sudamérica con vistas a la Cordillera de los Andes.',
    coverImage: '/360/cerro-catedral.webp',
    mapPos: { top: 58.0, left: 28.0 },
    address: 'Base Cerro Catedral, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1700,-71.4400',
    referenceLinks: [
      { label: 'Catedral Alta Patagonia', url: 'https://catedralaltapatagonia.com' }
    ],
    scenes: [
      { id: 'sc-cerro-cat-1', title: 'Cerro Catedral 360°', panoramaUrl: '/360/cerro-catedral.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-centro-civico',
    title: 'Centro Cívico',
    subtitle: 'Plaza Histórica • Bariloche',
    description: 'Monumento histórico nacional y corazón arquitectónico con estilo alpino en madera y piedra.',
    coverImage: '/360/civico.webp',
    mapPos: { top: 38.0, left: 62.0 },
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
    id: 'entry-iglesia-san-eduardo',
    title: 'Iglesia San Eduardo',
    subtitle: 'Llao Llao • Capilla Histórica',
    description: 'Pintoresca capilla construida en 1938 con maderas regionales y vitrales históricos.',
    coverImage: '/360/iglesia-san-eduardo.webp',
    mapPos: { top: 22.0, left: 16.0 },
    address: 'Llao Llao, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0560,-71.5310',
    referenceLinks: [
      { label: 'Patrimonio Llao Llao', url: 'https://barilocheturismo.gob.ar' }
    ],
    scenes: [
      { id: 'sc-san-eduardo-1', title: 'Iglesia San Eduardo 360°', panoramaUrl: '/360/iglesia-san-eduardo.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-lago-circuito-chico',
    title: 'Lago Circuito Chico',
    subtitle: 'Vista Circuito Tradicional',
    description: 'Hermosa perspectiva del lago bordeado por la densa vegetación patagónica.',
    coverImage: '/360/lago-circuito-chico.webp',
    mapPos: { top: 34.0, left: 18.0 },
    address: 'Circuito Chico, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0650,-71.5100',
    referenceLinks: [],
    scenes: [
      { id: 'sc-lago-circuito-1', title: 'Lago Circuito Chico 360°', panoramaUrl: '/360/lago-circuito-chico.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-lago-escondido',
    title: 'Lago Escondido',
    subtitle: 'Sendero & Laguna Natural',
    description: 'Escondida laguna natural de aguas calmas rodeada de bosques autóctonos.',
    coverImage: '/360/lago-escondido.webp',
    mapPos: { top: 26.0, left: 12.0 },
    address: 'Circuito Chico, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0510,-71.5450',
    referenceLinks: [],
    scenes: [
      { id: 'sc-lago-escondido-1', title: 'Lago Escondido 360°', panoramaUrl: '/360/lago-escondido.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-llao-llao',
    title: 'Llao Llao',
    subtitle: 'Puerto & Entorno Natural',
    description: 'Icónica península de Llao Llao con vistas al lago Nahuel Huapi y el emblemático hotel.',
    coverImage: '/360/llao-llao.webp',
    mapPos: { top: 18.0, left: 19.0 },
    address: 'Península Llao Llao, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0530,-71.5300',
    referenceLinks: [],
    scenes: [
      { id: 'sc-llao-llao-1', title: 'Llao Llao 360°', panoramaUrl: '/360/llao-llao.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-panoramico-circuito-chico',
    title: 'Panorámico Circuito Chico',
    subtitle: 'Punto de Vista Mirador',
    description: 'Punto estratégico de observación para admirar el lago Moreno y el Hotel Llao Llao.',
    coverImage: '/360/panoramico-circuito-chico.webp',
    mapPos: { top: 28.0, left: 21.0 },
    address: 'Punto Panorámico, Circuito Chico',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0700,-71.5150',
    referenceLinks: [],
    scenes: [
      { id: 'sc-panoramico-1', title: 'Panorámico Circuito Chico 360°', panoramaUrl: '/360/panoramico-circuito-chico.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-pasarela',
    title: 'Pasarela',
    subtitle: 'Mirador de Madera & Sendero',
    description: 'Recorrido por pasarela de madera inmersa en la vegetación autóctona de la región.',
    coverImage: '/360/pasarela-1.webp',
    mapPos: { top: 44.0, left: 22.0 },
    address: 'Sendero Pasarela, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1100,-71.4900',
    referenceLinks: [],
    scenes: [
      { id: 'sc-pasarela-1', title: 'Pasarela 360°', panoramaUrl: '/360/pasarela-1.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-piedra-catedral',
    title: 'Piedra Catedral',
    subtitle: 'Formación Rocosa & Cordillera',
    description: 'Piedra majestuosa con vista privilegiada a las crestas rocosas de la cordillera.',
    coverImage: '/360/piedra-catedral.webp',
    mapPos: { top: 62.0, left: 32.0 },
    address: 'Cerro Catedral, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1750,-71.4350',
    referenceLinks: [],
    scenes: [
      { id: 'sc-piedra-cat-1', title: 'Piedra Catedral 360°', panoramaUrl: '/360/piedra-catedral.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-playa-bonita',
    title: 'Playa Bonita',
    subtitle: 'Playa Nahuel Huapi • Km 8',
    description: 'Popular playa de piedra con vista directa a la Isla Huemul.',
    coverImage: '/360/playa-bonita.webp',
    mapPos: { top: 42.0, left: 42.0 },
    address: 'Av. Bustillo Km 8, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.1250,-71.3950',
    referenceLinks: [],
    scenes: [
      { id: 'sc-playa-bonita-1', title: 'Playa Bonita 360°', panoramaUrl: '/360/playa-bonita.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  },
  {
    id: 'entry-playa-sin-viento',
    title: 'Playa Sin Viento',
    subtitle: 'Lago Moreno • Puerto Moreno',
    description: 'Resguardada playa sobre el Lago Moreno, ideal para deportes náuticos y tranquilidad.',
    coverImage: '/360/playa-sin-viento.webp',
    mapPos: { top: 36.0, left: 23.0 },
    address: 'Puerto Moreno, Bariloche',
    googleMapsUrl: 'https://maps.google.com/?q=-41.0850,-71.4950',
    referenceLinks: [],
    scenes: [
      { id: 'sc-playa-sin-viento-1', title: 'Playa Sin Viento 360°', panoramaUrl: '/360/playa-sin-viento.webp', pitch: 0, yaw: 0, hfov: 100 }
    ]
  }
];

export function getEntries() {
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
    return parsed;
  } catch (e) {
    console.error('Failed to parse entries from localStorage, preserving defaults:', e);
    saveAllEntries(DEFAULT_ENTRIES);
    return DEFAULT_ENTRIES;
  }
}

export function saveAllEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntryById(id) {
  const entries = getEntries();
  return entries.find(e => e.id === id) || null;
}

export function saveEntry(entryData) {
  const entries = getEntries();
  const existingIndex = entries.findIndex(e => e.id === entryData.id);
  
  if (existingIndex >= 0) {
    entries[existingIndex] = { ...entries[existingIndex], ...entryData };
  } else {
    if (!entryData.id) {
      entryData.id = 'entry-' + Date.now();
    }
    entries.push(entryData);
  }
  saveAllEntries(entries);
  return entryData;
}

export function deleteEntry(id) {
  const entries = getEntries();
  const filtered = entries.filter(e => e.id !== id);
  saveAllEntries(filtered);
}

export function resetEntriesToDefault() {
  saveAllEntries(DEFAULT_ENTRIES);
  return DEFAULT_ENTRIES;
}
