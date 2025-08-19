// src/components/Home/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-element">💻</div>
            <div className="floating-element">🚀</div>
            <div className="floating-element">⚡</div>
            <div className="floating-element">🔧</div>
            <div className="floating-element">📊</div>
          </div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Master the <span className="gradient-text">Command Line</span>
            <br />Like a Pro
          </h1>
          <p className="hero-subtitle">
            Transform from tutorial follower to confident engineer. Learn the CLI commands that power real-world systems through interactive flashcards and hands-on practice.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">11</span>
              <span className="stat-label">Tech Stacks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Commands</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Languages</span>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/register" className="cta-button primary">
              Start Learning Free
              <span className="button-arrow">→</span>
            </Link>
            <Link to="/features" className="cta-button secondary">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Why CLI Matters */}
      <section className="why-cli-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why CLI Skills Are Non-Negotiable</h2>
            <p className="section-subtitle">
              In modern software development, the command line isn't optional — it's the foundation of everything you build.
            </p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🛠️</div>
              <h3>DevOps & Deployment</h3>
              <p>Deploy containers, scale services, debug pods — all with kubectl, docker, and shell scripts.</p>
              <div className="benefit-tags">
                <span className="tag">Docker</span>
                <span className="tag">Kubernetes</span>
                <span className="tag">CI/CD</span>
              </div>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💾</div>
              <h3>Data & Databases</h3>
              <p>Backup PostgreSQL, query MongoDB, flush Redis — without GUIs, using only CLI tools.</p>
              <div className="benefit-tags">
                <span className="tag">PostgreSQL</span>
                <span className="tag">MongoDB</span>
                <span className="tag">Redis</span>
              </div>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔧</div>
              <h3>System Administration</h3>
              <p>Monitor logs, manage processes, fix permissions — Linux CLI is your first responder.</p>
              <div className="benefit-tags">
                <span className="tag">Linux</span>
                <span className="tag">Bash</span>
                <span className="tag">Monitoring</span>
              </div>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">☁️</div>
              <h3>Cloud Engineering</h3>
              <p>Spin up VMs, manage buckets, configure networks — AWS, GCP, and Azure all start in the terminal.</p>
              <div className="benefit-tags">
                <span className="tag">AWS</span>
                <span className="tag">GCP</span>
                <span className="tag">Azure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Learn Like a Pro</h2>
            <p className="section-subtitle">
              Interactive flashcards that adapt to your learning style
            </p>
          </div>
          <div className="demo-flashcard">
            <div className="flashcard-demo">
              <div className="demo-front">
                <h4>Question</h4>
                <p>List all running pods in Kubernetes</p>
                <div className="demo-input-group">
                  <input 
                    type="text" 
                    placeholder="Type the command..."
                    className="demo-input"
                  />
                  <button className="demo-check-btn">Check</button>
                </div>
              </div>
              <div className="demo-back">
                <h4>Answer</h4>
                <code>kubectl get pods</code>
                <p className="demo-explanation">
                  This command displays all pods in the current namespace with their status, age, and restart count.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stacks */}
      <section className="tech-stacks-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Master Essential Technologies</h2>
            <p className="section-subtitle">
              From basics to advanced, cover the tools that power modern development
            </p>
          </div>
          <div className="tech-grid">
            <div className="tech-item">
              <span className="tech-icon">🐚</span>
              <span className="tech-name">Bash</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🐳</span>
              <span className="tech-name">Docker</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">📚</span>
              <span className="tech-name">Git</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">☸️</span>
              <span className="tech-name">Kubernetes</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">☁️</span>
              <span className="tech-name">Cloud</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🐧</span>
              <span className="tech-name">Linux</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🍃</span>
              <span className="tech-name">MongoDB</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">📦</span>
              <span className="tech-name">NPM</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🐘</span>
              <span className="tech-name">PostgreSQL</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🐍</span>
              <span className="tech-name">Python</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🔴</span>
              <span className="tech-name">Redis</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Level Up Your CLI Skills?</h2>
            <p>Join thousands of developers who've transformed their careers through command line mastery.</p>
            <Link to="/register" className="cta-button primary large">
              Start Your Journey
              <span className="button-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
