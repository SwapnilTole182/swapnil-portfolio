import VideoIntro from './components/VideoIntro/VideoIntro';
import heroVideo from './components/VideoIntro/assets/hero-reel.mp4';
import './App.css';
import Header from './components/Header/Header';
import TechStack from './components/TechStack/TechStack';
import Experience from './components/Experience/Experience';
import Education from './components/Education/Education';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
  return (
    <>
      <Header />
      <VideoIntro
        videoSrc={heroVideo}
        eyebrow="Java Full-Stack Developer"
        firstName="Swapnil"
        lastName="Tole"
        subtitle="Transforming complex requirements into scalable full-stack solutions with Spring Boot and modern web technologies."
      />

      {/* Technology Stack Section */}
      <TechStack />

      {/* Experience Section */}
      <Experience />

      {/* Education Section */}
      <Education />

      {/* Projects Section */}
      <Projects />

      {/* Contact Section */}
      <Contact />

      <Footer />

      <ScrollToTop />
    </>
  );
}

export default App;
