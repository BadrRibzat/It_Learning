// src/components/Home/Home.tsx
import React from 'react';
import logo from '../../assets/logo.png'; // Adjust path if needed

// src/components/Home/Home.tsx
const Home = () => {
  return (
    <div className="home-container" style={{ textAlign: 'center', padding: '3rem 1rem', lineHeight: 1.7 }}>
      {/* Hero Section */}
      <section className="hero">
        <h1 style={{
          fontSize: '3.5rem',
          margin: '0 0 1rem',
          color: '#2c3e50',
          fontWeight: 700,
        }}>
          Master the Command Line
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: '#555',
          maxWidth: '700px',
          margin: '0 auto 2rem',
        }}>
          For frontend devs, backend engineers, DevOps, and self-taught coders — this is how you gain real control over your systems.
        </p>
        <button
          onClick={() => (window.location.href = '/register')}
          style={{
            background: '#6750a4',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Start Learning Free
        </button>
      </section>

      {/* Why CLI Matters */}
      <section style={{ marginTop: '5rem', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#2c3e50' }}>Why CLI Skills Are Non-Negotiable</h2>
        <p>
          In modern software development, the command line is not optional — it’s the foundation.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          margin: '2rem 0',
        }}>
          <div style={cardStyle}>
            <h3>🛠️ DevOps & Deployment</h3>
            <p>Deploy containers, scale services, debug pods — all with <code>kubectl</code>, <code>docker</code>, and shell scripts.</p>
          </div>
          <div style={cardStyle}>
            <h3>💾 Data & Databases</h3>
            <p>Backup PostgreSQL, query MongoDB, flush Redis — without GUIs, using only CLI tools.</p>
          </div>
          <div style={cardStyle}>
            <h3>🔧 System Maintenance</h3>
            <p>Monitor logs, manage processes, fix permissions — Linux CLI is the first responder.</p>
          </div>
          <div style={cardStyle}>
            <h3>☁️ Cloud Engineering</h3>
            <p>Spin up VMs, manage buckets, configure networks — AWS, GCP, and Azure all start in the terminal.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ marginTop: '5rem' }}>
        <h2>Learn Like a Pro</h2>
        <div style={flashcardStyle}>
          <p><strong>Front:</strong> <em>"kubectl get pods"</em> – List all running pods</p>
          <p><strong>Back:</strong> "How do you check the status of your Kubernetes pods?"</p>
          <input
            placeholder="Type the command..."
            style={inputStyle}
          />
          <button style={checkButtonStyle}>Check</button>
        </div>
      </section>
    </div>
  );
};

// Reusable styles
const cardStyle = {
  background: '#f8f9fa',
  padding: '1.5rem',
  borderRadius: '10px',
  border: '1px solid #e9ecef',
};

const flashcardStyle = {
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '2rem',
  maxWidth: '600px',
  margin: '2rem auto',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  margin: '1rem 0',
  border: '1px solid #ddd',
  borderRadius: '6px',
};

const checkButtonStyle = {
  background: '#2ecc71',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
};

export default Home;
