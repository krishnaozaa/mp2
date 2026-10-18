import { NavLink, Outlet } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { usedMock } = usePokemon();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <NavLink to="/list" className={styles.brand}>
          <span className={styles.ball} aria-hidden="true" />
          Pokédex
        </NavLink>
        <nav className={styles.nav}>
          <NavLink to="/list" className={linkClass}>Search</NavLink>
          <NavLink to="/gallery" className={linkClass}>Gallery</NavLink>
        </nav>
      </header>
      {usedMock && (
        <p className={styles.banner}>PokéAPI is unavailable right now, so you're seeing sample data.</p>
      )}
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>Data from PokéAPI</footer>
    </div>
  );
}
