import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectsOverview from './components/ProjectsOverview';
import ListingExplorer from './components/ListingExplorer';
import ListingDetail from './components/ListingDetail';
import PostPostingForm from './components/PostPostingForm';
import BrokerDashboard from './components/BrokerDashboard';
import BlogRoom from './components/BlogRoom';
import AdminConsole from './components/AdminConsole';
import WalletView from './components/WalletView';
import AIChatbotDialog from './components/AIChatbotDialog';
import { Compass, Bot } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = React.useState<string>('home');
  const [selectedListingId, setSelectedListingId] = React.useState<string>('');
  const [searchFilters, setSearchFilters] = React.useState<{
    project?: string;
    subdivision?: string;
    type?: string;
    price?: string;
    area?: string;
    bedrooms?: string;
  } | undefined>(undefined);
  const [isAIChatOpen, setIsAIChatOpen] = React.useState<boolean>(false);

  const handleHeroSearch = (filters: typeof searchFilters) => {
    setSearchFilters(filters);
    setCurrentView('listings');
  };

  const handleSelectProjectQuick = (projectName: string) => {
    setSearchFilters({ project: projectName });
    setCurrentView('listings');
  };

  const handleSelectListing = (id: string) => {
    setSelectedListingId(id);
    setCurrentView('detail');
  };

  const handlePostSuccess = (id: string) => {
    setSelectedListingId(id);
    setCurrentView('detail');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Sleek top navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          // If moving away from listings, reset filter state
          if (view !== 'listings') {
            setSearchFilters(undefined);
          }
          setCurrentView(view);
        }}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Main body screens routing */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <div className="space-y-4 animate-fade-in">
            {/* 1. Hero visual with search controllers */}
            <HeroSection
              onSearch={handleHeroSearch}
              setCurrentView={setCurrentView}
              onOpenAIChat={() => setIsAIChatOpen(true)}
            />

            {/* 2. City sectors statistics layout cards */}
            <ProjectsOverview onSelectProject={handleSelectProjectQuick} />

            {/* Why choose brand values strip */}
            <div className="border-t border-cyan-950/40 bg-slate-900/10 py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Tại Sao Nên Lựa Chọn OceanPark Homes?</h3>
                  <p className="text-slate-400 text-xs mt-1 max-w-lg mx-auto font-medium">Bảo chứng thương hiệu vững chắc cùng hệ sinh thái công nghệ bất động sản thông minh hàng đầu.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                  <div className="bg-slate-900 border border-cyan-950/60 p-5 rounded-xl space-y-2">
                    <span className="text-2xl">🤖</span>
                    <h4 className="text-white font-bold text-sm">Trí Tuệ Nhân Tạo Tích Hợp</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Sử dụng mô hình ngôn ngữ lớn để tư vấn khách hàng, tự soạn thảo tin rao chuẩn SEO và phân tích, định giá thị trường chính xác tức thì.</p>
                  </div>
                  <div className="bg-slate-900 border border-cyan-950/60 p-5 rounded-xl space-y-2">
                    <span className="text-2xl">⚡</span>
                    <h4 className="text-white font-bold text-sm">Giao Dịch Thần Tốc</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Hỗ trợ kết nối trực tiếp chủ nhà và đại sứ môi giới khu vực nhanh gọn trong 15 phút, giải quyết thủ tục sang tên đổi sổ trọn gói.</p>
                  </div>
                  <div className="bg-slate-900 border border-cyan-950/60 p-5 rounded-xl space-y-2">
                    <span className="text-2xl">🛡️</span>
                    <h4 className="text-white font-bold text-sm">Bảo Chứng Xác Minh</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Nguồn hàng thật 100%. Mọi căn rao đều qua rà soát kỹ thuật kỹ lưỡng, đo đạc thông tin thực tế, cam kết đúng giá bán niêm yết công khai.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'listings' && (
          <ListingExplorer
            initialSearchFilters={searchFilters}
            onSelectListing={handleSelectListing}
          />
        )}

        {currentView === 'detail' && (
          <ListingDetail
            listingId={selectedListingId}
            onBackToListing={() => setCurrentView('listings')}
            onOpenAIChat={() => setIsAIChatOpen(true)}
          />
        )}

        {currentView === 'post' && (
          <PostPostingForm onSuccess={handlePostSuccess} />
        )}

        {currentView === 'blog' && (
          <BlogRoom />
        )}

        {currentView === 'dashboard' && (
          <BrokerDashboard onSelectListing={handleSelectListing} />
        )}

        {currentView === 'wallet' && (
          <WalletView />
        )}

        {currentView === 'admin' && (
          <AdminConsole />
        )}
      </main>

      {/* Elegant minimalist footer */}
      <footer className="bg-slate-950 border-t border-cyan-950/50 py-10 text-center font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg font-bold text-white">OceanPark Homes Portal</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 font-bold border border-cyan-800 px-2 py-0.5 rounded tracking-wide uppercase">AI powered</span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
            Hệ thống quản lý thông tin nhà chung cư biệt thự Vinhomes Ocean Park 1, 2, 3 được bảo mật bằng công nghệ đám mây và xử lý trí tuệ nhân tạo Gemini-3.5-Flash.
          </p>
          <div className="text-[10px] text-slate-600">
            © 2026 OceanPark Homes. Mọi quyền được bảo vệ nghiêm ngặt. Phát triển bởi AI Studio.
          </div>
        </div>
      </footer>

      {/* Floating AI floating chat assistant dialog bubble */}
      <AIChatbotDialog isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      {/* Constant hovering chat shortcut widget tool */}
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-450 p-3 rounded-full text-slate-950 font-extrabold shadow-xl shadow-cyan-500/20 hover:shadow-cyan-400/40 transform hover:scale-105 transition-all outline-none"
        title="Trò chuyện với trợ lý AI"
      >
        <Bot className="w-6 h-6 text-slate-950" />
      </button>

    </div>
  );
}
