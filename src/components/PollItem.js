// import React, { useState, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   LinkedinShareButton,
//   FacebookIcon,
//   TwitterIcon,
//   LinkedinIcon,
// } from "react-share";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function PollItem({ poll, onVote, onLike, userId }) {
//   const [pressed, setPressed] = useState({});
//   const chartRef = useRef(null);

//   const chartData = {
//     labels: poll.options.map((o) => o.text),
//     datasets: [
//       {
//         label: "Votes",
//         data: poll.options.map((o) => o.votes),
//         backgroundColor: ["#6EC1E4", "#FF9AA2", "#FFDAC1", "#B5EAD7", "#CBAACB"],
//         borderRadius: 6,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: { legend: { display: false } },
//     scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
//   };

//   // 🗳️ Xử lý bình chọn
//   const handleVote = async (pollId, optionIndex) => {
//     const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "[]");

//     if (votedPolls.includes(pollId)) {
//       toast.warning("⚠️ Bạn đã bình chọn cho cuộc thăm dò này rồi!");
//       return;
//     }

//     setPressed((prev) => ({ ...prev, ["vote-" + optionIndex]: true }));
//     setTimeout(() => setPressed((prev) => ({ ...prev, ["vote-" + optionIndex]: false })), 150);

//     try {
//       await onVote(pollId, optionIndex);
//       votedPolls.push(pollId);
//       localStorage.setItem("votedPolls", JSON.stringify(votedPolls));

//       toast.success("✅ Bình chọn thành công!", { theme: "colored" });
//     } catch (err) {
//       console.error("Vote error:", err);
//       toast.error("❌ Lỗi khi gửi bình chọn, vui lòng thử lại!", { theme: "colored" });
//     }
//   };

//   // ❤️ Xử lý Like
//   const handleLike = async (pollId) => {
//     try {
//       setPressed((prev) => ({ ...prev, like: true }));
//       await onLike(pollId);
//     } catch (error) {
//       console.error("Failed to like:", error);
//       toast.error("❌ Lỗi khi gửi lượt thích!");
//     } finally {
//       setTimeout(() => setPressed((prev) => ({ ...prev, like: false })), 150);
//     }
//   };

//   const userLiked = userId && poll.likedBy && poll.likedBy.includes(userId);
//   const shareUrl = `https://myapp.com/poll/${poll._id}`;
//   const shareTitle = `Kết quả thăm dò: ${poll.question}`;

//   // 🖼️ Tải PNG
//   const handleDownloadPNG = async () => {
//     if (!chartRef.current) return;
//     const canvas = await html2canvas(chartRef.current, { scale: 2, useCORS: true });
//     const link = document.createElement("a");
//     link.download = `${poll.question.replace(/\s+/g, "_")}_chart.png`;
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//     toast.info("📸 Đã tải ảnh PNG!", { theme: "light" });
//   };

//   // 📄 Tải PDF
//   const handleDownloadPDF = async () => {
//     const element = document.getElementById(`poll-${poll._id}`);
//     if (!element) return;

//     const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#fff" });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "cm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width * -2.2;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`ket_qua_tham_do_${poll._id}.pdf`);
//     toast.info("📄 Đã tải file PDF!", { theme: "light" });
//   };

//   // Determine if the current user already voted for this poll.
//   // We keep a local votedPolls for anonymous clients, but if userId is present
//   // (from auth or generated client id) prefer server's record `poll.votesBy`.
//   const localVoted = JSON.parse(localStorage.getItem("votedPolls") || "[]").includes(poll._id);
//   const serverVoted = userId && poll.votesBy && poll.votesBy.find(v => v.userId === String(userId));
//   const voted = !!(serverVoted || localVoted);

//   return (
//     <div id={`poll-${poll._id}`} style={styles.card}>
//       <h3 style={styles.question}>{poll.question}</h3>

//       <div style={styles.choices}>
//         {poll.options.map((o, i) => (
//           <button
//             key={i}
//             onClick={() => !voted && handleVote(poll._id, i)}
//             disabled={voted}
//             style={{
//               ...styles.choiceButton,
//               transform: pressed["vote-" + i] ? "scale(0.95)" : "scale(1)",
//               opacity: voted ? 0.5 : pressed["vote-" + i] ? 0.8 : 1,
//               cursor: voted ? "not-allowed" : "pointer",
//             }}
//           >
//             {o.text} <span style={styles.votes}>({o.votes})</span>
//           </button>
//         ))}
//       </div>

//       {voted && (
//         <p style={styles.votedNotice}>✅ Bạn đã bình chọn cho cuộc thăm dò này</p>
//       )}

//       <button
//         onClick={() => handleLike(poll._id)}
//         style={{
//           ...styles.likeButton,
//           transform: pressed.like ? "scale(0.9)" : "scale(1)",
//           opacity: pressed.like ? 0.8 : 1,
//           backgroundColor: userLiked ? "#e91e63" : styles.likeButton.backgroundColor,
//         }}
//       >
//         {userLiked ? "💖" : "❤️"} {poll.likes}
//       </button>

//       <div style={styles.chart} ref={chartRef}>
//         <Bar key={poll._id} data={chartData} options={chartOptions} />
//       </div>

//       <div style={styles.shareSection}>
//         <span style={{ fontWeight: 600, color: "#444" }}>Chia sẻ kết quả:</span>

//         <div style={styles.shareButtons}>
//           <FacebookShareButton url={shareUrl} quote={shareTitle}>
//             <FacebookIcon size={32} round />
//           </FacebookShareButton>

//           <TwitterShareButton url={shareUrl} title={shareTitle}>
//             <TwitterIcon size={32} round />
//           </TwitterShareButton>

//           <LinkedinShareButton url={shareUrl}>
//             <LinkedinIcon size={32} round />
//           </LinkedinShareButton>

//           <button
//             onClick={() => {
//               navigator.clipboard.writeText(shareUrl);
//               toast.info("🔗 Đã sao chép liên kết chia sẻ!", { theme: "colored" });
//             }}
//             style={styles.copyButton}
//           >
//             🔗 Sao chép link
//           </button>
//         </div>

//         <div style={styles.downloadButtons}>
//           <button onClick={handleDownloadPNG} style={styles.downloadButton}>
//             🖼️ Tải ảnh PNG
//           </button>
//           <button onClick={handleDownloadPDF} style={styles.downloadButton}>
//             📄 Tải file PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   card: {
//     maxWidth: 520,
//     margin: "20px auto",
//     padding: 20,
//     borderRadius: 16,
//     boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
//     backgroundColor: "#fff",
//     display: "flex",
//     flexDirection: "column",
//     gap: 16,
//   },
//   question: { fontSize: 20, fontWeight: 600, textAlign: "center", color: "#333" },
//   choices: { display: "flex", flexDirection: "column", gap: 12 },
//   choiceButton: {
//     padding: "12px 20px",
//     borderRadius: 12,
//     border: "none",
//     background: "linear-gradient(90deg, #36A2EB 0%, #4CAF50 100%)",
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: 500,
//     cursor: "pointer",
//     transition: "transform 0.15s, opacity 0.15s",
//   },
//   votes: { fontWeight: "bold", marginLeft: 8 },
//   votedNotice: {
//     color: "green",
//     textAlign: "center",
//     fontWeight: 600,
//     animation: "fadeIn 0.3s ease",
//   },
//   likeButton: {
//     alignSelf: "flex-end",
//     padding: "8px 16px",
//     borderRadius: 12,
//     border: "none",
//     backgroundColor: "#FF4081",
//     color: "#fff",
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "transform 0.15s, opacity 0.15s",
//   },
//   chart: { marginTop: 20 },
//   shareSection: {
//     marginTop: 16,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 10,
//     borderTop: "1px solid #eee",
//     paddingTop: 12,
//   },
//   shareButtons: {
//     display: "flex",
//     gap: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   copyButton: {
//     backgroundColor: "#2196F3",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "6px 12px",
//     fontWeight: 500,
//     cursor: "pointer",
//   },
//   downloadButtons: {
//     display: "flex",
//     gap: 10,
//     marginTop: 10,
//   },
//   downloadButton: {
//     backgroundColor: "#4CAF50",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "6px 12px",
//     fontWeight: 500,
//     cursor: "pointer",
//   },
// };








import React, { useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PollItem({ poll, onVote, onLike, userId }) {
  const [pressed, setPressed] = useState({});
  const chartRef = useRef(null);

  const chartData = {
    labels: poll.options.map((o) => o.text),
    datasets: [
      {
        label: "Votes",
        data: poll.options.map((o) => o.votes),
        backgroundColor: ["#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981"],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        borderWidth: 1
      }
    },
    scales: { 
      y: { 
        beginAtZero: true, 
        ticks: { stepSize: 1, color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    },
  };

  // 🗳️ Xử lý bình chọn
  const handleVote = async (pollId, optionIndex) => {
    const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "[]");

    if (votedPolls.includes(pollId)) {
      toast.warning("⚠️ Bạn đã bình chọn cho cuộc thăm dò này rồi!");
      return;
    }

    setPressed((prev) => ({ ...prev, ["vote-" + optionIndex]: true }));
    setTimeout(() => setPressed((prev) => ({ ...prev, ["vote-" + optionIndex]: false })), 150);

    try {
      await onVote(pollId, optionIndex);
      votedPolls.push(pollId);
      localStorage.setItem("votedPolls", JSON.stringify(votedPolls));

      toast.success("✅ Bình chọn thành công!", { theme: "colored" });
    } catch (err) {
      console.error("Vote error:", err);
      toast.error("❌ Lỗi khi gửi bình chọn, vui lòng thử lại!", { theme: "colored" });
    }
  };

  // ❤️ Xử lý Like
  const handleLike = async (pollId) => {
    try {
      setPressed((prev) => ({ ...prev, like: true }));
      await onLike(pollId);
    } catch (error) {
      console.error("Failed to like:", error);
      toast.error("❌ Lỗi khi gửi lượt thích!");
    } finally {
      setTimeout(() => setPressed((prev) => ({ ...prev, like: false })), 150);
    }
  };

  const userLiked = userId && poll.likedBy && poll.likedBy.includes(userId);
  const shareUrl = `https://myapp.com/poll/${poll._id}`;
  const shareTitle = `Kết quả thăm dò: ${poll.question}`;

  // 🖼️ Tải PNG
  const handleDownloadPNG = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { scale: 2, useCORS: true });
    const link = document.createElement("a");
    link.download = `${poll.question.replace(/\s+/g, "_")}_chart.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.info("📸 Đã tải ảnh PNG!", { theme: "light" });
  };

  // 📄 Tải PDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById(`poll-${poll._id}`);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#1e293b" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "cm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width * -2.2;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ket_qua_tham_do_${poll._id}.pdf`);
    toast.info("📄 Đã tải file PDF!", { theme: "light" });
  };

  const localVoted = JSON.parse(localStorage.getItem("votedPolls") || "[]").includes(poll._id);
  const serverVoted = userId && poll.votesBy && poll.votesBy.find(v => v.userId === String(userId));
  const voted = !!(serverVoted || localVoted);

  return (
    <div id={`poll-${poll._id}`} style={styles.card}>
      <h3 style={styles.question}>{poll.question}</h3>

      <div style={styles.choices}>
        {poll.options.map((o, i) => (
          <button
            key={i}
            onClick={() => !voted && handleVote(poll._id, i)}
            disabled={voted}
            style={{
              ...styles.choiceButton,
              transform: pressed["vote-" + i] ? "scale(0.95)" : "scale(1)",
              opacity: voted ? 0.4 : pressed["vote-" + i] ? 0.8 : 1,
              cursor: voted ? "not-allowed" : "pointer",
            }}
          >
            {o.text} <span style={styles.votes}>({o.votes})</span>
          </button>
        ))}
      </div>

      {voted && (
        <p style={styles.votedNotice}>✅ Bạn đã bình chọn cho cuộc thăm dò này</p>
      )}

      <button
        onClick={() => handleLike(poll._id)}
        style={{
          ...styles.likeButton,
          transform: pressed.like ? "scale(0.9)" : "scale(1)",
          opacity: pressed.like ? 0.8 : 1,
          background: userLiked ? "linear-gradient(135deg, #ec4899, #f43f5e)" : styles.likeButton.background,
        }}
      >
        {userLiked ? "💖" : "❤️"} {poll.likes}
      </button>

      <div style={styles.chart} ref={chartRef}>
        <Bar key={poll._id} data={chartData} options={chartOptions} />
      </div>

      <div style={styles.shareSection}>
        <span style={styles.shareTitle}>📤 Chia sẻ kết quả</span>

        <div style={styles.shareButtons}>
          <FacebookShareButton url={shareUrl} quote={shareTitle}>
            <FacebookIcon size={36} round />
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} title={shareTitle}>
            <TwitterIcon size={36} round />
          </TwitterShareButton>

          <LinkedinShareButton url={shareUrl}>
            <LinkedinIcon size={36} round />
          </LinkedinShareButton>

          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              toast.info("🔗 Đã sao chép liên kết chia sẻ!", { theme: "colored" });
            }}
            style={styles.copyButton}
          >
            🔗 Sao chép link
          </button>
        </div>

        <div style={styles.downloadButtons}>
          <button onClick={handleDownloadPNG} style={styles.downloadButton}>
            🖼️ Tải ảnh PNG
          </button>
          <button onClick={handleDownloadPDF} style={styles.downloadButtonPDF}>
            📄 Tải file PDF
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 650,
    margin: "28px auto",
    padding: 32,
    borderRadius: 24,
    background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 44, 88, 0.95))",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  question: { 
    fontSize: 28, 
    fontWeight: 800, 
    textAlign: "center",
    background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: "0 0 30px rgba(96, 165, 250, 0.4)",
    letterSpacing: "0.5px",
    filter: "drop-shadow(0 0 15px rgba(167, 139, 250, 0.5))",
    marginBottom: 8
  },
  choices: { 
    display: "flex", 
    flexDirection: "column", 
    gap: 14 
  },
  choiceButton: {
    padding: "16px 28px",
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    color: "#fff",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 0 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    position: "relative",
    overflow: "hidden"
  },
  votes: { 
    fontWeight: 800, 
    marginLeft: 10,
    background: "rgba(255, 255, 255, 0.2)",
    padding: "4px 12px",
    borderRadius: 12,
    fontSize: 15,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
  },
  votedNotice: {
    color: "#10b981",
    textAlign: "center",
    fontWeight: 700,
    fontSize: 16,
    padding: 14,
    background: "rgba(16, 185, 129, 0.15)",
    borderRadius: 14,
    border: "1px solid rgba(16, 185, 129, 0.4)",
    boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)",
    backdropFilter: "blur(10px)"
  },
  likeButton: {
    alignSelf: "flex-end",
    padding: "12px 24px",
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(244, 63, 94, 0.3))",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 0 20px rgba(236, 72, 153, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(236, 72, 153, 0.3)"
  },
  chart: { 
    marginTop: 28,
    padding: 24,
    background: "rgba(15, 23, 42, 0.6)",
    borderRadius: 18,
    boxShadow: "inset 0 2px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    backdropFilter: "blur(10px)"
  },
  shareSection: {
    marginTop: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    borderTop: "1px solid rgba(139, 92, 246, 0.3)",
    paddingTop: 24,
  },
  shareTitle: {
    fontWeight: 700,
    fontSize: 18,
    color: "#fff",
    textShadow: "0 0 15px rgba(167, 139, 250, 0.5)"
  },
  shareButtons: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  copyButton: {
    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "10px 20px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    transition: "all 0.2s ease"
  },
  downloadButtons: {
    display: "flex",
    gap: 14,
    marginTop: 10,
    flexWrap: "wrap",
    justifyContent: "center"
  },
  downloadButton: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "10px 20px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    transition: "all 0.2s ease"
  },
  downloadButtonPDF: {
    background: "linear-gradient(135deg, #f59e0b, #ea580c)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "10px 20px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    transition: "all 0.2s ease"
  }
};