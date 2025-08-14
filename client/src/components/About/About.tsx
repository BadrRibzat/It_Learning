// src/components/About/About.tsx
const About = () => {
  return (
    <div className="about-page container" style={{ padding: '3rem 1rem' }}>
      <section className="page-header">
        <h1>About IT-Learning</h1>
      </section>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
          <strong>IT-Learning</strong> was created to help developers and IT professionals master CLI commands through an engaging, interactive, and structured learning experience.
        </p>
        <p>
          We believe that mastering the command line is essential for modern development, DevOps, and system administration. Our flashcard-based approach makes it easy to learn, review, and retain complex commands across technologies like:
        </p>
        <ul style={{ textAlign: 'left', margin: '1rem auto' }}>
          <li>Bash & Shell</li>
          <li>Git</li>
          <li>Docker & Kubernetes</li>
          <li>PostgreSQL, Redis, MongoDB</li>
          <li>Linux & Cloud CLI tools</li>
        </ul>
        <p>
          Each command is explained clearly, with real-world use cases and categorized flashcards so you can focus on what matters most.
        </p>
      </div>
    </div>
  );
};

export default About;
