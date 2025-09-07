// src/components/Features/Features.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Features.css';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: "🃏",
      title: t('interactive_flashcards'),
      description: t('flashcards_desc'),
      highlights: [t('real_world_scenarios'), t('command_variations'), t('best_practices')]
    },
    {
      icon: "🎯",
      title: t('smart_validation'),
      description: t('validation_desc'),
      highlights: [t('flexible_input'), t('alias_recognition'), t('typo_tolerance')]
    },
    {
      icon: "📊",
      title: t('progress_tracking'),
      description: t('tracking_desc'),
      highlights: [t('visual_progress'), t('mastery_levels'), t('achievement_system')]
    },
    {
      icon: "🌍",
      title: t('multi_language'),
      description: t('multi_language_desc'),
      highlights: [t('five_languages'), t('rtl_support'), t('cultural_adaptation')]
    },
    {
      icon: "📱",
      title: t('mobile_first'),
      description: t('mobile_desc'),
      highlights: [t('touch_friendly'), t('offline_capable'), t('cross_platform')]
    },
    {
      icon: "⚡",
      title: t('spaced_repetition'),
      description: t('repetition_desc'),
      highlights: [t('memory_optimization'), t('adaptive_timing'), t('efficient_learning')]
    },
    {
      icon: "🔧",
      title: t('real_world_commands'),
      description: t('real_world_desc'),
      highlights: [t('production_ready'), t('industry_standard'), t('career_focused')]
    },
    {
      icon: "🎨",
      title: t('modern_ui'),
      description: t('modern_ui_desc'),
      highlights: [t('glassmorphism'), t('smooth_animations'), t('intuitive_design')]
    },
    {
      icon: "🔐",
      title: t('secure_private'),
      description: t('secure_desc'),
      highlights: [t('jwt_security'), t('email_verification'), t('data_protection')]
    }
  ];

  const techStacks = [
    { name: t('bash'), icon: "🐚", commands: 45 },
    { name: t('docker'), icon: "🐳", commands: 52 },
    { name: t('git'), icon: "📚", commands: 38 },
    { name: t('kubernetes'), icon: "☸️", commands: 67 },
    { name: t('linux'), icon: "🐧", commands: 73 },
    { name: t('mongodb'), icon: "🍃", commands: 41 },
    { name: t('postgresql'), icon: "🐘", commands: 49 },
    { name: t('python'), icon: "🐍", commands: 35 },
    { name: t('redis'), icon: "🔴", commands: 28 },
    { name: t('cloud'), icon: "☁️", commands: 56 },
    { name: t('npm'), icon: "📦", commands: 33 }
  ];

  return (
    <div className="features-container">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {t('why')} <span className="gradient-text">IT-Learning</span> {t('works')}
            </h1>
            <p className="hero-subtitle">
              {t('discover_features')}
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
            <h2 className="section-title">{t('comprehensive_coverage')}</h2>
            <p className="section-subtitle">
              {t('master_essential_tech')}
            </p>
          </div>
          <div className="tech-stats-grid">
            {techStacks.map((tech, index) => (
              <div key={index} className="tech-stat-card">
                <div className="tech-stat-icon">{tech.icon}</div>
                <div className="tech-stat-info">
                  <h4 className="tech-stat-name">{tech.name}</h4>
                  <span className="tech-stat-count">{tech.commands} {t('commands')}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="total-commands">
            <div className="total-number">500+</div>
            <div className="total-label">{t('total_commands_all_stacks')}</div>
          </div>
        </div>
      </section>

      {/* Learning Methodology */}
      <section className="methodology-section">
        <div className="container">
          <div className="methodology-content">
            <div className="methodology-text">
              <h2 className="section-title">{t('proven_methodology')}</h2>
              <p className="section-subtitle">
                {t('cognitive_science')}
              </p>
              <div className="methodology-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>{t('active_recall')}</h4>
                    <p>{t('active_recall_desc')}</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>{t('spaced_repetition_method')}</h4>
                    <p>{t('repetition_method_desc')}</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>{t('contextual_learning')}</h4>
                    <p>{t('contextual_learning_desc')}</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>{t('progressive_mastery')}</h4>
                    <p>{t('progressive_mastery_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="methodology-visual">
              <div className="learning-cycle">
                <div className="cycle-step active">
                  <span className="cycle-icon">🎯</span>
                  <span className="cycle-label">{t('practice')}</span>
                </div>
                <div className="cycle-step">
                  <span className="cycle-icon">🧠</span>
                  <span className="cycle-label">{t('remember')}</span>
                </div>
                <div className="cycle-step">
                  <span className="cycle-icon">📈</span>
                  <span className="cycle-label">{t('progress')}</span>
                </div>
                <div className="cycle-step">
                  <span className="cycle-icon">🚀</span>
                  <span className="cycle-label">{t('master')}</span>
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
            <h2>{t('transform_cli_skills')}</h2>
            <p>{t('join_developers_desc')}</p>
            <div className="cta-actions">
              <a href="/register" className="cta-button primary">
                {t('start_learning_free')}
                <span className="button-arrow">→</span>
              </a>
              <a href="/about" className="cta-button secondary">
                {t('learn_more')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
