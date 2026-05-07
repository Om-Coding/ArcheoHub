import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, Clock, Shield, AlertCircle, Search, Key, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async (pwd) => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/users', {
        headers: { 'X-Admin-Password': pwd || password }
      });
      setUsers(response.data);
      setIsAuthorized(true);
      setError('');
      // Save password in session storage for the session
      sessionStorage.setItem('admin_pwd', pwd || password);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users. Check password.');
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedPwd = sessionStorage.getItem('admin_pwd');
    if (savedPwd) {
      setPassword(savedPwd);
      fetchUsers(savedPwd);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Shield className="w-10 h-10 text-amber-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h1>
          <p className="text-slate-400 text-center mb-8">Enter the master password to view logs and user data.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Master Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <nav className="bg-[#1e293b] border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <Shield className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin <span className="text-amber-500">Hub</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0f172a] border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none w-64 transition-all"
            />
          </div>
          <button 
            onClick={() => {
              sessionStorage.removeItem('admin_pwd');
              setIsAuthorized(false);
            }}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Exit</span>
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">User Directory</h2>
          <p className="text-slate-400">Monitoring {users.length} registered users and their activity.</p>
        </header>

        <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1e293b] border-b border-slate-800">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#0f172a]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-amber-500 font-bold border border-slate-600">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover:text-amber-500 transition-colors">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                         user.role === 'admin' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 
                         user.role === 'archaeologist' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                         'bg-slate-500/10 border-slate-500/30 text-slate-400'
                       }`}>
                         {user.role}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${
                        user.approved ? 'text-emerald-400' : 'text-amber-400 bg-amber-400/10'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.approved ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {user.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="w-4 h-4" />
                        {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never logged in'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No users found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
