import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Search, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/artifacts?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="glass-nav py-4 px-6">
        <div className="container flex items-center justify-between mx-auto" style={{ padding: 0 }}>
          
          <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 700 }}>
            <Compass size={28} />
            <span className="text-gradient">ArchaeoHub</span>
          </Link>

          {/* Mobile Toggle */}
          <button className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="nav-links">
            <Link to="/artifacts" className="nav-link">Artifact Explorer</Link>
            <Link to="/news" className="nav-link">News & Events</Link>
            <Link to="/qa" className="nav-link">Q&A</Link>
            <Link to="/kids" className="nav-link" style={{ color: 'var(--accent)' }}>Kids Zone 🦖</Link>

            
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search artifacts..." 
                className="input-field"
                style={{ padding: '8px 16px', paddingRight: '40px', width: '250px', borderRadius: '20px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <Search size={18} />
              </button>
            </form>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link to="/dashboard" className="btn btn-outline" style={{ padding: '6px 12px' }}>
                  <User size={16}/> {user.name}
                </Link>
                <button onClick={handleLogout} className="btn" style={{ fontSize: '0.85rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>Logout</button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-primary">Login / Sign Up</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search..." 
              className="input-field"
              style={{ width: '100%', borderRadius: '12px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </button>
          </form>

          <Link to="/artifacts" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Artifact Explorer</Link>
          <Link to="/news" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>News & Events</Link>
          <Link to="/qa" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Q&A</Link>
          <Link to="/kids" className="mobile-nav-link" style={{ color: 'var(--accent)' }} onClick={() => setIsMobileMenuOpen(false)}>Kids Zone 🦖</Link>

          {user ? (
            <div className="flex flex-col gap-4 mt-4">
              <Link to="/dashboard" className="btn btn-outline" style={{ width: '100%' }} onClick={() => setIsMobileMenuOpen(false)}>
                <User size={16}/> {user.name}
              </Link>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="btn" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>Logout</button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Login / Sign Up</Link>
          )}
        </div>
      </div>
    </>
  );
}
