// src/components/Features/Features.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Features.css';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: "🃏",
      title: "Interactive Flashcards",
      description: "Flip cards to learn commands with real-world explanations and use cases. Each card includes context, examples, and best practices.",
      highlights: ["Real-world scenarios", "Command variations", "Best practices"]
    },
    {
      icon: "🎯",
      title: "Smart Answer Validation",
      description: "Accepts command variations and aliases with intelligent regex matching. Learn the way you think, not just one rigid format.",
      highlights: ["Flexible input", "Alias recognition", "Typo tolerance"]
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Visual progress rings and mastery tracking show your journey from beginner to expert across all tech stacks.",
      highlights: ["Visual progress", "Mastery levels", "Achievement system"]
    },
    {
      icon: "🌍",
      title: "Multi-Language Support",
      description: "Learn in your preferred language with full internationalization support for Arabic, English, French, Spanish, and German.",
      highlights: ["5 languages", "RTL support", "Cultural adaptation"]
    },
    {
      icon: "📱",
      title: "Mobile-First Design",
      description: "Responsive design that works perfectly on all devices. Learn on your phone, tablet, or desktop with the same great experience.",
      highlights: ["Touch-friendly", "Offline capable", "Cross-platform"]
    },
    {
      icon: "⚡",
      title: "Spaced Repetition",
      description: "Intelligent algorithm shows you cards when you're about to forget them, maximizing retention and minimizing study time.",
      highlights: ["Memory optimization", "Adaptive timing", "Efficient learning"]
    },
    {
      icon: "🔧",
      title: "Real-World Commands",
      description: "Every command is used in production environments. No toy examples - only the CLI skills that matter in your career.",
      highlights: ["Production-ready", "Industry standard", "Career-focused"]
    },
    {
      icon: "🎨",
      title: "Modern UI/UX",
      description: "Beautiful glassmorphism design with smooth animations and intuitive interactions that make learning enjoyable.",
      highlights: ["Glassmorphism", "Smooth animations", "Intuitive design"]
    },
    {
      icon: "🔐",
      title: "Secure & Private",
      description: "Your learning data is protected with JWT authentication, email verification, and secure data handling practices.",
      highlights: ["JWT security", "Email verification", "Data protection"]
    }
  ];

  const techStacks = [
    { name: "Bash", icon: "🐚", commands: 45 },
    { name: "Docker", icon: "🐳", commands: 52 },
    { name: "Git", icon: "📚", commands: 38 },
    { name: "Kubernetes", icon: "☸️", commands: 67 },
    { name: "Linux", icon: "🐧", commands: 73 },
    { name: "MongoDB", icon: "🍃", commands: 41 },
    { name: "PostgreSQL", icon: "🐘", commands: 49 },
    { name: "Python", icon: "🐍", commands: 35 },
    { name: "Redis", icon: "🔴", commands: 28 },
    { name: "Cloud", icon: "☁️", commands: 56 },
    { name: "NPM", icon: "📦", commands: 33 }
  ];

  return (
    <div className="features-container">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Why <span className="gradient-text">IT-Learning</span> Works
            </h1>
            <p className="hero-subtitle">
              Discover the features that make command line mastery achievable, enjoyable, and effective for developers at every level.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-grid-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-highlights">
                  {feature.highlights.map((highlight, idx) => (
                    <span key={idx} className="highlight-tag">{highlight}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stacks Overview */}
      <section className="tech-overview-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Comprehensive Tech Coverage</h2>
            <p className="section-subtitle">
              Master the essential technologies that power modern development and operations
            </p>
          </div>
          <div className="tech-stats-grid">
            {techStacks.map((tech, index) => (
              <div key={index} className="tech-stat-card">
                <div className="tech-stat-icon">{tech.icon}</div>
                <div className="tech-stat-info">
                  <h4 className="tech-stat-name">{tech.name}</h4>
                  <span className="tech-stat-count">{tech.commands} commands</span>
                </div>
              </div>
            ))}
          </div>
          <div className="total-commands">
            <div className="total-number">500+</div>
            <div className="total-label">Total Commands Across All Stacks</div>
          </div>
        </div>
      </section>

      {/* Learning Methodology */}
      <section className="methodology-section">
        <div className="container">
          <div className="methodology-content">
            <div className="methodology-text">
              <h2 className="section-title">Proven Learning Methodology</h2>
              <p className="section-subtitle">
                Our approach combines cognitive science with practical application
              </p>
              <div className="methodology-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Active Recall</h4>
                    <p>Type commands from memory instead of passive reading</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Spaced Repetition</h4>
                    <p>Review commands at optimal intervals for long-term retention</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Contextual Learning</h4>
                    <p>Understand when and why to use each command in real scenarios</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Progressive Mastery</h4>
                    <p>Build from basic commands to advanced system administration</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="methodology-visual">
              <div className="learning-cycle">
                <div className="cycle-step active">
                  <span className="cycle-icon">🎯</span>
                  <span className="cycle-label">Practice</span>
                </div>
                <div className="cycle-step">
                  <span className="cycle-icon">🧠</span>
                  <span className="cycle-label">Remember</span>
                </div>
                <div className="cycle-step">
                  <span className="cycle-icon">📈</span>
                  <span className="cycle-label">Progress</span>
                </div>
                <div className="cycle-step">
                  <span className="cycle-icon">🚀</span>
                  <span className="cycle-label">Master</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="features-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your CLI Skills?</h2>
            <p>Join thousands of developers who've accelerated their careers through command line mastery.</p>
            <div className="cta-actions">
              <a href="/register" className="cta-button primary">
                Start Learning Free
                <span className="button-arrow">→</span>
              </a>
              <a href="/about" className="cta-button secondary">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
