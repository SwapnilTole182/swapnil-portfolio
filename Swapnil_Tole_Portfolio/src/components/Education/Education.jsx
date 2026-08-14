import styles from './Education.module.css';

const education = [
  {
    degree: 'B.E. – Electronics and Telecommunication Engineering',
    institution: "Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering & Technology",
    duration: '2019 - 2022',
    description: 'Built a strong analytical foundation through core engineering coursework while independently specializing in software development, programming logic, and system design to pursue a career in full-stack engineering.',
    grade: 'CGPA: 8.5/10'
  },
  {
    degree: 'Full-Stack Java Development Certification',
    institution: 'Technobrilliant Learning Solutions,Pune',
    duration: '2025',
    description: 'Intensive program focused on building enterprise-grade applications using Java, Spring Boot, React, and MySQL.',
    grade: 'Certified'
  }
];

export default function Education() {
  return (
    <section className={styles.educationSection} id="education">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Education & Certifications</h2>
          <p className={styles.subtitle}>My academic background and continuous learning.</p>
        </div>

        <div className={styles.grid}>
          {education.map((item, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.cardGlow}></div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.degree}>{item.degree}</h3>
                  <span className={styles.duration}>{item.duration}</span>
                </div>
                <h4 className={styles.institution}>{item.institution}</h4>
                <p className={styles.description}>{item.description}</p>
                <div className={styles.gradeBadge}>
                  {item.grade}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
