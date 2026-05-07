import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', site: '', country_id: '1', classification_level: 'public', image_url: 'https://via.placeholder.com/400x300.png?text=Artifact' });

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const endpoint = user.role === 'archaeologist' ? '/api/requests/pending' : '/api/requests/my-requests';
      const { data } = await api.get(endpoint);
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/artifacts', formData);
      alert('Artifact uploaded successfully!');
      setFormData({ name: '', description: '', site: '', country_id: '1', classification_level: 'public', image_url: 'https://via.placeholder.com/400x300.png?text=Artifact' });
    } catch (err) {
      alert('Error uploading artifact');
    }
  };

  const handleRequestStatus = async (id, status) => {
    try {
      await api.put(`/api/requests/${id}/status`, { status });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl mb-8">Dashboard ({user.role})</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Role Specific */}
        {user.role === 'archaeologist' ? (
          <div className="glass-panel p-6" style={{ padding: '24px' }}>
            <h3 className="text-2xl mb-4">Upload Artifact</h3>
            <form onSubmit={handleUpload} className="grid gap-4">
              <input type="text" placeholder="Artifact Name" required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <textarea placeholder="Detailed Description" required className="input-field" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              <input type="text" placeholder="Site Location" required className="input-field" value={formData.site} onChange={e => setFormData({...formData, site: e.target.value})} />
              
              <div className="flex gap-4">
                <select className="input-field" value={formData.country_id} onChange={e => setFormData({...formData, country_id: e.target.value})} style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
                   {/* Hardcoding countries for simplicity instead of another fetch, based on SQL init */}
                   <option value="1">Egypt</option><option value="2">Greece</option><option value="3">Italy</option>
                   <option value="4">Peru</option><option value="5">Mexico</option><option value="6">China</option>
                   <option value="7">Iraq</option><option value="8">India</option>
                </select>
                <select className="input-field" value={formData.classification_level} onChange={e => setFormData({...formData, classification_level: e.target.value})} style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
                  <option value="public">Public</option>
                  <option value="classified">Classified</option>
                </select>
              </div>

              <input type="text" placeholder="Image URL" className="input-field" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
              <button type="submit" className="btn btn-primary mt-2">Publish Artifact</button>
            </form>
          </div>
        ) : (
          <div className="glass-panel p-6" style={{ padding: '24px' }}>
            <h3 className="text-2xl mb-4 text-gradient">Your Profile</h3>
            <p className="text-muted mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="text-muted mb-4"><strong>Email:</strong> {user.email}</p>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '16px', borderRadius: '8px' }}>
              <p style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>Public explorers can view public artifacts and request access to classified discoveries from archaeologists.</p>
            </div>
          </div>
        )}

        {/* Right Column: Requests Management */}
        <div className="glass-panel p-6" style={{ padding: '24px' }}>
          <h3 className="text-2xl mb-4">{user.role === 'archaeologist' ? 'Pending Access Requests' : 'My Requests'}</h3>
          
          {requests.length === 0 ? (
            <p className="text-muted">No requests found.</p>
          ) : (
            <div className="grid gap-4">
              {requests.map(req => (
                <div key={req.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <p className="font-semibold">{req.artifact_name}</p>
                  
                  {user.role === 'archaeologist' ? (
                    <>
                      <p className="text-muted text-sm my-2">Requested by: {req.user_name} ({req.user_email})</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleRequestStatus(req.id, 'approved')} className="btn" style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#22c55e', color: 'white' }}>Approve</button>
                        <button onClick={() => handleRequestStatus(req.id, 'rejected')} className="btn" style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#ef4444', color: 'white' }}>Reject</button>
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 text-sm">Status: <span className={`badge ${req.status === 'approved' ? 'badge-public' : 'badge-classified'}`}>{req.status}</span></p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
