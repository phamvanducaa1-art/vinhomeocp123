import React from 'react';
import { Home, Search, FileText, BarChart3, BookOpen, Bot, Settings, Menu, X, Wallet } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAIChat: () => void;
}

export default function Navbar({ currentView, setCurrentView, onOpenAIChat }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'home', label: 'Trang Chủ', icon: Home },
    { id: 'listings', label: 'Danh Sách Căn Hộ', icon: Search },
    { id: 'post', label: 'Đăng Tin', icon: FileText },
    { id: 'blog', label: 'Tin Tức & Kinh Nghiệm', icon: BookOpen },
    { id: 'dashboard', label: 'Môi Giới Hub', icon: BarChart3 },
    { id: 'wallet', label: 'Ví Của Tôi', icon: Wallet },
    { id: 'admin', label: 'Quản Trị', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-cyan-950/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-cyan-400 to-amber-500 p-2 rounded-lg shadow-md shadow-cyan-500/20">
                <span className="font-extrabold text-white text-lg tracking-wider">VH</span>
              </div>
              <div>
                <span className="font-bold text-lg text-slate-100 tracking-tight">OceanPark</span>
                <span className="text-amber-500 font-bold ml-1 text-xs px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">HOMES</span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950 to-slate-950 text-cyan-400 border border-cyan-800/50 shadow-inner'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-cyan-500'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Glowing AI Assistant Button */}
            <button
              onClick={onOpenAIChat}
              id="nav-ai-chat-btn"
              className="flex items-center space-x-1.5 ml-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-505 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wider shadow-lg shadow-cyan-600/30 hover:shadow-cyan-400/40 transform hover:-translate-y-0.5 transition-all outline-none"
            >
              <Bot className="w-4 h-4 animate-bounce" />
              <span>TRỢ LÝ AI</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onOpenAIChat}
              className="bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-800/30 p-2 rounded-full"
            >
              <Bot className="w-5 h-5 animate-pulse" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-cyan-500 hover:bg-slate-800/80 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-cyan-950 px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-base font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800/80 border-l-4 border-cyan-500 text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-cyan-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3.5 pb-2 px-3 border-t border-slate-900">
            <button
              onClick={() => {
                onOpenAIChat();
                setIsOpen(false);
              }}
              className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-cyan-600 to-emerald-600 text-white py-3 px-4 rounded-xl text-sm font-semibold tracking-wide shadow-md"
            >
              <Bot className="w-5 h-5" />
              <span>TRỢ LÝ TƯ VẤN AI</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
