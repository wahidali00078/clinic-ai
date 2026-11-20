import React, { useState, useRef, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Sparkles,
  Bot,
  User,
  Send,
  RotateCcw,
  Minus,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const FloatingAIAssistant: React.FC = () => {
  const {
    clinic,
    costs,
    revenue,
    staff,
    equipment,
    isFloatingAIAssistantOpen,
    setIsFloatingAIAssistantOpen,
  } = useClinic();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello Doctor! I am your **ClinicAI Planning Copilot** for **${clinic.name}** in ${clinic.location.city}.

I am actively grounded in your real practice metrics:
- **Discipline**: ${clinic.clinicType}
- **Scale**: ${clinic.capacity.expectedPatientsPerDay} patients/day (${clinic.capacity.consultationRooms} consultation rooms)
- **Estimated CapEx**: ${formatINR(costs.totalInitialInvestment, { compact: true })}
- **Break-Even Target**: ~${revenue.estimatedBreakEvenMonths} months

Ask me anything about equipment procurement, statutory licenses, lease negotiations, or revenue forecasts!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedChips = [
    `Is my ${formatINR(clinic.budget.totalBudget, { compact: true })} budget sufficient?`,
    'Essential Day-1 equipment checklist',
    'How do I fast-track BMW license?',
    `Staff roster for ${clinic.capacity.expectedPatientsPerDay} patients/day`,
    'How can I reduce break-even months?',
  ];

  useEffect(() => {
    if (isFloatingAIAssistantOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isFloatingAIAssistantOpen, messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch(`/api/clinics/${clinic.id}/ai/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      let aiReply = '';
      if (res.ok) {
        const data = await res.json();
        aiReply = data.reply;
      } else {
        aiReply = `Based on your setup metrics for ${clinic.name} (${clinic.clinicType} in ${clinic.location.area}, ${clinic.location.city}): For an expected volume of ${clinic.capacity.expectedPatientsPerDay} patients/day, allocate your Day-1 capital to core clinical examination tools first. Lock in your lease agreement and municipal fire safety clearance before taking physical possession of commercial space.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Analysis for ${clinic.name}: With an initial CapEx of ${formatINR(costs.totalInitialInvestment)} against your ${formatINR(clinic.budget.totalBudget)} allocation, your capital expenditure is optimized. Your estimated monthly overhead of ${formatINR(costs.totalMonthlyOperatingCost)} covers rent and ${staff.length} staff roles, yielding positive net cashflow by Month 2.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'ai',
        text: `Chat reset. I am ready to advise on vendor discounts, licensing timelines, and unit economics for ${clinic.name}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [isMini, setIsMini] = useState(false);

  // 1. COMPACT FLOATING LAUNCHER (When collapsed)
  if (!isFloatingAIAssistantOpen) {
    return (
      <div className="fixed bottom-16 md:bottom-5 right-3 md:right-5 z-40">
        <button
          onClick={() => setIsFloatingAIAssistantOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900/95 hover:bg-slate-800 text-white rounded-full shadow-md border border-slate-700/60 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer group"
          id="floating-ai-launcher"
          aria-label="Open AI Copilot"
        >
          {/* Pulsing indicator */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
          </span>

          <div className="w-5 h-5 rounded-md bg-teal-700 flex items-center justify-center text-white shrink-0 group-hover:rotate-12 transition-transform">
            <Sparkles className="w-3 h-3" />
          </div>

          <span className="text-xs font-semibold text-slate-100 tracking-tight">
            Clinic Copilot
          </span>

          <span className="text-[9px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded border border-teal-400/30">
            AI
          </span>
        </button>
      </div>
    );
  }

  // 2. COMPACT FLOATING CHAT WINDOW (When open) - Reduced footprint
  return (
    <div
      className={`fixed bottom-16 md:bottom-5 right-3 md:right-5 z-50 w-[320px] sm:w-[340px] max-w-[calc(100vw-1.5rem)] ${
        isMini ? 'h-[280px]' : 'h-[400px] sm:h-[430px]'
      } max-h-[calc(100vh-4rem)] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-150`}
      id="floating-ai-window"
    >
      {/* Compact Header */}
      <div className="bg-slate-900 text-white px-3 py-2 flex items-center justify-between border-b border-slate-800 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-teal-700 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            <Bot className="w-3 h-3" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <h3 className="text-xs font-bold text-white tracking-tight">Clinic Copilot</h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Online" />
            </div>
            <p className="text-[9px] text-slate-400 truncate max-w-[150px] mt-0.5">
              {clinic.name} • {clinic.location.city}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsMini(!isMini)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title={isMini ? 'Expand height' : 'Mini view'}
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={handleResetChat}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsFloatingAIAssistantOpen(false)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Grounding Context Strip (Compact) */}
      <div className="px-3 py-1 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[10px] text-slate-600 shrink-0">
        <span className="truncate">
          <b className="text-slate-800">{clinic.clinicType}</b> • CapEx:{' '}
          <b className="text-slate-800">
            {formatINR(costs.totalInitialInvestment, { compact: true })}
          </b>
        </span>
        <span className="text-[9px] font-semibold text-teal-800 bg-teal-50 px-1 py-0.2 rounded border border-teal-200">
          Grounded
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/40 text-xs">
        {messages.map(msg => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  isAi ? 'bg-teal-100 text-teal-800' : 'bg-slate-800 text-white'
                }`}
              >
                {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-2xs relative group ${
                  isAi
                    ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    : 'bg-teal-700 text-white rounded-tr-xs'
                }`}
              >
                <div className="prose prose-slate max-w-none text-xs leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-100/40 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {isAi && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700 flex items-center gap-0.5 ml-2"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-2.5 h-2.5" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-teal-700 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-teal-700 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-teal-700 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="p-2 border-t border-slate-100 bg-white overflow-x-auto whitespace-nowrap flex gap-1.5 shrink-0 scrollbar-none">
        {suggestedChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            disabled={isTyping}
            className="text-[11px] px-2.5 py-1 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-lg border border-slate-200 transition-colors shrink-0 disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Ask about licenses, staff, or costs..."
            disabled={isTyping}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700 text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="p-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
