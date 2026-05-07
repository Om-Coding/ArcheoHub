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
    <nav className="glass-nav py-4 px-6">
      <div className="container flex items-center justify-between mx-auto" style={{ padding: 0 }}>
        
        <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 700 }}>
          <Compass size={28} />
          <span className="text-gradient">ArchaeoHub</span>
        </Link>

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
  );
}
