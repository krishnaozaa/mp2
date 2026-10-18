import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import { ErrorMessage, Loading } from '../components/Status';
import TypeBadge from '../components/TypeBadge';
import type { DetailNavState, Pokemon, SortKey, SortOrder } from '../types';
import { formatName, padId } from '../utils';
import styles from './ListView.module.css';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id', label: 'Pokédex number' },
  { value: 'name', label: 'Name' },
  { value: 'height', label: 'Height' },
  { value: 'weight', label: 'Weight' },
  { value: 'baseExperience', label: 'Base experience' },
];

function compare(a: Pokemon, b: Pokemon, key: SortKey): number {
  if (key === 'name') return a.name.localeCompare(b.name);
  return a[key] - b[key];
}

export default function ListView() {
  const { pokemon, loading, error } = usePokemon();

  // Search state lives in the URL, so coming back from a detail page keeps it
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const sortKey = (params.get('sort') as SortKey) ?? 'id';
  const order = (params.get('order') as SortOrder) ?? 'asc';

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  // Filter as you type, then sort — all client-side
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = pokemon.filter(
      (p) => p.name.includes(q) || String(p.id) === q.replace('#', ''),
    );
    const dir = order === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => compare(a, b, sortKey) * dir || a.id - b.id);
  }, [pokemon, query, sortKey, order]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const navState: DetailNavState = { ids: results.map((p) => p.id), from: 'list', returnTo: `/list?${params.toString()}` };

  return (
    <section>
      <h1 className={styles.title}>Search Pokémon</h1>

      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search by name or number…"
          value={query}
          onChange={(e) => update('q', e.target.value)}
          aria-label="Search Pokémon"
          autoFocus
        />
        <label className={styles.field}>
          <span>Sort by</span>
          <select value={sortKey} onChange={(e) => update('sort', e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.toggle} role="group" aria-label="Sort order">
          <button
            className={order === 'asc' ? styles.on : ''}
            onClick={() => update('order', 'asc')}
            aria-pressed={order === 'asc'}
          >
            ↑ Asc
          </button>
          <button
            className={order === 'desc' ? styles.on : ''}
            onClick={() => update('order', 'desc')}
            aria-pressed={order === 'desc'}
          >
            ↓ Desc
          </button>
        </div>
      </div>

      <p className={styles.count}>
        {results.length} result{results.length === 1 ? '' : 's'}
      </p>

      {results.length === 0 ? (
        <p className={styles.empty}>No Pokémon match “{query}”.</p>
      ) : (
        <ul className={styles.list}>
          {results.map((p) => (
            <li key={p.id}>
              <Link to={`/pokemon/${p.id}`} state={navState} className={styles.row}>
                <img src={p.sprite} alt="" className={styles.sprite} loading="lazy" />
                <div className={styles.info}>
                  <span className={styles.id}>{padId(p.id)}</span>
                  <span className={styles.name}>{formatName(p.name)}</span>
                  <span className={styles.types}>
                    {p.types.map((t) => (
                      <TypeBadge key={t} type={t} />
                    ))}
                  </span>
                </div>
                <dl className={styles.stats}>
                  <div><dt>Height</dt><dd>{(p.height / 10).toFixed(1)} m</dd></div>
                  <div><dt>Weight</dt><dd>{(p.weight / 10).toFixed(1)} kg</dd></div>
                  <div><dt>Base XP</dt><dd>{p.baseExperience}</dd></div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
