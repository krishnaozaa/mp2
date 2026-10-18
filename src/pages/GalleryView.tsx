import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import { ErrorMessage, Loading } from '../components/Status';
import type { DetailNavState } from '../types';
import { TYPE_COLORS, formatName, padId } from '../utils';
import styles from './GalleryView.module.css';

type MatchMode = 'any' | 'all';

export default function GalleryView() {
  const { pokemon, loading, error } = usePokemon();

  // Selected types + match mode live in the URL (?types=fire,water&match=any)
  const [params, setParams] = useSearchParams();
  const selected = (params.get('types') ?? '').split(',').filter(Boolean);
  const match: MatchMode = params.get('match') === 'all' ? 'all' : 'any';

  const setFilters = (types: string[], mode: MatchMode = match) => {
    const next = new URLSearchParams();
    if (types.length) next.set('types', types.join(','));
    if (mode === 'all') next.set('match', 'all');
    setParams(next, { replace: true });
  };

  const toggleType = (type: string) =>
    setFilters(selected.includes(type) ? selected.filter((t) => t !== type) : [...selected, type]);

  // Every type that appears in the data, in a stable order
  const allTypes = useMemo(
    () => [...new Set(pokemon.flatMap((p) => p.types))].sort(),
    [pokemon],
  );

  // "any" = has at least one selected type, "all" = has every selected type
  const results =
    selected.length === 0
      ? pokemon
      : pokemon.filter((p) =>
          match === 'all'
            ? selected.every((t) => p.types.includes(t))
            : selected.some((t) => p.types.includes(t)),
        );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const navState: DetailNavState = { ids: results.map((p) => p.id), from: 'gallery', returnTo: `/gallery?${params.toString()}` };

  return (
    <section>
      <h1 className={styles.title}>Gallery</h1>

      <div className={styles.filterBar}>
        <div className={styles.chips} role="group" aria-label="Filter by type">
          {allTypes.map((type) => {
            const on = selected.includes(type);
            return (
              <button
                key={type}
                className={`${styles.chip} ${on ? styles.chipOn : ''}`}
                style={{ '--type-color': TYPE_COLORS[type] ?? '#777' } as React.CSSProperties}
                onClick={() => toggleType(type)}
                aria-pressed={on}
              >
                {formatName(type)}
              </button>
            );
          })}
        </div>
        <div className={styles.filterMeta}>
          <label className={styles.match}>
            Match
            <select
              value={match}
              onChange={(e) => setFilters(selected, e.target.value as MatchMode)}
            >
              <option value="any">any selected type</option>
              <option value="all">all selected types</option>
            </select>
          </label>
          {selected.length > 0 && (
            <button className={styles.clear} onClick={() => setFilters([])}>
              Clear filters
            </button>
          )}
          <span className={styles.count}>{results.length} shown</span>
        </div>
      </div>

      {results.length === 0 ? (
        <p className={styles.empty}>No Pokémon have all of those types. Try “any” instead.</p>
      ) : (
        <ul className={styles.grid}>
          {results.map((p) => (
            <li key={p.id}>
              <Link to={`/pokemon/${p.id}`} state={navState} className={styles.card}>
                <img src={p.image} alt={formatName(p.name)} loading="lazy" />
                <span className={styles.cardId}>{padId(p.id)}</span>
                <span className={styles.cardName}>{formatName(p.name)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
