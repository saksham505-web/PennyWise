import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Zap,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import MrLlamaMascot from '../../components/MrLlamaMascot';

export default function AiCoachModule() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'llama',
      text: "Namaste! I am Mr. LLAMA, your friendly money helper. Ask me anything about UPI safety, saving, SIP, credit scores, or budgeting in India. You can also click any Quick Answer below or write: 'quiz me on UPI safety'!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCache: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [mascotMood, setMascotMood] = useState('relaxed');
  const [backendStatus, setBackendStatus] = useState('online');
  const [cachedItems, setCachedItems] = useState([]);
  const [showCachePanel, setShowCachePanel] = useState(true);

  const messagesEndRef = useRef(null);

  // Load quick answers from answers_cache.txt via backend
  useEffect(() => {
    fetch('/api/quick-answers')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.items && data.items.length > 0) {
          setCachedItems(data.items);
        }
      })
      .catch((err) => {
        console.log('Failed to fetch cached answers, using static fallback cache', err);
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle instant selection of a cached answer
  const handleSelectCachedAnswer = (item) => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: item.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCache: false
    };

    const replyMsg = {
      id: `reply-${Date.now()}`,
      sender: 'llama',
      text: item.answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCache: true
    };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setMascotMood('happy');

    // Also send behind the scenes to maintain backend session history
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: item.question,
        session_id: sessionId
      })
    }).catch(() => {});
  };

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    // Check if the query matches our cached answers for instant gratification
    const lowerText = text.toLowerCase().replace(/[?!.,]/g, '').trim();
    const matchedCache = cachedItems.find((item) => {
      const qClean = item.question.toLowerCase().replace(/[?!.,]/g, '').trim();
      return (
        qClean === lowerText ||
        (lowerText.length > 4 && qClean.includes(lowerText)) ||
        (qClean.length > 4 && lowerText.includes(qClean))
      );
    });

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCache: false
    };

    if (matchedCache) {
      const replyMessage = {
        id: `reply-${Date.now()}`,
        sender: 'llama',
        text: matchedCache.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCache: true
      };
      setMessages((prev) => [...prev, userMessage, replyMessage]);
      setInputText('');
      setMascotMood('happy');
      return;
    }

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setMascotMood('thinking');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || "I didn't receive a response. Please try asking again!";

      setBackendStatus('online');

      // Set mascot mood based on content
      if (text.toLowerCase().includes('quiz')) {
        setMascotMood('curious');
      } else if (replyText.toLowerCase().includes('great') || replyText.toLowerCase().includes('correct')) {
        setMascotMood('celebrating');
      } else {
        setMascotMood('happy');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'llama',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCache: replyText.includes('Staying safe on UPI is easy') || replyText.includes('benchmark market index')
        }
      ]);
    } catch (err) {
      console.warn('Backend /api/chat error, using intelligent offline fallback', err);
      setBackendStatus('offline');
      setMascotMood('encouraging');

      let fallbackText = "I'm having a little trouble connecting to my local server, but remember: Money grows when you balance Needs, Wants, and Savings consistently! Try asking again in a moment.";
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'llama',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCache: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'llama',
        text: 'Chat history cleared. What financial question would you like to explore next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCache: false
      }
    ]);
    setMascotMood('relaxed');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      
      {/* Header Banner */}
      <div className="bg-[#084850]/70 rounded-3xl p-6 sm:p-8 border border-[#087985]/50 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <MrLlamaMascot expression={mascotMood} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-[#F4F3E9] tracking-tight">
                Mr. LLAMA Financial Coach
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                Live AI Brain
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">
                <Zap className="w-3 h-3" />
                Cache Active
              </span>
            </div>
            <p className="text-xs text-[#D7ECE5]/70 mt-1 max-w-xl">
              Equipped with cached quick answers and comprehensive RBI/NCFE lesson notes. Ask in English, Hindi, or Hinglish!
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#D7ECE5]/70 hover:text-[#C5E86C] bg-[#063F46] border border-[#087985] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Answers Cache Quick-Access Toolbar */}
      {cachedItems.length > 0 && (
        <div className="bg-[#063F46]/60 p-4 rounded-2xl border border-[#087985]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5E86C] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FFD700]" />
              Integrated Answers Cache ({cachedItems.length} Instant Answers):
            </span>
            <button
              onClick={() => setShowCachePanel(!showCachePanel)}
              className="text-[11px] text-[#D7ECE5]/60 hover:text-[#C5E86C]"
            >
              {showCachePanel ? 'Hide Cache' : 'Show Cache'}
            </button>
          </div>

          {showCachePanel && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {cachedItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCachedAnswer(item)}
                  className="px-3.5 py-2 rounded-xl bg-[#084850]/70 hover:bg-[#087985] text-[#D7ECE5] hover:text-[#F4F3E9] text-xs font-semibold border border-[#087985]/40 hover:border-[#C5E86C]/50 whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 flex-shrink-0"
                >
                  <span className="text-[#FFD700] text-[10px]">⚡</span>
                  <span className="capitalize">{item.question}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat Conversation Card */}
      <div className="bg-[#084850]/50 rounded-3xl border border-[#087985]/40 shadow-xl overflow-hidden flex flex-col h-[520px]">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isLlama = msg.sender === 'llama';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start max-w-[85%] ${
                  isLlama ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                {isLlama ? (
                  <div className="w-8 h-8 rounded-full bg-[#063F46] border border-[#C5E86C]/40 p-0.5 flex-shrink-0">
                    <img src="/static/llama.png" alt="Mr. Llama" className="w-full h-full object-contain rounded-full" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#087985] text-[#C5E86C] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md relative ${
                    isLlama
                      ? 'bg-[#063F46] text-[#F4F3E9] border border-[#087985]/60'
                      : 'bg-[#087985] text-[#F4F3E9] border border-[#C5E86C]/30'
                  }`}
                >
                  {/* Badge if served directly from answers_cache.txt */}
                  {msg.isCache && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 text-[10px] font-bold mb-2">
                      <Zap className="w-2.5 h-2.5" />
                      <span>Instant Answers Cache</span>
                    </div>
                  )}

                  <div>{msg.text}</div>
                  
                  <div
                    className={`text-[9px] mt-1.5 font-medium flex items-center justify-between gap-2 ${
                      isLlama ? 'text-[#D7ECE5]/50' : 'text-[#D7ECE5]/70'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.isCache && <span className="text-[#FFD700]/70">0ms response</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[#D7ECE5]/70 mr-auto p-3 rounded-2xl bg-[#063F46] border border-[#087985]/40 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-[#084850] p-1 flex-shrink-0">
                <img src="/static/llama.png" alt="Mr. Llama thinking" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold">Mr. LLAMA is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#042c31] border-t border-[#087985]/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything or pick an instant quick answer above..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-[#063F46] border border-[#087985] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#F4F3E9] placeholder-[#D7ECE5]/40 focus:outline-none focus:border-[#C5E86C] transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className={`p-3 rounded-2xl transition-all shadow-md flex-shrink-0 ${
                inputText.trim() && !isLoading
                  ? 'bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] cursor-pointer'
                  : 'bg-[#084850] text-[#D7ECE5]/30 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
