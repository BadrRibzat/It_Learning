// src/components/About/About.tsx
const About = () => {
  return (
    <div className="about-page container" style={{ padding: '3rem 1rem', lineHeight: 1.7 }}>
      <section className="page-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>About IT-Learning</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '800px', margin: '1rem auto' }}>
          A platform built by a self-taught developer, for self-taught developers.
        </p>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2>Our Mission</h2>
        <p>
          <strong>IT-Learning</strong> was created to close the gap between tutorial knowledge and real-world engineering.
        </p>
        <p>
          Too many developers learn syntax but freeze when faced with a terminal. We believe that <strong>CLI mastery is the key to confidence, employability, and autonomy</strong> in tech.
        </p>

        <h2 style={{ marginTop: '2rem' }}>The Tech Stack You Need</h2>
        <p>
          We focus on the tools that power real systems:
        </p>
        <ul style={{ textAlign: 'left', margin: '1rem auto' }}>
          <li><strong>Bash & Linux:</strong> The foundation of every server and script.</li>
          <li><strong>Git:</strong> Version control is non-negotiable.</li>
          <li><strong>Docker & Kubernetes:</strong> The backbone of modern DevOps.</li>
          <li><strong>PostgreSQL, Redis, MongoDB:</strong> Databases you’ll manage daily.</li>
          <li><strong>Cloud CLI (AWS, GCP, Azure):</strong> Where infrastructure begins.</li>
          <li><strong>Python & NPM:</strong> Scripting and automation for developers.</li>
        </ul>

        <h2 style={{ marginTop: '2rem' }}>Built by a Self-Taught Developer</h2>
        <p>
          I’m <strong>Badr</strong>, a self-taught developer from Morocco. I built this platform because <strong>I struggled</strong> — no access to bootcamps, no mentorship, no money.
        </p>
        <p>
          I learned everything from free resources, late nights, and relentless practice. But one thing was missing: <strong>a way to retain CLI commands</strong>.
        </p>
        <p>
          So I built <strong>IT-Learning</strong> — not just to teach commands, but to <strong>empower developers like me</strong> to compete globally.
        </p>
        <p>
          This isn’t just an app. It’s a <strong>proof of what self-taught developers can achieve</strong> with focus, vision, and code.
        </p>
      </div>
    </div>
  );
};

export default About;
