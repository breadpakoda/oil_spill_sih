import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { sendChatMessage } from '../services/api';

const defaultSuggestedQuestions = [
  "Where was the spill detected?",
  "What is the probable source region?",
  "Which vessels were near the source?",
  "Why was MV Ocean Star considered a candidate?",
  "What environmental conditions affected the spill?",
  "What is the forecast for the next 24 hours?",
  "Show me the evidence for this incident.",
  "Summarize this incident."
];

const ChatbotModal = () => {
  const {
    activeIncidentId,
    activeIncident,
    isChatOpen,
    setIsChatOpen,
    pendingChatQuery,
    setPendingChatQuery
  } = useIncident();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! I am the **Maritime Intelligence AI Assistant** for the **${activeIncident?.id || 'INC-2026-001'}** investigation.

You can ask me questions regarding SAR detection, Lagrangian hindcasting, candidate vessel kinematics, environmental vectors, or the 24-hour forward drift forecast.

*How can I assist your investigation?*`,
      isFallback: true,
      modelUsed: 'Demo Mode'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedChips, setSuggestedChips] = useState(defaultSuggestedQuestions.slice(0, 4));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle external queries triggered via other buttons (e.g. from incident/vessel cards)
  useEffect(() => {
    if (pendingChatQuery && isChatOpen) {
      handleSend(pendingChatQuery);
      setPendingChatQuery(null);
    }
  }, [pendingChatQuery, isChatOpen]);

  // Reset welcome message on incident change
  useEffect(() => {
    if (activeIncident) {
      setMessages([
        {
          id: `welcome-${activeIncident.id}`,
          sender: 'bot',
          text: `Active incident switched to **${activeIncident.id} (${activeIncident.title})**.
Detected at: **${activeIncident.coordinates?.lat}°N, ${activeIncident.coordinates?.lng}°E** on **${activeIncident.displayDate}**.

Ask me about source estimation, vessels of interest, or forward drift trajectory for this incident.`,
          isFallback: true,
          modelUsed: 'Demo Mode'
        }
      ]);
    }
  }, [activeIncidentId]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(textToSend, activeIncidentId);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        isFallback: response.isFallback,
        modelUsed: response.modelUsed
      };

      setMessages(prev => [...prev, botMsg]);
      if (response.suggestedQueries && response.suggestedQueries.length > 0) {
        setSuggestedChips(response.suggestedQueries);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: `⚠️ **Service Notice:** Unable to reach chat engine. Falling back to incident summary:
Detected at ${activeIncident?.coordinates?.lat}°N, ${activeIncident?.coordinates?.lng}°E with estimated area of ${activeIncident?.spillAreaKm2} km². Primary vessel candidate: ${activeIncident?.primaryCandidate}.`,
        isFallback: true,
        modelUsed: 'Offline Fallback'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-drawer no-print">
      {/* Floating Toggle Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="chat-toggle-btn"
          title="Open AI Intelligence Assistant"
        >
          <Bot size={26} />
        </button>
      )}

      {/* Chat Modal / Window */}
      {isChatOpen && (
        <div className="chat-modal">
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--border-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Oil Spill Intelligence AI
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-cyan)', fontFamily: 'var(--font-mono)' }}>
                  Active Context: {activeIncidentId}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-simulated" style={{ fontSize: '0.65rem' }}>
                AI Assistant
              </span>
              <button
                onClick={() => setIsChatOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.sender === 'user' ? 'chat-message-user' : 'chat-message-bot'}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', fontSize: '0.72rem', color: msg.sender === 'user' ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span style={{ fontWeight: 600 }}>
                    {msg.sender === 'user' ? 'Investigator' : (msg.isFallback ? 'AI Assistant — Demo Mode' : `AI (${msg.modelUsed || 'Groq'})`)}
                  </span>
                </div>

                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message chat-message-bot" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <RefreshCw size={14} className="text-cyan" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  Analyzing maritime incident telemetry...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Query Chips */}
          <div style={{ padding: '0.5rem 0.85rem', background: 'rgba(10, 19, 36, 0.7)', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
              SUGGESTED QUESTIONS:
            </div>
            <div className="chat-chips">
              {suggestedChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="chat-chip"
                  disabled={loading}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chat-footer"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${activeIncidentId}...`}
              className="chat-input"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn btn-sm btn-primary"
              style={{ padding: '0.5rem 0.85rem' }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotModal;
