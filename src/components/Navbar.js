// import React, { useState } from 'react';
// import AuthForm from './AuthForm';

// export default function Navbar({ auth, onLogout, onAuthSuccess }) {
//   const [showAuth, setShowAuth] = useState(false);
//   const [mode, setMode] = useState('login');

//   const open = (m) => {
//     setMode(m);
//     setShowAuth(true);
//   };

//   return (
//     <div style={styles.nav}>
//       <div style={styles.brand}>🗳 Polling App</div>
//       <div style={styles.controls}>
//         {auth?.user ? (
//           <>
//             <span style={styles.user}>Hi, {auth.user.username}</span>
//             <button onClick={onLogout} style={styles.button}>Logout</button>
//           </>
//         ) : (
//           <>
//             <button onClick={() => open('login')} style={styles.button}>Login</button>
//             <button onClick={() => open('register')} style={styles.button}>Register</button>
//           </>
//         )}
//       </div>

//       {showAuth && (
//         <AuthForm mode={mode} onClose={() => setShowAuth(false)} onAuthSuccess={(authData) => { setShowAuth(false); onAuthSuccess(authData); }} />
//       )}
//     </div>
//   );
// }

// const styles = {
//   nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: '#222', color: '#fff' },
//   brand: { fontWeight: 700 },
//   controls: { display: 'flex', gap: 8, alignItems: 'center' },
//   button: { background: '#4CAF50', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' },
//   user: { marginRight: 8 }
// };




import React, { useState } from 'react';
import AuthForm from './AuthForm';

export default function Navbar({ auth, onLogout, onAuthSuccess }) {
  const [showAuth, setShowAuth] = useState(false);
  const [mode, setMode] = useState('login');

  const open = (m) => {
    setMode(m);
    setShowAuth(true);
  };

  return (
    <>
      <div style={styles.nav}>
        <div style={styles.brand}>🗳 Polling App</div>
        <div style={styles.controls}>
          {auth?.user ? (
            <>
              <span style={styles.user}>Hi, {auth.user.username}</span>
              <button onClick={onLogout} style={styles.button}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => open('login')} style={styles.button}>Login</button>
              <button onClick={() => open('register')} style={styles.buttonRegister}>Register</button>
            </>
          )}
        </div>
      </div>

      {showAuth && (
        <AuthForm 
          mode={mode} 
          onClose={() => setShowAuth(false)} 
          onAuthSuccess={(authData) => { 
            setShowAuth(false); 
            onAuthSuccess(authData); 
          }} 
        />
      )}
    </>
  );
}

const styles = {
  nav: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '16px 32px',
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95), rgba(15, 23, 42, 0.95))',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    color: '#fff',
    position: 'sticky',
    borderRadius: '36px',
    top: 0,
    zIndex: 1000
  },
  brand: { 
    fontWeight: 800,
    fontSize: '24px',
    background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 0 30px rgba(96, 165, 250, 0.5)',
    letterSpacing: '0.5px',
    filter: 'drop-shadow(0 0 10px rgba(167, 139, 250, 0.6))'
  },
  controls: { 
    display: 'flex', 
    gap: 12, 
    alignItems: 'center' 
  },
  button: { 
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: '#fff', 
    border: 'none',
    padding: '10px 24px',
    borderRadius: 12,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  buttonRegister: {
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: '#fff', 
    border: 'none',
    padding: '10px 24px',
    borderRadius: 12,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
    boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  user: { 
    marginRight: 8,
    padding: '8px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: 20,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    fontWeight: 600,
    fontSize: '14px',
    color: '#fff',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
  }
};