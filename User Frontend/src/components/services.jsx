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
    // Simulate processing time (e.g., 3 seconds for document analysis)
    await new Promise(resolve => setTimeout(resolve, 3000));
  
    // Assuming you process the document and summarize it here
    const summary = `Based on the document you uploaded, it appears you are seeking guidance on [specific legal issue, e.g., "contract terms regarding termination clauses"]. I have analyzed the section(s) related to your concern and found the following key points:
    
    1. **Termination Clause**: The document outlines that either party can terminate the agreement with 30 days’ notice, but only under specific conditions such as breach or mutual agreement.
    
    2. **Dispute Resolution**: The document specifies that any disputes must be handled through arbitration rather than litigation.
    
    3. **Liabilities and Indemnities**: The clauses protect both parties from liability except in cases of gross negligence.
  
  If you need further clarification or additional sections reviewed, feel free to provide more details or ask specific questions. I’m here to help!`;
  
    return `Thank you for uploading your legal document. I have reviewed it thoroughly and here's a summary of the key points regarding your concern:\n\n${summary}`;
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