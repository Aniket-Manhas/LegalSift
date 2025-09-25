import React, { useRef, useState } from "react";
import { FiUpload, FiSend } from "react-icons/fi";
import "../styles/services.css";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth";

// Use CDN worker to fix Vite import issue
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function Services() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! Upload your legal document and ask any question about it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Extract text from PDF
  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text;
  };

  // Extract text from DOCX
  const extractDocxText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setMessages((prev) => [
      ...prev,
      { role: "system", content: `📄 Uploaded: ${selectedFile.name}` },
    ]);

    let text = "";
    if (selectedFile.type === "application/pdf") {
      text = await extractPdfText(selectedFile);
    } else if (
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      selectedFile.type === "application/msword"
    ) {
      text = await extractDocxText(selectedFile);
    } else {
      text = await selectedFile.text();
    }

    setFileText(text);
  };

  const getAssistantResponse = async (userMessage, uploadedText) => {
    if (!GEMINI_API_KEY) return "API key missing";

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Analyzing your document..." },
    ]);

    try {
      const prompt = uploadedText
        ? `Document Text:\n${uploadedText}\n\nUser Question: ${userMessage}`
        : userMessage;

      const contents = [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ];

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({ contents }),
        }
      );

      const data = await response.json();
      setLoading(false);

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini API.";

      return (
        <div>
          <p>
            <strong>Gemini AI Analysis:</strong>
          </p>
          <p>{aiText}</p>
        </div>
      );
    } catch (err) {
      setLoading(false);
      console.error(err);
      return "Failed to get response from Gemini API.";
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !fileText) return;

    const userMsg = { role: "user", content: input || `Uploaded: ${fileName}` };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const assistantReply = await getAssistantResponse(input, fileText);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: assistantReply },
    ]);
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

        {loading && (
          <div className="perplexity">
            <p>
              <strong>Analyzing your document</strong>
              <span className="dots"></span>
            </p>
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
