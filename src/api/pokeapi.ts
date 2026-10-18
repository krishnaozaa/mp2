import axios from 'axios';
import type { Pokemon } from '../types';
import { MOCK_POKEMON } from './mock';

const api = axios.create({ baseURL: 'https://pokeapi.co/api/v2', timeout: 10000 });

// Gen 1 — enough data to be interesting, small enough to load quickly
export const POKEMON_COUNT = 151;
const CACHE_KEY = `pokedex-cache-v1-${POKEMON_COUNT}`;

interface RawPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: { 'official-artwork'?: { front_default: string | null } };
  };
}

function toPokemon(raw: RawPokemon): Pokemon {
  return {
    id: raw.id,
    name: raw.name,
    height: raw.height,
    weight: raw.weight,
    baseExperience: raw.base_experience ?? 0,
    types: raw.types.map((t) => t.type.name),
    abilities: raw.abilities.map((a) => a.ability.name),
    stats: raw.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    image: raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default ?? '',
    sprite: raw.sprites.front_default ?? '',
  };
}

function readCache(): Pokemon[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? (JSON.parse(cached) as Pokemon[]) : null;
  } catch {
    return null;
  }
}

function writeCache(data: Pokemon[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked — caching is only an optimisation */
  }
}

export interface LoadResult {
  pokemon: Pokemon[];
  usedMock: boolean;
}

/**
 * Loads all Pokémon once. Results are cached in localStorage so reloads don't
 * hit the API again (avoids rate limits). If the API is down, falls back to
 * hard-coded mock data so the app still works.
 */
export async function loadAllPokemon(): Promise<LoadResult> {
  const cached = readCache();
  if (cached) return { pokemon: cached, usedMock: false };

  try {
    const ids = Array.from({ length: POKEMON_COUNT }, (_, i) => i + 1);
    const responses = await Promise.all(ids.map((id) => api.get<RawPokemon>(`/pokemon/${id}`)));
    const pokemon = responses.map((r) => toPokemon(r.data));
    writeCache(pokemon);
    return { pokemon, usedMock: false };
  } catch (err) {
    console.error('PokéAPI request failed, using mock data instead', err);
    return { pokemon: MOCK_POKEMON, usedMock: true };
  }
}
