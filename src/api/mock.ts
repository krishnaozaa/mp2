import type { Pokemon } from '../types';

// Small offline fallback used only if PokéAPI is unreachable.
const art = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
const sprite = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const make = (
  id: number,
  name: string,
  height: number,
  weight: number,
  baseExperience: number,
  types: string[],
  abilities: string[],
  stats: [number, number, number, number, number, number],
): Pokemon => ({
  id,
  name,
  height,
  weight,
  baseExperience,
  types,
  abilities,
  stats: ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((n, i) => ({
    name: n,
    value: stats[i],
  })),
  image: art(id),
  sprite: sprite(id),
});

export const MOCK_POKEMON: Pokemon[] = [
  make(1, 'bulbasaur', 7, 69, 64, ['grass', 'poison'], ['overgrow', 'chlorophyll'], [45, 49, 49, 65, 65, 45]),
  make(4, 'charmander', 6, 85, 62, ['fire'], ['blaze', 'solar-power'], [39, 52, 43, 60, 50, 65]),
  make(7, 'squirtle', 5, 90, 63, ['water'], ['torrent', 'rain-dish'], [44, 48, 65, 50, 64, 43]),
  make(25, 'pikachu', 4, 60, 112, ['electric'], ['static', 'lightning-rod'], [35, 55, 40, 50, 50, 90]),
  make(39, 'jigglypuff', 5, 55, 95, ['normal', 'fairy'], ['cute-charm', 'competitive'], [115, 45, 20, 45, 25, 20]),
  make(94, 'gengar', 15, 405, 250, ['ghost', 'poison'], ['cursed-body'], [60, 65, 60, 130, 75, 110]),
  make(131, 'lapras', 25, 2200, 187, ['water', 'ice'], ['water-absorb', 'shell-armor'], [130, 85, 80, 85, 95, 60]),
  make(143, 'snorlax', 21, 4600, 189, ['normal'], ['immunity', 'thick-fat'], [160, 110, 65, 65, 110, 30]),
  make(149, 'dragonite', 22, 2100, 300, ['dragon', 'flying'], ['inner-focus', 'multiscale'], [91, 134, 95, 100, 100, 80]),
  make(150, 'mewtwo', 20, 1220, 340, ['psychic'], ['pressure', 'unnerve'], [106, 110, 90, 154, 90, 130]),
];
