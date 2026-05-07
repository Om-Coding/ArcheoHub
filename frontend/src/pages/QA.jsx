import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { MessageCircle, Send, Sparkles, Loader2, Info } from 'lucide-react';

export default function QA() {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerInputs, setAnswerInputs] = useState({});
  const [aiOverview, setAiOverview] = useState('');
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [isAskingAI, setIsAskingAI] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get('/api/questions');
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setIsAskingAI(true);
    try {
      const { data } = await api.post('/api/ai/ask', { question: newQuestion });
      setAiOverview(`✨ AI Private Answer: ${data.answer}`);
    } catch (err) {
      alert('Failed to get AI answer.');
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleQAOverview = async () => {
    setIsOverviewLoading(true);
    try {
      const { data } = await api.post('/api/ai/qa-overview', { questions });
      setAiOverview(data.overview);
    } catch (err) {
      setAiOverview('Failed to generate community overview.');
    } finally {
      setIsOverviewLoading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    
    const token = localStorage.getItem('token');
    try {
      await api.post('/api/questions', { question: newQuestion });
      setNewQuestion('');
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post question. Please try logging in again.');
    }
  };

  const handleAnswer = async (id) => {
    const answer = answerInputs[id];
    if (!answer?.trim()) return;
    const token = localStorage.getItem('token');
    try {
      await api.put(`/api/questions/${id}/answer`, { answer });
      setAnswerInputs({ ...answerInputs, [id]: '' });
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4 tracking-tight">Archaeology <span className="text-gradient">Q&A</span></h2>
        <p className="text-muted text-lg max-w-2xl mx-auto">Uncover the mysteries of history. Ask our verified archaeologists anything or get instant insights from our AI expert.</p>
      </div>

      {/* AI Overview Section */}
      <div className="glass-panel p-8 mb-10 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-amber-400" size={24}/> AI Insights Hub
          </h3>
          <button 
            onClick={handleQAOverview} 
            disabled={isOverviewLoading || questions.length === 0}
            className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isOverviewLoading ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
            {aiOverview ? 'Refresh Overview' : 'Generate Community Overview'}
          </button>
        </div>

        {aiOverview ? (
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-slate-200 leading-relaxed shadow-inner">
            <p className="text-lg italic font-medium text-amber-100 mb-2 flex items-center gap-2">
               <Info size={18}/> Summary Findings:
            </p>
            {aiOverview}
          </div>
        ) : (
          <div className="p-10 text-center rounded-2xl border-2 border-dashed border-slate-800/50">
            <Sparkles className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Click the button above to generate an AI overview of what everyone is asking today.</p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Ask Question Section */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 sticky top-24">
            <h3 className="text-xl mb-6 flex items-center gap-2 font-bold">
              <MessageCircle className="text-primary" size={22}/> Start a Discussion
            </h3>
            {user ? (
              <form onSubmit={handleAsk} className="space-y-4">
                <div>
                  <textarea 
                    className="input-field w-full min-h-[120px] resize-none" 
                    placeholder="E.g., What tools did ancient Egyptians use for masonry?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button type="submit" className="btn btn-primary w-full py-3 flex items-center justify-center gap-2">
                    <Send size={18} /> Post Community Question
                  </button>
                  <button 
                    type="button" 
                    onClick={handleAskAI} 
                    disabled={isAskingAI}
                    className="btn btn-outline w-full py-3 flex items-center justify-center gap-2" 
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  >
                    {isAskingAI ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18} />}
                    Get Private AI Answer
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 rounded-xl bg-slate-900/50 text-center border border-slate-800">
                <p className="text-slate-400 mb-4">You need to be part of the hub to ask questions.</p>
                <a href="/auth" className="btn btn-primary w-full">Sign In</a>
              </div>
            )}
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4">FAQ</h3>
            <div className="space-y-4">
              <details className="group">
                <summary className="font-semibold text-slate-300 cursor-pointer hover:text-primary transition-colors">Accessing Artifacts?</summary>
                <p className="text-sm text-muted mt-2 pl-2 border-l-2 border-slate-700">Request access via the Artifact Detail page.</p>
              </details>
              <details className="group">
                <summary className="font-semibold text-slate-300 cursor-pointer hover:text-primary transition-colors">Who can answer?</summary>
                <p className="text-sm text-muted mt-2 pl-2 border-l-2 border-slate-700">Only verified Archaeologists can provide official community answers.</p>
              </details>
            </div>
          </div>
        </div>

        {/* Community Questions List */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
             Recent Discussions <span className="bg-slate-800 text-slate-400 text-sm py-1 px-3 rounded-full">{questions.length}</span>
          </h3>
          
          <div className="grid gap-6">
            {questions.map((q) => (
              <div key={q.id} className="glass-panel p-8 hover:border-slate-700 transition-all shadow-lg hover:shadow-primary/5">
                <div className="flex items-start justify-between mb-4">
                   <h4 className="text-2xl font-bold text-white pr-4"> {q.question}</h4>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-6">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary font-bold">{q.asked_by?.charAt(0)}</div>
                   <span>Asked by <span className="text-slate-300">{q.asked_by}</span> • {new Date(q.created_at).toLocaleDateString()}</span>
                </div>
                
                {q.answer ? (
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 relative">
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-[#1e293b] border border-primary/30 rounded-full text-xs font-bold text-primary uppercase tracking-widest">Archaeologist Official Response</div>
                    <p className="text-slate-200 leading-relaxed pt-2">{q.answer}</p>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-slate-800">
                    <p className="text-slate-500 italic flex items-center gap-2">
                       <Clock size={16}/> Awaiting expert verification...
                    </p>
                    
                    {user?.role === 'archaeologist' && (
                      <div className="mt-6 flex flex-col gap-3">
                        <textarea 
                          className="input-field w-full min-h-[100px] resize-none" 
                          placeholder="Provide the historical context..."
                          value={answerInputs[q.id] || ''}
                          onChange={(e) => setAnswerInputs({ ...answerInputs, [q.id]: e.target.value })}
                        />
                        <button onClick={() => handleAnswer(q.id)} className="btn btn-primary self-end px-8">Publish Answer</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {questions.length === 0 && (
              <div className="p-20 text-center glass-panel">
                <MessageCircle size={48} className="mx-auto mb-4 text-slate-800" />
                <p className="text-xl text-slate-500">The historical archives are quiet. Be the first to ask!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Clock = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
