import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import { MapPin } from 'lucide-react';

export default function Artifacts() {
  const [artifacts, setArtifacts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  
  const query = new URLSearchParams(useLocation().search);
  const searchTerm = query.get('search') || '';

  useEffect(() => {
    fetchData();
  }, [searchTerm, filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artifactsRes, countriesRes] = await Promise.all([
        api.get('/api/artifacts', { 
          params: { search: searchTerm, country: filter }
        }),
        api.get('/api/countries')
      ]);
      setArtifacts(artifactsRes.data);
      setCountries(countriesRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl">Artifact Explorer</h2>
          {searchTerm && <p className="text-muted mt-2">Search results for "{searchTerm}"</p>}
        </div>
        
        <select 
          className="input-field" 
          style={{ width: '200px', backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Regions</option>
          {countries.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="loader">Loading artifacts...</div></div>
      ) : artifacts.length === 0 ? (
        <div className="glass-panel text-center py-12">
          <p className="text-muted text-xl mb-4">No artifacts found matching your criteria.</p>
          <button className="btn btn-outline" onClick={() => { setFilter(''); window.history.pushState({}, '', '/artifacts'); fetchData(); }}>Clear Filters</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artifacts.map(artifact => (
            <div key={artifact.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={artifact.image_url} alt={artifact.name} className="card-img" />
              <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl" style={{ fontWeight: 600 }}>{artifact.name}</h3>
                  <span className={`badge ${artifact.classification_level === 'public' ? 'badge-public' : 'badge-classified'}`}>
                    {artifact.classification_level}
                  </span>
                </div>
                <p className="text-muted mb-4 flex items-center gap-1" style={{ fontSize: '0.9rem' }}>
                  <MapPin size={16} /> {artifact.site}, {artifact.country_name}
                </p>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '20px', flex: 1 }}>
                  {artifact.description.substring(0, 100)}...
                </p>
                <Link to={`/artifacts/${artifact.id}`} className="btn btn-outline" style={{ width: '100%' }}>View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
