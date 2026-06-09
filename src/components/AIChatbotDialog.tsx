import React from 'react';
import { Bot, Send, X, MessageSquare, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AIChatbotDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChatbotDialog({ isOpen, onClose }: AIChatbotDialogProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Xin chào quý khách! Tôi là **Trợ lý AI Đại Sứ** thuộc OceanPark Homes.\n\nTôi sẵn sàng hỗ trợ quý khách tìm căn hộ hời nhất, tính toán các phương án tài chính vay ngân hàng Techcombank mua nhà, hoặc giải thích các hệ sinh thái tiện ích đẳng cấp nghỉ dưỡng quanh Vinhomes Ocean Park 1, 2, 3.\n\nQuý khách đang tìm kiếm mua căn hộ hay cần thuê nhà mướn ngay?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isSimulated, setIsSimulated] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    if (!textToSend) setInputValue('');

    const userMsg: Message = {
      id: `m-usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Call server Gemini Chat API
    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        chatHistory: messages.concat(userMsg).map(m => ({
          sender: m.sender,
          text: m.text
        }))
      })
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev, {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          text: data.text || 'Xin lỗi quý khách, hệ thống mạng gặp chút gián đoạn. Xin thử lại!',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsSimulated(!!data.isSimulated);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error in chatbot communication:', err);
        setMessages(prev => [...prev, {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          text: 'Xin chào quý khách, trợ lý AI đang dọn dẹp bộ nhớ cơ sở dữ liệu và bảo trì một chút. Bạn có thể gọi hotline để được tư vấn trực tiếp trong lúc chờ đợi!',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }]);
        setLoading(false);
      });
  };

  const handleQuickQuestion = (q: string) => {
    handleSendMessage(q);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm" id="ai-chatbot-modal">
      <div className="bg-slate-900 border border-cyan-500/20 w-full max-w-lg h-[600px] rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/10">
        
        {/* Header toolbar */}
        <div className="bg-slate-950 px-5 py-4 border-b border-cyan-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-400 border border-cyan-800/30 animate-pulse">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white text-sm font-extrabold tracking-tight">Trợ Lý AI Đại Sứ</h2>
              {/* Badge online status */}
              <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span>
                <span>Chuyên Viên Gemini 3.5 Sẵn Sàng</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice on running mode */}
        {isSimulated && (
          <div className="bg-amber-950/20 border-b border-amber-900/30 px-5 py-2 text-[10px] text-amber-500 font-medium flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span>AI Mode: Mô phỏng cục bộ do chưa gắn API Key. Gắn Key trong Cài đặt để chạy Gemini thực.</span>
          </div>
        )}

        {/* Message logs scrolling list */}
        <div className="flex-1 overflow-y-auto px-5 py-6 bg-slate-900/60 space-y-4" ref={scrollRef}>
          {messages.map((m) => {
            const isAI = m.sender === 'ai';
            return (
              <div key={m.id} className={`flex items-start ${isAI ? 'justify-start' : 'justify-end'} gap-2.5 max-w-full`}>
                {isAI && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-xs flex-shrink-0 font-extrabold mt-0.5">
                    🤖
                  </div>
                )}
                <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[82%] whitespace-pre-line leading-5 ${
                  isAI
                    ? 'bg-slate-950 border border-cyan-950 text-slate-200 rounded-tl-sm font-medium'
                    : 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-slate-950 font-extrabold rounded-tr-sm shadow-md'
                  }`}
                >
                  {m.text}
                  <span className={`block text-[9px] mt-2 text-right ${
                    isAI ? 'text-slate-500' : 'text-slate-900/70'
                  }`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing/loading loader animation */}
          {loading && (
            <div className="flex items-start gap-2.5 animate-pulse">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-xs flex-shrink-0">
                🤖
              </div>
              <div className="bg-slate-950 border border-cyan-950 text-slate-400 p-3 rounded-2xl rounded-tl-sm text-xs flex items-center space-x-1 font-semibold">
                <span>Trợ lý Đại sứ đang truy xuất dữ liệu quỹ căn</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions chips row */}
        {messages.length === 1 && (
          <div className="px-5 py-2.5 bg-slate-950/40 border-t border-cyan-950/60 overflow-x-auto flex space-x-2 scrollbar-none">
            {[
              'Tìm thuê Studio 6 triệu',
              'Căn 2PN Ocean Park quý giá hời',
              'Đặt mua biệt thự Ocean Park 2',
              'Hỏi đáp pháp lý sổ đỏ Vinhomes'
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleQuickQuestion(q)}
                className="bg-slate-950 hover:bg-cyan-950/30 border border-cyan-950 text-cyan-400 text-[10px] font-bold py-1.5 px-3 rounded-full whitespace-nowrap tracking-wide leading-none transition"
              >
                💡 {q}
              </button>
            ))}
          </div>
        )}

        {/* Input input bar */}
        <div className="p-4 bg-slate-950 border-t border-cyan-950 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Nói gì đó về nhu cầu căn hộ của bạn..."
            className="flex-1 bg-slate-900 border border-cyan-950 text-slate-200 text-xs rounded-xl px-3.5 py-3 outline-none focus:border-cyan-500 placeholder-slate-600 font-semibold"
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 text-slate-950 font-bold p-3 rounded-xl transition shadow-lg shadow-amber-500/10 flex items-center justify-center outline-none"
          >
            <Send className="w-4 h-4 text-slate-950 stroke-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
