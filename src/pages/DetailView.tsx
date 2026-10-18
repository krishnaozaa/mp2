import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import { ErrorMessage, Loading } from '../components/Status';
import TypeBadge from '../components/TypeBadge';
import type { DetailNavState } from '../types';
import { TYPE_COLORS, formatName, padId } from '../utils';
import styles from './DetailView.module.css';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};
const MAX_STAT = 255;

export default function DetailView() {
  const { pokemon, loading, error } = usePokemon();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // If we came from the list/gallery, cycle through exactly what was shown there.
  // If the URL was opened directly, fall back to every Pokémon in Pokédex order.
  const passed = location.state as DetailNavState | null;
  const navState: DetailNavState =
    passed && passed.ids.length > 0
      ? passed
      : { ids: pokemon.map((p) => p.id).sort((a, b) => a - b), from: 'list', returnTo: '/list' };

  const currentId = Number(id);
  const current = pokemon.find((p) => p.id === currentId);
  const index = navState.ids.indexOf(currentId);
  const total = navState.ids.length;

  // Wrap around at both ends
  const prevId = index >= 0 ? navState.ids[(index - 1 + total) % total] : undefined;
  const nextId = index >= 0 ? navState.ids[(index + 1) % total] : undefined;

  const go = (targetId?: number) => {
    if (targetId !== undefined) navigate(`/pokemon/${targetId}`, { state: navState });
  };

  // Left / right arrow keys also cycle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(prevId);
      if (e.key === 'ArrowRight') go(nextId);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  if (!current) {
    return (
      <div className={styles.notFound}>
        <h1>No Pokémon with id “{id}”</h1>
        <Link to="/list">Back to search</Link>
      </div>
    );
  }

  const mainColor = TYPE_COLORS[current.types[0]] ?? '#777';

  return (
    <section>
      <div className={styles.topBar}>
        <Link to={navState.returnTo} className={styles.back}>
          ← Back to {navState.from === 'gallery' ? 'gallery' : 'search'}
        </Link>
        {index >= 0 && (
          <span className={styles.position}>
            {index + 1} of {total}
          </span>
        )}
      </div>

      <div className={styles.wrapper}>
        <button
          className={styles.arrow}
          onClick={() => go(prevId)}
          disabled={prevId === undefined || total < 2}
          aria-label="Previous Pokémon"
        >
          ‹
        </button>

        <article className={styles.card} style={{ '--main': mainColor } as React.CSSProperties}>
          <div className={styles.hero}>
            {/* key forces a fresh <img> so the previous Pokémon's art never lingers */}
            <img key={current.id} src={current.image} alt={formatName(current.name)} />
          </div>

          <div className={styles.body}>
            <span className={styles.id}>{padId(current.id)}</span>
            <h1 className={styles.name}>{formatName(current.name)}</h1>
            <div className={styles.types}>
              {current.types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>

            <dl className={styles.facts}>
              <div><dt>Height</dt><dd>{(current.height / 10).toFixed(1)} m</dd></div>
              <div><dt>Weight</dt><dd>{(current.weight / 10).toFixed(1)} kg</dd></div>
              <div><dt>Base XP</dt><dd>{current.baseExperience}</dd></div>
            </dl>

            <h2 className={styles.heading}>Abilities</h2>
            <ul className={styles.abilities}>
              {current.abilities.map((a) => (
                <li key={a}>{formatName(a)}</li>
              ))}
            </ul>

            <h2 className={styles.heading}>Base stats</h2>
            <ul className={styles.stats}>
              {current.stats.map((s) => (
                <li key={s.name}>
                  <span className={styles.statName}>{STAT_LABELS[s.name] ?? s.name}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.bar}>
                    <span style={{ width: `${(s.value / MAX_STAT) * 100}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <button
          className={styles.arrow}
          onClick={() => go(nextId)}
          disabled={nextId === undefined || total < 2}
          aria-label="Next Pokémon"
        >
          ›
        </button>
      </div>
    </section>
  );
}
