import React, { useRef, useState } from "react";
import { FiUpload, FiSend } from "react-icons/fi";
import "../styles/services.css";

export default function Services() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! Upload your legal document and ask any question about it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Simulate assistant response with legal analysis
  const getAssistantResponse = async (userMessage) => {
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Analyzing your document..." },
    ]);

    // Fake delay for analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const legalReferences = [
      "According to Section 73 of the Indian Contract Act, 1872...",
      "As per IPC Section 415, fraud is defined as ...",
      "Referring to Section 7 of the Arbitration and Conciliation Act, 1996...",
    ];

    const riskScore = Math.floor(Math.random() * 10) + 1;

    const summary = (
      <div>
        <p>
          <strong>Summary of Key Points:</strong>
        </p>
        <ul>
          <li>
            <strong>Fraud Definition:</strong> As per IPC Section 415, fraud
            involves deceiving a person to cause wrongful gain or loss.
          </li>
          <li>
            <strong>Practical Meaning:</strong> If someone lies or misrepresents
            facts with the intention of gaining benefits, it falls under fraud.
          </li>
          <li>
            <strong>Implication:</strong> Such fraud can lead to both civil
            liability (compensation) and criminal liability (punishment).
          </li>
        </ul>

        {/* Risk Score Badge */}
        <div
          className={`risk-score ${
            riskScore <= 3
              ? "risk-low"
              : riskScore <= 6
              ? "risk-medium"
              : "risk-high"
          }`}
        >
          Risk Score: {riskScore}/10
        </div>

        {/* Legal Reference with Official Links */}
        <div className="legal-reference">
          <p>
            <strong>Reference:</strong> As per IPC Section 415, fraud is defined
            as an act of deceiving any person, by misrepresentation or
            concealment of fact, with intent to cause wrongful gain to one party
            or wrongful loss to another.
          </p>
          <p>
            📄 Official Legal Text / More Info:
            <a
              href="https://indiankanoon.org/doc/1306824/"
              target="_blank"
              rel="noreferrer"
            >
              Indian Kanoon — IPC Section 415
            </a>{" "}
            |
            <a
              href="https://www.indiacode.nic.in/repealedfileopen?rfilename=A1860-45.pdf"
              target="_blank"
              rel="noreferrer"
            >
              IndiaCode PDF
            </a>{" "}
            |
            <a
              href="https://devgan.in/ipc/section/415/"
              target="_blank"
              rel="noreferrer"
            >
              Devgan.in Explanation
            </a>
          </p>
        </div>

        {/* Explanation in Simple Words */}
        <div className="legal-reference">
          <p>
            <strong>In Simple Terms:</strong> If someone tricks another person
            by hiding or lying about facts to take advantage or cause harm, it
            counts as fraud.
          </p>
          <p>
            <strong>Example:</strong> Selling fake property papers knowing they
            are forged, and causing loss to the buyer.
          </p>
        </div>

        {/* Next Step Suggestions */}
        <div className="next-steps">
          <p>
            <strong>Next, you can ask:</strong>
          </p>
          <ul>
            <li>
              What are the punishments under IPC Section 420 (Cheating) related
              to fraud?
            </li>
            <li>Give me a real-world case study of fraud under Section 415.</li>
            <li>Does this change the Risk Score?</li>
            <li>Which other IPC sections connect with Section 415?</li>
          </ul>
        </div>
      </div>
    );

    setLoading(false);
    return summary;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const assistantReply = await getAssistantResponse(input);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: assistantReply },
    ]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setMessages((prev) => [
        ...prev,
        { role: "system", content: `📄 Uploaded: ${file.name}` },
      ]);
    }
  };

  return (
    <div className="chatgpt-ui">
      {/* Header */}
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

      {/* Chat Window */}
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            {typeof msg.content === "string" ? (
              <p>{msg.content}</p>
            ) : (
              msg.content
            )}
          </div>
        ))}

        {/* Perplexity-like loading state */}
        {loading && (
          <div className="perplexity">
            <p>
              <strong>Analyzing your document</strong>
              <span className="dots"></span>
            </p>
            <div className="legal-sources">
              <p>
                📖 Referencing{" "}
                <a
                  href="https://indiacode.nic.in/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Indian Contract Act, 1872
                </a>
              </p>
              <p>⚖️ Checking case law under Arbitration Act, 1996</p>
              <p>🔎 Cross-verifying IPC definitions of fraud</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form className="chat-input-bar" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Ask about your document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="send-btn">
          <FiSend />
        </button>
      </form>
    </div>
  );
}
