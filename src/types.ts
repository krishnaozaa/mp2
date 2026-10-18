// Trimmed-down shape of what we use from https://pokeapi.co/api/v2/pokemon/{id}
export interface Pokemon {
  id: number;
  name: string;
  height: number; // decimetres
  weight: number; // hectograms
  baseExperience: number;
  types: string[];
  abilities: string[];
  stats: { name: string; value: number }[];
  image: string; // official artwork
  sprite: string; // small pixel sprite
}

export type SortKey = 'id' | 'name' | 'height' | 'weight' | 'baseExperience';
export type SortOrder = 'asc' | 'desc';

// Passed through router state so the detail view knows which list to cycle through
export interface DetailNavState {
  ids: number[];
  from: 'list' | 'gallery';
  returnTo: string; // path + query of the page we came from
}
