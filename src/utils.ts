export const formatName = (name: string) =>
  name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const padId = (id: number) => `#${String(id).padStart(3, '0')}`;

// Colours used for type badges and filter chips
export const TYPE_COLORS: Record<string, string> = {
  normal: '#a8a77a', fire: '#ee8130', water: '#6390f0', electric: '#e5be1d',
  grass: '#5fae3c', ice: '#6fc9c3', fighting: '#c22e28', poison: '#a33ea1',
  ground: '#c9a74f', flying: '#8f7fd8', psychic: '#f95587', bug: '#94a51b',
  rock: '#b6a136', ghost: '#735797', dragon: '#6f35fc', dark: '#705746',
  steel: '#8f8fa5', fairy: '#d685ad',
};
