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
              {t('built_by')} <span className="gradient-text">{t('self_taught_dev')}</span>
              <br />{t('for_self_taught_devs')}
            </h1>
            <p className="hero-subtitle">
              {t('bridges_the_gap')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2 className="section-title">{t('our_mission')}</h2>
              <p className="large-text">
                <strong>IT-Learning</strong> {t('mission_statement_part1')}
              </p>
              <p>
                {t('cli_mastery_is_key')}
              </p>
              <div className="mission-stats">
                <div className="mission-stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">{t('real_commands')}</span>
                </div>
                <div className="mission-stat">
                  <span className="stat-number">11</span>
                  <span className="stat-label">{t('tech_stacks')}</span>
                </div>
                <div className="mission-stat">
                  <span className="stat-number">5</span>
                  <span className="stat-label">{t('languages')}</span>
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
                  <span className="terminal-title">{t('terminal')}</span>
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
          <h2 className="section-title">{t('the_tech_stack_you_need')}</h2>
          <p className="section-subtitle">
            {t('focus_real_systems')}
          </p>
          <div className="tech-categories">
            <div className="tech-category">
              <div className="category-header">
                <div className="category-icon">🛠️</div>
                <h3>{t('devops_infrastructure')}</h3>
              </div>
              <div className="tech-list">
                <div className="tech-item">
                  <span className="tech-emoji">🐳</span>
                  <div className="tech-info">
                    <strong>{t('docker')}</strong>
                    <span>{t('containerization_deployment')}</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">☸️</span>
                  <div className="tech-info">
                    <strong>{t('kubernetes')}</strong>
                    <span>{t('container_orchestration')}</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">☁️</span>
                  <div className="tech-info">
                    <strong>{t('cloud_cli')}</strong>
                    <span>{t('cloud_management')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tech-category">
              <div className="category-header">
                <div className="category-icon">💾</div>
                <h3>{t('databases_storage')}</h3>
              </div>
              <div className="tech-list">
                <div className="tech-item">
                  <span className="tech-emoji">🐘</span>
                  <div className="tech-info">
                    <strong>{t('postgresql')}</strong>
                    <span>{t('relational_db')}</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">🍃</span>
                  <div className="tech-info">
                    <strong>{t('mongodb')}</strong>
                    <span>{t('nosql_db')}</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">🔴</span>
                  <div className="tech-info">
                    <strong>{t('redis')}</strong>
                    <span>{t('caching_sessions')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tech-category">
              <div className="category-header">
                <div className="category-icon">🔧</div>
                <h3>{t('system_development')}</h3>
              </div>
              <div className="tech-list">
                <div className="tech-item">
                  <span className="tech-emoji">🐧</span>
                  <div className="tech-info">
                    <strong>{t('linux')}</strong>
                    <span>{t('system_admin')}</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">🐚</span>
                  <div className="tech-info">
                    <strong>{t('bash')}</strong>
                    <span>{t('shell_scripting')}</span>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-emoji">📚</span>
                  <div className="tech-info">
                    <strong>{t('git')}</strong>
                    <span>{t('version_control')}</span>
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
              <h2 className="section-title">{t('my_journey')}</h2>
              <p className="section-subtitle">
                {t('from_tutorials_to_production')}
              </p>
            </div>
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>{t('the_struggle')}</h3>
                  <p>
                    {t('im_badr_intro')} <strong>{t('badr')}</strong>, {t('self_taught_dev_from_morocco')}.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>{t('the_gap')}</h3>
                  <p>
                    {t('could_build_apps')} {t('but_froze_terminal')}.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>{t('the_solution')}</h3>
                  <p>
                    {t('built_it_learning')} {t('solve_my_own_problem')}.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>{t('the_mission')}</h3>
                  <p>
                    {t('this_isnt_just_an_app')}
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
          <h2 className="section-title">{t('full_stack_mern')}</h2>
          <p className="section-subtitle">
            {t('modern_web_practices')}
          </p>
          <div className="tech-showcase">
            <div className="showcase-item">
              <div className="showcase-icon">⚛️</div>
              <h3>{t('react_typescript')}</h3>
              <p>{t('frontend_desc')}</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">🟢</div>
              <h3>{t('node_express')}</h3>
              <p>{t('backend_desc')}</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">🍃</div>
              <h3>{t('mongodb_mongoose')}</h3>
              <p>{t('database_desc')}</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">🎨</div>
              <h3>{t('modern_ui_ux')}</h3>
              <p>{t('ui_ux_desc')}</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">🌍</div>
              <h3>{t('internationalization')}</h3>
              <p>{t('i18n_desc')}</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">🔐</div>
              <h3>{t('security_auth')}</h3>
              <p>{t('security_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
