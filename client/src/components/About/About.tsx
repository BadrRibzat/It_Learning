// src/components/About/About.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Built by a <span className="gradient-text">Self-Taught Developer</span>
              <br />For Self-Taught Developers
            </h1>
            <p className="hero-subtitle">
              A platform that bridges the gap between tutorial knowledge and real-world engineering confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2 className="section-title">Our Mission</h2>
              <p className="large-text">
                <strong>IT-Learning</strong> was created to solve a critical problem in developer education: the gap between knowing syntax and having the confidence to work with real systems.
              </p>
              <p>
                Too many developers learn frameworks and languages but freeze when faced with a terminal. We believe that <strong>CLI mastery is the key to confidence, employability, and autonomy</strong> in tech.
              </p>
              <div className="mission-stats">
                <div className="mission-stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Real Commands</span>
                </div>
                <div className="mission-stat">
                  <span className="stat-number">11</span>
                  <span className="stat-label">Tech Stacks</span>
                </div>
                <div className="mission-stat">
                  <span className="stat-number">5</span>
                  <span className="stat-label">Languages</span>
                </div>
              </div>
            </div>
            <div className="content-visual">
              <div className="terminal-demo">
                <div className="terminal-header">
                  <div className="terminal-buttons">
                    <span className="btn red"></span>
                    <span className="btn yellow"></span>
                    <span className="btn green"></span>
                  </div>
                  <span className="terminal-title">Terminal</span>
                </div>
                <div className="terminal-body">
                  <div className="terminal-line">
                    <span className="prompt">$</span>
                    <span className="command">kubectl get pods</span>
                  </div>
                  <div className="terminal-line">
                    <span className="output">NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;STATUS</span>
                  </div>
                  <div className="terminal-line">
                    <span className="output">web-app-7d4b8f&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running</span>
                  </div>
                  <div className="terminal-line">
                    <span className="output">database-5c9x2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running</span>
                  </div>
                  <div className="terminal-line">
                    <span className="prompt">$</span>
                    <span className="cursor">_</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-stack-section">
        <div className="container">
          <h2 className="section-title">The Tech Stack You Need</h2>
          <p className="section-subtitle">
            We focus on the tools that power real systems and drive career growth
          </p>
          <div className="tech-categories">
            <div className="tech-category">
              <div className="category-header">
                <div className="category-icon">🛠️</div>
                <h3>DevOps & Infrastructure</h3>
              </div>
              <div className="tech-list">
                <div className="tech-item">
                  <span className="tech-emoji">🐳</span>
                  <div className="tech-info">
                    <strong>Docker</strong>
                    <span>Containerization and deployment</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">☸️</span>
                  <div className="tech-info">
                    <strong>Kubernetes</strong>
                    <span>Container orchestration</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">☁️</span>
                  <div className="tech-info">
                    <strong>Cloud CLI</strong>
                    <span>AWS, GCP, Azure management</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tech-category">
              <div className="category-header">
                <div className="category-icon">💾</div>
                <h3>Databases & Storage</h3>
              </div>
              <div className="tech-list">
                <div className="tech-item">
                  <span className="tech-emoji">🐘</span>
                  <div className="tech-info">
                    <strong>PostgreSQL</strong>
                    <span>Relational database management</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">🍃</span>
                  <div className="tech-info">
                    <strong>MongoDB</strong>
                    <span>NoSQL database operations</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">🔴</span>
                  <div className="tech-info">
                    <strong>Redis</strong>
                    <span>Caching and session management</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tech-category">
              <div className="category-header">
                <div className="category-icon">🔧</div>
                <h3>System & Development</h3>
              </div>
              <div className="tech-list">
                <div className="tech-item">
                  <span className="tech-emoji">🐧</span>
                  <div className="tech-info">
                    <strong>Linux</strong>
                    <span>System administration</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">🐚</span>
                  <div className="tech-info">
                    <strong>Bash</strong>
                    <span>Shell scripting and automation</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">📚</span>
                  <div className="tech-info">
                    <strong>Git</strong>
                    <span>Version control mastery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Story Section */}
      <section className="developer-story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-header">
              <h2 className="section-title">My Journey as a Self-Taught Developer</h2>
              <p className="section-subtitle">
                From struggling with tutorials to building production systems
              </p>
            </div>
            
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>The Struggle</h3>
                  <p>
                    I'm <strong>Badr</strong>, a self-taught developer from Morocco. I started with no access to bootcamps, no mentorship, and limited resources. Every tutorial felt like a dead end when it came to real-world application.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>The Gap</h3>
                  <p>
                    I could build React apps and write Python scripts, but I froze when faced with deployment, server management, or debugging production issues. The command line was my biggest weakness.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>The Solution</h3>
                  <p>
                    I built <strong>IT-Learning</strong> to solve my own problem: retaining CLI commands and building real confidence with systems. This platform represents hundreds of hours of research, development, and testing.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>The Mission</h3>
                  <p>
                    This isn't just an app — it's proof that self-taught developers can compete globally. It's my contribution to the community that taught me everything I know.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="portfolio-section">
        <div className="container">
          <h2 className="section-title">Full-Stack MERN Development</h2>
          <p className="section-subtitle">
            This project showcases modern web development practices and technologies
          </p>
          
          <div className="tech-showcase">
            <div className="showcase-item">
              <div className="showcase-icon">⚛️</div>
              <h3>React & TypeScript</h3>
              <p>Modern frontend with type safety, hooks, and responsive design</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">🟢</div>
              <h3>Node.js & Express</h3>
              <p>RESTful API with authentication, validation, and error handling</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">🍃</div>
              <h3>MongoDB & Mongoose</h3>
              <p>NoSQL database with schema design and data relationships</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">🎨</div>
              <h3>Modern UI/UX</h3>
              <p>Glassmorphism design, animations, and mobile-first approach</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">🌍</div>
              <h3>Internationalization</h3>
              <p>Multi-language support with React i18next and RTL layouts</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">🔐</div>
              <h3>Security & Auth</h3>
              <p>JWT authentication, email verification, and secure practices</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
