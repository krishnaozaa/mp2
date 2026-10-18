import styles from './Status.module.css';

export function Loading() {
  return (
    <div className={styles.status} role="status">
      <div className={styles.spinner} />
      <p>Catching Pokémon…</p>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className={`${styles.status} ${styles.error}`} role="alert">
      <p>Something went wrong: {message}</p>
    </div>
  );
}
