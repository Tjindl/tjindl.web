import Projects from './Projects'
import './App.css'
import img from "./img.jpeg";
import Connect from "./Connect.jsx"
import Navigation from "./Navigation.jsx"
import Skills from "./Skills.jsx"

function App() {
  return (
    <div className="App">
      <Navigation />
      
      <main className="main">
        <section className="hero">
          <h1 className="name">Tushar Jindal</h1>
          <p className="title-1">
            Passionate Full-Stack Developer crafting innovative web solutions 
            with modern technologies and clean, user-centered design.
          </p>
          
          <div className="image-container">
            <img src={img} alt="Tushar Jindal" />
          </div>
          
          <div className="about">
            <h3>
              I specialize in creating dynamic, responsive web applications using React, 
              Node.js, and modern development practices. With a focus on clean code and 
              exceptional user experience, I transform ideas into digital reality.
            </h3>
          </div>
        </section>

        <section className="projects-section">
          <div className="project-heading">
            <h1>Featured Projects</h1>
          </div>
          <Projects />
        </section>

        <section className="skills-section">
          <Skills />
        </section>

        <section className="connect-section">
          <div className="connect-container">
            <Connect />
          </div>
        </section>
      </main>
    </div>
  );
}
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'all 0.1s ease-out'
        }}
      />
      <ProgressBar />
      <Navigation />
      <div className='main'>
        <AnimatedSection className="fade-up section-spacing">
          <section id="about">
            <div className='image-container floating'>
              <img src={img} alt="Tushar Jindal" className="transform-3d"></img>
            </div>
            <div className='name pulse'>
              Tushar Jindal
            </div>
            <div className="title-1">
              BSc Mathematics @ The University of British Columbia
              <br />
              📍 Vancouver, BC
            </div>
            <div className="about glass hover-lift">
              <h3>
                Hi! I&apos;m Tushar, a Mathematics student at UBC with a passion for software development and data science. 
                I love solving complex problems and creating elegant solutions using code. 
                My journey combines mathematical precision with creative programming to build meaningful applications.
              </h3>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection className="fade-left section-spacing">
          <section id="skills">
            <Skills />
          </section>
        </AnimatedSection>

        <AnimatedSection className="fade-right section-spacing">
          <section id="projects">
            <div className='projects-container'>
              <div className='project-heading'>
                <h1 className="floating">🖥️ Projects</h1>
              </div>
            </div>
            <Projects/>
          </section>
        </AnimatedSection>

        <AnimatedSection className="fade-up section-spacing">
          <section id="connect">
            <div className="connect-container">
              <Connect />
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection className="scale">
          <div className="message-cont glass hover-lift">
            <h6 className='message'>Thank you for visiting. Made with ❤️ by Tushar Jindal</h6>
          </div>
        </AnimatedSection>
      </div>
      <ScrollToTop />
    </>
  )
}

export default App
