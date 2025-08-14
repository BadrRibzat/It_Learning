// src/components/Layout/Footer.tsx
const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#f0f0f0',
      padding: '1.5rem 2rem',
      borderTop: '1px solid #ddd',
      marginTop: 'auto',
      fontSize: '0.9rem',
      color: '#555',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        textAlign: 'center',
      }}>
        <div>
          <h3 style={{ color: '#6750a4', marginBottom: '0.5rem' }}>IT-Learning</h3>
          <p>Master CLI commands through interactive flashcards.</p>
        </div>
        <div>
          <h4 style={{ color: '#6750a4' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/">Home</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: '#6750a4' }}>Contact</h4>
          <p>Email: badrribzat@gmail.com</p>
          <p>© 2025 Badr Ribzat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
