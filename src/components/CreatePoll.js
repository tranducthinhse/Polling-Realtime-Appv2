import React, { useState } from "react";
import api from "../api";
import "../styles/CreatePoll.css";

export default function CreatePoll({ onCreated }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleAddOption = () => setOptions([...options, ""]);

  const handleChangeOption = (index, value) => {
    const newOpts = [...options];
    newOpts[index] = value;
    setOptions(newOpts);
  };

  const createPoll = async () => {
    const validOpts = options.filter(o => o.trim() !== "");
    if (!question || validOpts.length < 2)
      return alert("Nhập ít nhất 2 lựa chọn!");
    await api.post("/polls", {
      question,
      options: validOpts.map(text => ({ text })),
    });
    setQuestion("");
    setOptions(["", ""]);
    onCreated();
  };

  return (
  <div className="create-card">
    <h2 className="create-title">🗳 Tạo cuộc thăm dò</h2>

    <input
      className="input-field"
      placeholder="Nhập câu hỏi..."
      value={question}
      onChange={e => setQuestion(e.target.value)}
    />

    {options.map((opt, i) => (
      <input
        key={i}
        className="input-field"
        placeholder={`Lựa chọn ${i + 1}`}
        value={opt}
        onChange={e => handleChangeOption(i, e.target.value)}
      />
    ))}

    <div className="button-group">
      <button className="btn add" onClick={handleAddOption}>+ Thêm lựa chọn</button>
      <button className="btn create" onClick={createPoll}>✅ Tạo poll</button>
    </div>
  </div>
);

}
