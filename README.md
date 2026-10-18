# MP2 — Pokédex

React + TypeScript + React Router + Axios app built on [PokéAPI](https://pokeapi.co/) (Gen 1, 151 Pokémon).

- **List view** (`/list`): search filters as you type (name or number); sort by Pokédex number, name, height, weight or base experience, ascending or descending.
- **Gallery view** (`/gallery`): official artwork grid; filter by one or more types, matching any or all selected types.
- **Detail view** (`/pokemon/:id`): types, height, weight, base XP, abilities and base stats. Previous/Next arrows (and ← → keys) cycle through whatever list you came from, wrapping at the ends.

API results are cached in localStorage to avoid rate limits; if PokéAPI is down the app falls back to bundled sample data.

```bash
npm install
npm run dev   # http://localhost:5173/mp2/
```
