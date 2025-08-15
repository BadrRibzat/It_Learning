// src/components/Features/Features.tsx
const Features = () => {
  const features = [
    {
      title: "Interactive Flashcards",
      desc: "Flip cards to learn commands with real-world explanations and use cases."
    },
    {
      title: "Smart Answer Validation",
      desc: "Accepts variations (e.g., 'ls -l' or 'ls') with regex and normalization."
    },
    {
      title: "Progress Rings & Mastery Tracking",
      desc: "Visual indicators show your progress per tech stack — from beginner to expert."
    },
    {
      // ... rest unchanged
    }
  ];

  return (
    <div className="features-page container" style={{ padding: '3rem 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why This Works</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
      }}>
        {features.map((f, i) => (
          <div key={i} className="card" style={{
            padding: '1.5rem',
            textAlign: 'center',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
