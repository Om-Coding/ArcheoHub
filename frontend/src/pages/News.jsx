import { useState, useEffect } from 'react';
import api from '../api';
import { Calendar } from 'lucide-react';

export default function News() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [newsRes, eventsRes] = await Promise.all([
        api.get('/api/news'),
        api.get('/api/events')
      ]);
      setNews(newsRes.data);
      setEvents(eventsRes.data);
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <h2 className="text-4xl mb-8 text-center font-bold text-gradient">Data Hub Announcements & Events</h2>
      
      {loading ? (
        <div className="text-center text-muted py-12">Loading latest updates... (This may take a moment while our AI gathers the best stories)</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* News Column */}
          <div>
            <h3 className="text-3xl mb-6 font-bold text-slate-200" style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '8px' }}>Latest News</h3>
            {news.length === 0 ? <div className="text-muted py-4">No news items found.</div> : 
              <div className="grid gap-6">
                {news.map(item => (
                  <div key={item.id} className="glass-panel p-6 hover-scale" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div className="flex items-center gap-2 mb-2 text-muted text-sm font-semibold">
                      <Calendar size={16} />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl mb-3 font-bold">{item.title}</h3>
                    <p className="leading-relaxed text-slate-300 text-sm" style={{ whiteSpace: 'pre-wrap' }}>{item.content}</p>
                  </div>
                ))}
              </div>
            }
          </div>

          {/* Events Column */}
          <div>
            <h3 className="text-3xl mb-6 font-bold text-slate-200" style={{ borderBottom: '2px solid var(--accent)', paddingBottom: '8px' }}>Upcoming Events</h3>
            {events.length === 0 ? <div className="text-muted py-4">No event items found.</div> : 
              <div className="grid gap-6">
                {events.map(item => (
                  <div key={item.id} className="glass-panel p-6 hover-scale" style={{ borderLeft: '4px solid var(--accent)' }}>
                    <div className="flex items-center gap-2 mb-2 text-muted text-sm font-semibold">
                      <Calendar size={16} />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl mb-3 font-bold">{item.title}</h3>
                    <p className="leading-relaxed text-slate-300 text-sm" style={{ whiteSpace: 'pre-wrap' }}>{item.content}</p>
                  </div>
                ))}
              </div>
            }
          </div>

        </div>
      )}
    </div>
  );
}
