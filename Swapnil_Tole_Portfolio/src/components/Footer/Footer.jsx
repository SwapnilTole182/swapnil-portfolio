import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <p className={styles.copyright}>
            &copy; {currentYear} Swapnil Tole. All rights reserved.
          </p>
        </div>
        <div className={styles.right}>
          <a href="#" className={styles.link}>LinkedIn</a>
          <a href="#" className={styles.link}>GitHub</a>
          <a href="mailto:swapnil.info2020@gmail.com" className={styles.link}>Email</a>
        </div>
      </div>
    </footer>
  );
}
