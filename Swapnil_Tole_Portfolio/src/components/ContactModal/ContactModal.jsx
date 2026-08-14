import { useEffect } from 'react';
import styles from './ContactModal.module.css';

export default function ContactModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 className={styles.title}>Get in Touch</h2>
        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your Name" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Your Email" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="4" placeholder="How can I help you?" required></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>Send Message</button>
        </form>
      </div>
    </div>
  );
}
