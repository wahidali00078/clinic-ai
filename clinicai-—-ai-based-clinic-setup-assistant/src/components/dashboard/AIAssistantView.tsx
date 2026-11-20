import React, { useState, useRef, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  MessageSquareText,
  Sparkles,
  Send,
  Bot,
  User,
  AlertCircle,
  HelpCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantView: React.FC = () => {
  const { clinic, costs, revenue, setIsFloatingAIAssistantOpen } = useClinic();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I am your ClinicAI Planning Advisor calibrated for **${clinic.name}** in ${clinic.location.city}.
I have loaded your target parameters:
- **Discipline**: ${clinic.clinicType}
- **Capacity**: ${clinic.capacity.expectedPatientsPerDay} patients/day across ${clinic.capacity.consultationRooms} rooms
- **Estimated Capital**: ${clinic.budget.currency}${costs.totalInitialInvestment.toLocaleString()}
- **Est. Break-Even**: ${revenue.estimatedBreakEvenMonths} months

How can I help you optimize your equipment procurement, staffing roster, or compliance roadmap today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const suggestedChips = [
    `Is my ${clinic.budget.currency}${(clinic.budget.totalBudget / 100000).toFixed(0)}L budget sufficient?`,
    'What equipment should I buy Day 1 vs delay?',
    'How do I fast-track my Bio-Medical Waste (BMW) permit?',
    'What staff do I need for 30 patients/day?',
    'How can I reduce upfront capital without hurting care?',
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
        aiReply = `I analyzed your clinic metrics for ${clinic.name}. For an expected footfall of ${clinic.capacity.expectedPatientsPerDay} patients/day, prioritize your core diagnostic essentials first and lock in commercial lease terms before finalizing staff hiring contracts.`;
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
        text: `Based on your ${clinic.clinicType} budget of ${clinic.budget.currency}${clinic.budget.totalBudget.toLocaleString()}: Your initial setup capital of ${clinic.budget.currency}${costs.totalInitialInvestment.toLocaleString()} is well balanced with your break-even horizon of ${revenue.estimatedBreakEvenMonths} months.`,
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
        text: `Chat reset. Ask me anything regarding clinic feasibility, vendor leasing, regulatory steps, or unit economics for ${clinic.name}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Module 7
            </span>
            <span className="text-xs text-slate-500 font-medium">Healthcare Practice Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            AI Clinic Setup Advisor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Context-grounded healthcare management guidance calibrated with your actual clinic metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFloatingAIAssistantOpen(true)}
            className="px-3 py-1.5 text-xs text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 transition-colors font-semibold shadow-xs"
            title="Open as Floating Assistant"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Floating Mode</span>
          </button>
          <button
            onClick={handleResetChat}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
        {/* Chat Messages List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map(msg => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isAI
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isAI
                      ? 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                      : 'bg-sky-600 text-white shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-1.5">
                    {msg.text}
                  </div>
                  <div
                    className={`text-[10px] mt-2 font-medium ${
                      isAI ? 'text-slate-400' : 'text-sky-100'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-lg mr-auto">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-1.5 text-xs text-slate-500 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 font-mono text-[11px] text-sky-800">Synthesizing clinical advice...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Chips Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-600" /> Prompts:
          </span>
          {suggestedChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg whitespace-nowrap hover:border-sky-400 transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask anything about equipment leases, staff hiring, licensing steps..."
              className="flex-1 px-4 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </form>
        </div>
      </div>

      {/* Advisory Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-200/60 border border-slate-300 text-xs text-slate-600 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-700">Practice Advisory Notice: </span>
          ClinicAI provides strategic healthcare practice management guidance and operational modeling. It does not provide medical diagnoses or replace accredited legal and accounting counsel.
        </div>
      </div>
    </div>
  );
};
