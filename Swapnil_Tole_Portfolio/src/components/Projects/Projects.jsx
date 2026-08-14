import styles from './Projects.module.css';

const projects = [
  {
    title: 'E-Commerce REST API',
    description: 'A fully featured e-commerce backend built with Spring Boot, Hibernate, and MySQL. Features JWT authentication, payment gateway integration, and order management.',
    tags: ['Spring Boot', 'Java', 'MySQL', 'JWT'],
    github: '#',
    demo: '#'
  },
  {
    title: 'Task Management App',
    description: 'A responsive full-stack task manager. Built with React for the frontend and Spring Boot for the RESTful API, utilizing WebSockets for real-time updates.',
    tags: ['React', 'Spring Boot', 'WebSockets'],
    github: '#',
    demo: '#'
  },
  {
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website built with React and Vite. Features complex CSS animations, glassmorphism design, and functional contact forms.',
    tags: ['React', 'CSS Modules', 'Vite'],
    github: '#',
    demo: '#'
  }
];

export default function Projects() {
  return (
    <section className={styles.projectsSection} id="projects">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Featured Projects</h2>
          <p className={styles.subtitle}>Some of my recent work and personal projects.</p>
        </div>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.cardContent}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.tags}>
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className={styles.cardActions}>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.button}>
                  GitHub
                </a>
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.primary}`}>
                  Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
