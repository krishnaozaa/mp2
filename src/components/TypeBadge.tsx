import { TYPE_COLORS, formatName } from '../utils';
import styles from './TypeBadge.module.css';

export default function TypeBadge({ type }: { type: string }) {
  return (
    <span className={styles.badge} style={{ background: TYPE_COLORS[type] ?? '#777' }}>
      {formatName(type)}
    </span>
  );
}
