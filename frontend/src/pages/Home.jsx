import { Link } from 'react-router-dom';
import { Compass, BookOpen, Shield, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section className="text-center py-8 md:py-12" style={{ background: 'linear-gradient(120deg, rgba(20, 45, 79, 0.85), rgba(8, 18, 34, 0.95))', borderRadius:'24px', padding:'40px 20px', marginBottom:'24px' }}>
        <h1 className="text-3xl md:text-4xl mb-4">Unearth the Past with <span className="text-gradient">ArchaeoHub</span></h1>
        <p className="text-muted text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ maxWidth: '700px' }}>
          Explore thousands of historical artifacts, ask questions, and jump into the shoes of an archaeologist. From the market stall to the hidden cave, this experience is drawn straight from your diagram.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link to="/artifacts" className="btn btn-primary"><Search size={18}/> Start Exploring</Link>
          <Link to="/kids" className="btn btn-outline" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent)', borderColor: 'var(--accent)' }}>
            Kids Zone 🦖
          </Link>
        </div>
      </section>

      <section className="diagram-panel">
        <h2 className="text-2xl md:text-3xl mb-4 text-center md:text-left">Adventure Diagram</h2>
        <p className="text-muted mb-6 text-center md:text-left">A colorful pathway from artifact shop to the cave entrance, with treasure waiting at each checkpoint.</p>
        <div className="diagram-row">
          <article className="diagram-card">
            <div className="diagram-icon">🏪</div>
            <div className="diagram-label">Market Stall</div>
            <p style={{ fontSize: '0.9rem' }}>Buy, sell, and prepare your tools. This is where your quest begins.</p>
          </article>
          <article className="diagram-card">
            <div className="diagram-icon">🧭</div>
            <div className="diagram-label">Trail to Cave</div>
            <p style={{ fontSize: '0.9rem' }}>Follow the path through ancient geography, with artifacts along the way.</p>
          </article>
          <article className="diagram-card">
            <div className="diagram-icon">🕯️</div>
            <div className="diagram-label">Cave Entrance</div>
            <p style={{ fontSize: '0.9rem' }}>Enter the dig site and uncover hidden relics in a glowing cavern.</p>
          </article>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="glass-panel p-6 text-center" style={{ padding: '30px 20px' }}>
          <div style={{ background: 'rgba(195, 155, 119, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
            <Compass size={32} />
          </div>
          <h3 className="text-2xl mb-2">Discover</h3>
          <p className="text-muted">Browse through a comprehensive catalog of artifacts from across the globe.</p>
        </div>
        
        <div className="glass-panel p-6 text-center" style={{ padding: '30px 20px' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent)' }}>
            <BookOpen size={32} />
          </div>
          <h3 className="text-2xl mb-2">Learn</h3>
          <p className="text-muted">Use AI summaries and audio features to learn history in a highly accessible way.</p>
        </div>
        
        <div className="glass-panel p-6 text-center" style={{ padding: '30px 20px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#ef4444' }}>
            <Shield size={32} />
          </div>
          <h3 className="text-2xl mb-2">Secure</h3>
          <p className="text-muted">Archaeologists can securely upload and manage classified discoveries on the platform.</p>
        </div>
      </section>
      
      <section className="mt-12 glass-panel p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))' }}>
        <h2 className="text-3xl mb-4 font-bold text-gradient">Latest News & Events</h2>
        <p className="text-muted mb-6">Stay updated with the latest discoveries, platform features, and worldwide archaeological events.</p>
        <Link to="/news" className="btn btn-outline" style={{ borderColor: 'var(--glass-border)' }}>
          Read the Latest
        </Link>
      </section>
    </div>
  );
}
