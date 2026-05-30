// ─── Constantes estáticas de la app ───────────────────────────────────────────
// Este archivo NO toca localStorage ni la API.
// Cuando conectes la API, las categorías vendrán del backend y puedes borrar esto.

export const CATEGORIES = [
  { slug: 'hombre',     label: 'HOMBRE' },
  { slug: 'mujer',      label: 'MUJER' },
  { slug: 'ninos',      label: 'NIÑOS' },
  { slug: 'deportivos', label: 'DEPORTIVOS' },
  { slug: 'casual',     label: 'CASUAL' },
  { slug: 'formal',     label: 'FORMAL' },
  { slug: 'botas',      label: 'BOTAS' },
  { slug: 'sandalias',  label: 'SANDALIAS' },
];

export const REVIEWS = [
  { name: 'Carlos M.', rating: 5, text: 'Excelente calidad y diseño brutal. Muy cómodos.' },
  { name: 'Ana P.',    rating: 5, text: 'Me encanta el estilo minimalista. Perfectos.' },
  { name: 'Diego R.',  rating: 4, text: 'Muy buenos zapatos. La entrega fue rápida.' },
];
