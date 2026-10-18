import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loadAllPokemon } from '../api/pokeapi';
import type { Pokemon } from '../types';

interface PokemonState {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  usedMock: boolean;
}

const PokemonContext = createContext<PokemonState | null>(null);

// Fetch once at the top of the app; every view reads from the same data.
export function PokemonProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PokemonState>({
    pokemon: [],
    loading: true,
    error: null,
    usedMock: false,
  });

  useEffect(() => {
    let cancelled = false;
    loadAllPokemon()
      .then(({ pokemon, usedMock }) => {
        if (!cancelled) setState({ pokemon, loading: false, error: null, usedMock });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({ pokemon: [], loading: false, error: String(err), usedMock: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <PokemonContext.Provider value={state}>{children}</PokemonContext.Provider>;
}

export function usePokemon(): PokemonState {
  const ctx = useContext(PokemonContext);
  if (!ctx) throw new Error('usePokemon must be used inside <PokemonProvider>');
  return ctx;
}
