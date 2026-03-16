import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ScanHelp.css';

export default function ScanHelp() {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hello! 👋 I'm your SehatSehul Health Assistant. You can ask me anything about your health, or upload a prescription and I'll help you understand it.",
      time: now()
    }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [typing, setTyping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const bottomRef = useRef();
  const fileRef = useRef();
  const inputRef = useRef();

  function now() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setFilePreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setFilePreview('pdf');
    }
  };

  const removeFile = () => { setFile(null); setFilePreview(null); };

  const getBotReply = (userMsg, hasFile) => {
    const msg = userMsg.toLowerCase();
    if (hasFile) return "I've received your prescription! 📋 I can see it's been uploaded successfully. Our team will review it shortly. In the meantime, could you tell me what specific medication or instruction you'd like me to explain?";
    if (msg.includes('fever') || msg.includes('temperature')) return "For fever, it's important to stay hydrated and rest. If temperature exceeds 103°F (39.4°C) or lasts more than 3 days, please consult a doctor. Would you like me to book a nurse visit for you? 🌡️";
    if (msg.includes('blood pressure') || msg.includes('bp')) return "High blood pressure can be serious. Normal BP is around 120/80 mmHg. Please avoid salty foods, exercise regularly, and take prescribed medications consistently. Would you like to book a home BP monitoring visit? 💊";
    if (msg.includes('sugar') || msg.includes('diabetes')) return "For diabetes management, monitor your blood sugar regularly, follow your diet plan, and take medications on time. Our nurses can visit you at home for blood glucose monitoring. Want to book a visit? 🩸";
    if (msg.includes('pain') || msg.includes('hurt')) return "I'm sorry to hear you're in pain. Could you tell me where the pain is and how severe it is (1-10)? This will help me suggest the right care for you. 🏥";
    if (msg.includes('nurse') || msg.includes('book')) return "I'd be happy to help you book a nurse! Please go to our Find Nurses page or I can guide you through the process. What type of care do you need? 👩‍⚕️";
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) return "Hello! 😊 How can I help you today? You can ask me health questions or upload your prescription for assistance.";
    if (msg.includes('prescription') || msg.includes('medicine') || msg.includes('tablet')) return "Please upload a photo of your prescription using the 📎 button below and I'll help you understand the medications, dosage, and instructions. 💊";
    if (msg.includes('covid') || msg.includes('corona')) return "For COVID-19 symptoms, please isolate and monitor your oxygen levels. If below 94%, seek immediate medical help. Our nurses can provide home care support. Stay safe! 😷";
    if (msg.includes('thank')) return "You're welcome! 😊 Stay healthy and don't hesitate to reach out anytime. SehatSehul is here for you 24/7! 🩺";
    return "Thank you for your message. For the best medical advice, I recommend consulting one of our certified nurses. Would you like to book a home visit? You can also upload your prescription for a detailed review. 🏥";
  };

  const send = async () => {
    const text = input.trim();
    if (!text && !file) return;

    const userMsg = {
      from: 'user',
      text: text || (file ? `Uploaded: ${file.name}` : ''),
      file: filePreview,
      fileName: file?.name,
      fileType: file?.type,
      time: now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const hadFile = !!file;
    removeFile();
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        from: 'bot',
        text: getBotReply(text, hadFile),
        time: now()
      }]);
    }, 1200 + Math.random() * 800);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const quickReplies = [
    'I have a fever 🌡️',
    'Explain my prescription 💊',
    'Book a nurse 👩‍⚕️',
    'High blood pressure ❤️',
    'I need help with diabetes 🩸',
  ];

  return (
    <div className="scan-page">
      {/* Hero */}
      <div className="scan-hero">
        <div className="container">
          <div className="scan-hero-inner">
            <div>
              <div className="scan-tag">🆓 Free Service</div>
              <h1>Scan Your Prescription<br/>& Get Instant Help</h1>
              <p>Upload your prescription or ask any health question. Our AI assistant is available 24/7 — completely free.</p>
              <div className="scan-features">
                <span>📋 Prescription Analysis</span>
                <span>💬 Live Health Chat</span>
                <span>🔒 100% Private</span>
              </div>
            </div>
            <div className="scan-hero-card">
              <div className="shc-item">📸<span>Take a photo of prescription</span></div>
              <div className="shc-item">📤<span>Upload PDF or image</span></div>
              <div className="shc-item">💬<span>Ask any health question</span></div>
              <div className="shc-item">✅<span>Get free instant guidance</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container scan-layout">
        {/* Upload Panel */}
        <div className="upload-panel">
          <div className="card">
            <h3>📋 Upload Prescription</h3>
            <p>Upload a photo or PDF of your prescription for analysis</p>

            <div
              className={`drop-zone ${dragging ? 'dragging' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />
              {filePreview ? (
                <div className="file-preview">
                  {filePreview === 'pdf' ? (
                    <div className="pdf-preview">
                      <div className="pdf-icon">📄</div>
                      <span>{file?.name}</span>
                    </div>
                  ) : (
                    <img src={filePreview} alt="prescription preview" />
                  )}
                  <button className="remove-file" onClick={e => { e.stopPropagation(); removeFile(); }}>✕</button>
                </div>
              ) : (
                <div className="drop-content">
                  <div className="drop-icon">📁</div>
                  <strong>Drop file here or click to browse</strong>
                  <span>Supports JPG, PNG, PDF</span>
                </div>
              )}
            </div>

            {filePreview && (
              <button className="btn btn-teal" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                onClick={send}>
                📤 Send Prescription
              </button>
            )}
          </div>

          {/* Tips */}
          <div className="card tips-card">
            <h3>📌 Tips for Best Results</h3>
            <ul>
              <li>📷 Ensure prescription is clearly visible</li>
              <li>💡 Good lighting for photos</li>
              <li>📄 Include doctor's name & date</li>
              <li>🔍 All text should be readable</li>
              <li>🔒 Your data is 100% private</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer-card">
            <strong>⚠️ Medical Disclaimer</strong>
            <p>This is an AI assistant for general guidance only. Always consult a qualified healthcare professional for medical advice.</p>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div>
              <strong>SehatSehul Health Assistant</strong>
              <div className="online-dot"><span/>Online — Available 24/7</div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg-row ${m.from}`}>
                {m.from === 'bot' && <div className="msg-avatar">🤖</div>}
                <div className="msg-bubble">
                  {m.file && (
                    <div className="msg-file">
                      {m.fileType?.startsWith('image/') ? (
                        <img src={m.file} alt="prescription"/>
                      ) : (
                        <div className="pdf-thumb">📄 {m.fileName}</div>
                      )}
                    </div>
                  )}
                  {m.text && <p>{m.text}</p>}
                  <span className="msg-time">{m.time}</span>
                </div>
                {m.from === 'user' && <div className="msg-avatar user-av">👤</div>}
              </div>
            ))}

            {typing && (
              <div className="msg-row bot">
                <div className="msg-avatar">🤖</div>
                <div className="msg-bubble typing-bubble">
                  <span/><span/><span/>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick replies */}
          <div className="quick-replies">
            {quickReplies.map((q, i) => (
              <button key={i} onClick={() => { setInput(q); inputRef.current?.focus(); }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input-wrap">
            {filePreview && (
              <div className="input-file-preview">
                {filePreview === 'pdf'
                  ? <span>📄 {file?.name}</span>
                  : <img src={filePreview} alt="attached"/>}
                <button onClick={removeFile}>✕</button>
              </div>
            )}
            <div className="chat-input-bar">
              <button className="attach-btn" onClick={() => fileRef.current.click()} title="Attach prescription">
                📎
              </button>
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Ask a health question or describe your symptoms…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
              />
              <button
                className={`send-btn ${(input.trim() || file) ? 'active' : ''}`}
                onClick={send}
                disabled={!input.trim() && !file}
              >
                ➤
              </button>
            </div>
            <p className="input-hint">Press Enter to send • Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  );
}