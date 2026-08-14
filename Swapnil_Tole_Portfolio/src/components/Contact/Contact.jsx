import { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/swapnil.info2020@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: 'New Portfolio Contact Form Submission!'
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.container}>

        <div className={styles.content}>
          <div className={styles.info}>
            <h2 className={styles.title}>Let's Work Together.</h2>
            <p className={styles.subtitle}>
              Aspiring Java Full-Stack Developer with strong hands-on experience in Java, Spring Boot, MySQL, and RESTful APIs. Eager to contribute to a dynamic engineering team while continuously learning and solving real-world challenges.
            </p>

            <div className={styles.contactDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <a href="mailto:swapnil.info2020@gmail.com" className={styles.detailLink}>swapnil.info2020@gmail.com</a>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>WhatsApp</span>
                <a href="https://wa.me/917769046182" target="_blank" rel="noopener noreferrer" className={styles.detailLink}>+91 77690 46182</a>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Socials</span>
                <div className={styles.socialLinks}>
                  <a href="#" className={styles.socialLink}>LinkedIn</a>
                  <a href="#" className={styles.socialLink}>GitHub</a>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formWrapper}>
            {isSubmitted ? (
              <div className={styles.successMessage}>
                <h3>Thank you!</h3>
                <p>Your message has been received. I'll get back to you shortly.</p>
                <button className={styles.resetButton} onClick={() => setIsSubmitted(false)}>Send another message</button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder=" "
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <label htmlFor="name">Your Name</label>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder=" "
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <label htmlFor="email">Your Email</label>
                </div>

                <div className={styles.inputGroup}>
                  <textarea
                    id="message"
                    rows="5"
                    required
                    placeholder=" "
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                  <label htmlFor="message">Your Message</label>
                </div>

                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <span className={styles.btnArrow}>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
