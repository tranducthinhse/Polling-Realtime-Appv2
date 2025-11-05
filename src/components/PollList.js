import React from "react";
import PollItem from "./PollItem";

export default function PollList({ polls, onVote, onLike, userId }) {
  return (
    <div className="poll-list" style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
      {polls.length === 0 ? (
        <p>Chưa có cuộc thăm dò nào.</p>
      ) : (
        polls.map(p => (
          <PollItem key={p._id} poll={p} onVote={onVote} onLike={onLike} userId={userId} />
        ))
      )}
    </div>
  );
}
