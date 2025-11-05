import React, { useEffect, useState } from "react";
import api, { socket } from "./api";
import CreatePoll from "./components/CreatePoll";
import PollList from "./components/PollList";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [polls, setPolls] = useState([]);
  const [userId, setUserId] = useState(null);
  const [auth, setAuth] = useState(null);
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const fetchPolls = async () => {
    const res = await api.get("/polls");
    setPolls(res.data);
  };

  useEffect(() => {
    let stored = localStorage.getItem("clientUserId");
    if (!stored) {
      stored = `u_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
      localStorage.setItem("clientUserId", stored);
    }
    // load auth from localStorage if present
    const raw = localStorage.getItem('auth');
    if (raw) {
      try { setAuth(JSON.parse(raw)); } catch(e) { /* ignore */ }
    }
    setUserId(stored);
    fetchPolls();

    socket.on("pollCreated", (newPoll) => {
      setPolls(currentPolls => [...currentPolls, newPoll]);
    });

    socket.on("pollUpdated", (updatedPoll) => {
      setPolls(currentPolls => 
        currentPolls.map(poll => 
          poll._id === updatedPoll._id ? updatedPoll : poll
        )
      );
    });

    return () => {
      socket.off("pollCreated");
      socket.off("pollUpdated");
    };
  }, []);

  const handleVote = async (id, optionIndex) => {
    try {
      // require auth for voting
      const currentAuth = auth || (localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null);
      if (!currentAuth || !currentAuth.token) {
        throw new Error('You must be logged in to vote');
      }
      await api.post(`/polls/${id}/vote`, { optionIndex });
    } catch (error) {
      console.error("Error voting:", error.response?.data?.error || error.message);
      throw error;
    }
  };

  const handleLike = async (id) => {
    // use authenticated userId if available, otherwise fallback to client userId
    const currentAuth = auth || (localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null);
    const uid = currentAuth?.user?.id || userId;
    if (!uid) return;
    try {
      await api.post(`/polls/${id}/like`, { userId: uid });
    } catch (error) {
      console.error("Error liking:", error.response?.data?.error || error.message);
      throw error;
    }
  };

  const handleAuthSuccess = (authData) => {
    setAuth(authData);
    // refetch polls to get votesBy/likedBy updated for this user
    fetchPolls();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
  };

  return (
    <div className="container">
      <Navbar auth={auth} onLogout={handleLogout} onAuthSuccess={handleAuthSuccess} />

      <div style={{ padding: 18 }}>
        <h1>🗳 Real-Time Polling App</h1>
        <div style={{ gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <CreatePoll onCreated={fetchPolls} />
          <button onClick={() => setShowLikedOnly((s) => !s)} style={{ marginTop: 12 }}>
            {showLikedOnly ? 'Hiện tất cả' : 'Hiện mục đã thích'}
          </button>
        </div>

        <PollList
          polls={showLikedOnly ? polls.filter((p) => p.likedBy && (auth?.user?.id || userId) && p.likedBy.includes(auth?.user?.id || userId)) : polls}
          onVote={handleVote}
          onLike={handleLike}
          userId={auth?.user?.id || userId}
        />
      </div>

      {/* Thêm container hiển thị toast */}
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </div>
  );
}
