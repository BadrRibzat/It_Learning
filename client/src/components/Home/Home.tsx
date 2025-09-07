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
            {t('master_cli')} <span className="gradient-text">{t('command_line')}</span>
            <br />{t('like_a_pro')}
          </h1>
          <p className="hero-subtitle">
            {t('hero_subtitle')}
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">11</span>
              <span className="stat-label">{t('tech_stacks')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">{t('commands')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">{t('languages')}</span>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/register" className="cta-button primary">
              {t('start_learning')}
              <span className="button-arrow">→</span>
            </Link>
            <Link to="/features" className="cta-button secondary">
              {t('explore_features')}
            </Link>
          </div>
        </div>
      </section>

      {/* Why CLI Matters */}
      <section className="why-cli-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('why_cli_matters')}</h2>
            <p className="section-subtitle">
              {t('cli_foundation')}
            </p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🛠️</div>
              <h3>{t('devops')}</h3>
              <p>{t('devops_desc')}</p>
              <div className="benefit-tags">
                <span className="tag">Docker</span>
                <span className="tag">Kubernetes</span>
                <span className="tag">CI/CD</span>
              </div>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💾</div>
              <h3>{t('data_databases')}</h3>
              <p>{t('data_databases_desc')}</p>
              <div className="benefit-tags">
                <span className="tag">PostgreSQL</span>
                <span className="tag">MongoDB</span>
                <span className="tag">Redis</span>
              </div>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔧</div>
              <h3>{t('system_admin')}</h3>
              <p>{t('system_admin_desc')}</p>
              <div className="benefit-tags">
                <span className="tag">Linux</span>
                <span className="tag">Bash</span>
                <span className="tag">Monitoring</span>
              </div>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">☁️</div>
              <h3>{t('cloud_engineering')}</h3>
              <p>{t('cloud_engineering_desc')}</p>
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
            <h2 className="section-title">{t('learn_like_a_pro')}</h2>
            <p className="section-subtitle">
              {t('interactive_flashcards_desc')}
            </p>
          </div>
          <div className="demo-flashcard">
            <div className="flashcard-demo">
              <div className="demo-front">
                <h4>{t('question')}</h4>
                <p>{t('list_all_pods')}</p>
                <div className="demo-input-group">
                  <input 
                    type="text" 
                    placeholder={t('type_command_placeholder')}
                    className="demo-input"
                  />
                  <button className="demo-check-btn">{t('check')}</button>
                </div>
              </div>
              <div className="demo-back">
                <h4>{t('answer')}</h4>
                <code>kubectl get pods</code>
                <p className="demo-explanation">
                  {t('pods_explanation')}
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
            <h2 className="section-title">{t('tech_stacks')}</h2>
            <p className="section-subtitle">
              {t('cover_modern_tools')}
            </p>
          </div>
          <div className="tech-grid">
            <div className="tech-item">
              <span className="tech-icon">🐚</span>
              <span className="tech-name">{t('bash')}</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🐳</span>
              <span className="tech-name">{t('docker')}</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">📚</span>
              <span className="tech-name">{t('git')}</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">☸️</span>
              <span className="tech-name">{t('kubernetes')}</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">☁️</span>
              <span className="tech-name">{t('cloud')}</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🐧</span>
              <span className="tech-name">{t('linux')}</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🍃</span>
              <span className="tech-name">{t('mongodb')}</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">📦</span>
              <span className="tech-name">{t('npm')}</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🐘</span>
              <span className="tech-name">{t('postgresql')}</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🐍</span>
              <span className="tech-name">{t('python')}</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🔴</span>
              <span className="tech-name">{t('redis')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t('ready_to_level_up')}</h2>
            <p>{t('join_developers')}</p>
            <Link to="/register" className="cta-button primary large">
              {t('start_your_journey')}
              <span className="button-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
