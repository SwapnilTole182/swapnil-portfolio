import styles from './Experience.module.css';

const experiences = [
  {
    role: 'Java Full-Stack Developer',
    company: 'CARYANAMINDIA Pvt Ltd.',
    duration: 'May 2026 - Present',
    description: 'Developing scalable projects using Spring Boot and designing responsive user interfaces with React. Improved application performance by 25% through database query optimization.',
    skills: ['Java', 'Spring Boot', 'React', 'MySQL']
  },
  // {
  //   role: 'Freelance Web Developer',
  //   company: 'Self-Employed',
  //   duration: 'Jun 2024 - Dec 2024',
  //   description: 'Built custom web applications for local businesses. Managed the full software development lifecycle from requirements gathering to deployment.',
  //   skills: ['JavaScript', 'HTML/CSS', 'Node.js']
  // },
  // {
  //   role: 'Open Source Contributor',
  //   company: 'Various Projects',
  //   duration: '2023 - 2024',
  //   description: 'Actively contributed to several open-source Java libraries on GitHub, fixing bugs and adding new features to improve community tooling.',
  //   skills: ['Java', 'Git', 'JUnit']
  // }
];

export default function Experience() {
  return (
    <section className={styles.experienceSection} id="experience">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Experience</h2>
          <p className={styles.subtitle}>My professional journey so far.</p>
        </div>

        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <div className={styles.timelineItem} key={index}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <h3 className={styles.role}>{exp.role}</h3>
                  <span className={styles.duration}>{exp.duration}</span>
                </div>
                <h4 className={styles.company}>{exp.company}</h4>
                <p className={styles.description}>{exp.description}</p>
                <div className={styles.skills}>
                  {exp.skills.map((skill, sIdx) => (
                    <span key={sIdx} className={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
