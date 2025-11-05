import React, { useState } from 'react';
import api from '../api';

export default function AuthForm({ mode = 'login', onClose, onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const res = await api.post(`/auth/${mode}`, { username, password });
      // res.data should include { token, user }
      const auth = res.data;
      if (auth && auth.token) {
        localStorage.setItem('auth', JSON.stringify(auth));
        // set axios header is handled by api interceptor
        onAuthSuccess(auth);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.card} onClick={(e)=>e.stopPropagation()}>
        <h3>{mode === 'login' ? 'Login' : 'Register'}</h3>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input placeholder="Password" value={password} type="password" onChange={e=>setPassword(e.target.value)} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}</button>
            <button type="button" onClick={onClose} style={styles.cancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position: 'fixed', left:0, top:0, right:0, bottom:0, background: 'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center' },
  card: { background: '#fff', padding: 20, borderRadius: 8, minWidth: 320 },
  button: { background: '#1976d2', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6, cursor:'pointer' },
  cancel: { background: '#999', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6, cursor:'pointer' }
};
