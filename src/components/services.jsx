import React, { useRef, useState } from "react";
import { FiUpload, FiSend } from "react-icons/fi";
import "../styles/services.css";

export default function Services() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! Upload your legal document and ask any question about it." }
  ]);
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // Simulate assistant response (replace with real backend/AI call)
  const getAssistantResponse = async (userMessage) => {
    return `You asked: "${userMessage}". (This is a sample response. Integrate your backend for real answers.)`;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const assistantReply = await getAssistantResponse(input);
    setMessages((prev) => [...prev, { role: "assistant", content: assistantReply }]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // You can handle file upload to backend here
      setMessages((prev) => [
        ...prev,
        { role: "system", content: `📄 Uploaded: ${file.name}` }
      ]);
    }
  };

  return (
    <div className="chatgpt-ui">
      <div className="chat-header">
        <h2>Legal Document Q&A</h2>
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
          title="Upload Document"
        >
          <FiUpload /> {fileName ? fileName : "Upload Document"}
        </button>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.role}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form className="chat-input-bar" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Ask a question about your document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" className="send-btn" title="Send">
          <FiSend />
        </button>
      </form>
    </div>
  );
}