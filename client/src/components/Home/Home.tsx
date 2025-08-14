// src/components/Home/Home.tsx
const Home = () => {
  return (
    <div className="home-container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <section className="hero">
        <h1 style={{
          fontSize: '3.5rem',
          margin: '0 0 1rem',
          color: '#2c3e50',
          fontWeight: 700,
        }}>
          Master CLI Commands
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: '#555',
          maxWidth: '700px',
          margin: '0 auto 2rem',
        }}>
          Learn Bash, Git, Docker, Kubernetes, and more through interactive flashcards and quizzes.
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
          Get Started Free
        </button>
      </section>

      {/* Example Flashcard */}
      <section style={{ marginTop: '4rem' }}>
        <h2>How It Works</h2>
        <div style={{
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '2rem',
          maxWidth: '600px',
          margin: '2rem auto',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}>
          <p><strong>Front:</strong> <em>"docker images"</em> – Shows existing Docker images</p>
          <p><strong>Back:</strong> "How do we check running Docker images?"</p>
          <input
            placeholder="Type the command..."
            style={{
              width: '100%',
              padding: '0.75rem',
              margin: '1rem 0',
              border: '1px solid #ddd',
              borderRadius: '6px',
            }}
          />
          <button style={{
            background: '#2ecc71',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
          }}>
            Check
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
