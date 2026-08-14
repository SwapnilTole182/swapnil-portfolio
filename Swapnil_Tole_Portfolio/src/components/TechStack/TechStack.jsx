import styles from './TechStack.module.css';

const categories = [
  {
    title: 'Frontend',
    skills: ['React', 'JavaScript (ES6+)', 'HTML5', 'CSS3'],
  },
  {
    title: 'Backend',
    skills: ['Java', 'Spring Boot', 'Hibernate', 'REST APIs'],
  },
  {
    title: 'API Documentation & Testing',
    skills: ['Swagger / OpenAPI', 'Postman'],
  },
  {
    title: 'Database',
    skills: ['MySQL'],
  },
  {
    title: 'Version Control',
    skills: ['Git Desktop', 'GitHub'],
  },
  {
    title: 'Tools & IDE',
    skills: ['IntelliJ IDEA', 'Eclipse', 'VS Code', 'MySQL Workbench'],
  },
];

export default function TechStack() {
  return (
    <section className={styles.techStack} id="tech-stack">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Technology Stack</h2>
          <p className={styles.subtitle}>
            A comprehensive toolkit for building scalable, end-to-end applications.
          </p>
        </div>
        
        <div className={styles.grid}>
          {categories.map((category, idx) => (
            <div key={idx} className={styles.card}>
              <h3 className={styles.cardTitle}>{category.title}</h3>
              <div className={styles.tags}>
                {category.skills.map((skill, sIdx) => (
                  <span key={sIdx} className={styles.tag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
