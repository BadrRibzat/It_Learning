// src/components/Features/Features.tsx
const Features = () => {
  const features = [
    {
      title: "Interactive Flashcards",
      desc: "Flip cards to learn commands with explanations and real questions."
    },
    {
      title: "Real-Time Validation",
      desc: "Instant feedback on your answers — learn faster with immediate correction."
    },
    {
      title: "Progress Tracking",
      desc: "Visual progress bars and checklists show your mastery per category."
    },
    {
      title: "Review Failed Cards",
      desc: "Save incorrect answers and review them later — no need to restart."
    },
    {
      title: "Multi-Language UI",
      desc: "Learn in Arabic, French, Spanish, German, or English (commands in English)."
    }
  ];

  return (
    <div className="features-page container" style={{ padding: '3rem 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Platform Features</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
      }}>
        {features.map((f, i) => (
          <div key={i} className="card" style={{
            padding: '1.5rem',
            textAlign: 'center',
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
