import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

// Your Google OAuth Client ID
const GOOGLE_CLIENT_ID = 'gemini-for-bb';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'public' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  // Load and initialise Google Identity Services
  useEffect(() => {
    const scriptId = 'google-gsi-script';
    if (document.getElementById(scriptId)) {
      initGoogle();
      return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
  }, []);

  const initGoogle = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });
    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 386,
        text: 'continue_with',
        shape: 'rectangular',
      });
    }
  };

  // Called by Google after the user picks their account
  const handleGoogleCredential = async ({ credential }) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/google', { credential });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await api.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        await api.post('/api/auth/register', formData);
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex justify-center py-8">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '32px' }}>
        <h2 className="text-3xl mb-6 text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

        {error && (
          <div style={{
            background: error.includes('successful') ? 'rgba(16,185,129,0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: error.includes('successful') ? '#6ee7b7' : '#fca5a5',
            padding: '12px', borderRadius: '8px', marginBottom: '20px',
            fontSize: '0.9rem', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* ── Google Sign-In Button ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div ref={googleBtnRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
          {loading && <p style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Signing in…</p>}
        </div>

        {/* ── Divider ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* ── Email / Password Form ── */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          {!isLogin && (
            <div>
              <label className="text-muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Full Name</label>
              <input
                type="text"
                className="input-field"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="text-muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Email Address</label>
            <input
              type="email"
              className="input-field"
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="text-muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Password</label>
            <input
              type="password"
              className="input-field"
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Account Type</label>
              <select
                className="input-field"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
              >
                <option value="public">Public Explorer</option>
                <option value="archaeologist">Archaeologist</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary mt-4" style={{ width: '100%', padding: '12px' }}>
            {loading ? 'Please wait…' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center mt-6 text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
