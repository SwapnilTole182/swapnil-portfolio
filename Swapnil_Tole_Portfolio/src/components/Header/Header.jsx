import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <a href="#contact" className={styles.contactButton}>
        Get in Touch
      </a>
    </header>
  );
}
