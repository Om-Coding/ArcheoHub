import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Sparkles, Volume2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function ArtifactDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [artifact, setArtifact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [requestStatus, setRequestStatus] = useState('');

  useEffect(() => {
    fetchArtifact();
  }, [id]);

  const fetchArtifact = async () => {
    try {
      const { data } = await api.get(`/api/artifacts/${id}`);
      setArtifact(data);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        // Mock error for direct link to classified
        setError('classified');
      } else {
        setError('not-found');
      }
    }
    setLoading(false);
  };

  const handleAISummary = async () => {
    if (aiSummary) return;
    setIsSummarizing(true);
    try {
      const { data } = await api.post('/api/ai/summary', {
        name: artifact.name,
        description: artifact.description,
        site: artifact.site,
        country: artifact.country_name
      });
      setAiSummary(`✨ AI Summary: ${data.text}`);
    } catch (err) {
      setAiSummary('Failed to generate AI summary.');
    }
    setIsSummarizing(false);
  };

  const handleTTS = () => {
    if ('speechSynthesis' in window) {
      const textToSpeak = aiSummary || artifact.description;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in this browser.");
    }
  };

  const requestAccess = async () => {
    if (!user) return alert("Please login first.");
    const token = localStorage.getItem('token');
    try {
      await api.post('/api/requests', { artifact_id: id });
      setRequestStatus('Request Submitted Successfully');
    } catch (err) {
      setRequestStatus(err.response?.data?.message || 'Error submitting request');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (error === 'classified') {
    return (
      <div className="text-center py-12 max-w-xl mx-auto glass-panel p-8">
        <ShieldAlert size={48} className="mx-auto mb-4 text-[#ef4444]" />
        <h2 className="text-3xl mb-4">Classified Artifact</h2>
        <p className="text-muted mb-6">This artifact requires archaeological clearance to view.</p>
        <div className="flex justify-center gap-4">
          <Link to="/artifacts" className="btn btn-outline">Go Back</Link>
          <button onClick={requestAccess} className="btn btn-primary">Request Access</button>
        </div>
        {requestStatus && <p className="mt-4 text-sm font-semibold">{requestStatus}</p>}
      </div>
    );
  }

  if (!artifact) return <div className="text-center py-12">Artifact not found.</div>;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <Link to="/artifacts" className="text-muted mb-6 inline-flex items-center gap-2 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Explorer
      </Link>
      
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <img src={artifact.image_url} alt={artifact.name} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl mb-2">{artifact.name}</h1>
              <p className="text-gradient font-medium text-lg">{artifact.site}, {artifact.country_name}</p>
            </div>
            <span className={`badge ${artifact.classification_level === 'public' ? 'badge-public' : 'badge-classified'} text-sm`}>
              {artifact.classification_level}
            </span>
          </div>

          <div className="flex gap-4 mb-8">
            <button onClick={handleAISummary} className="btn" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)' }} disabled={isSummarizing}>
              <Sparkles size={18} /> {isSummarizing ? 'Analyzing...' : 'AI Summary'}
            </button>
            <button onClick={handleTTS} className="btn btn-outline">
              <Volume2 size={18} /> Listen
            </button>
          </div>

          {aiSummary && (
            <div className="mb-8 p-4 rounded-lg" style={{ background: 'rgba(56, 189, 248, 0.05)', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ lineHeight: 1.6 }}>{aiSummary}</p>
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl mb-4">Historical Documentation</h3>
            <p style={{ lineHeight: 1.7, color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>{artifact.description}</p>
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            <p className="text-sm text-muted">Documented by Archeologist #{artifact.created_by} on {new Date(artifact.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
