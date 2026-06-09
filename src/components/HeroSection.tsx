import React from 'react';
import { Search, Building, Sparkles, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (filters: {
    project?: string;
    subdivision?: string;
    type?: string;
    price?: string;
    area?: string;
    bedrooms?: string;
  }) => void;
  setCurrentView: (view: string) => void;
  onOpenAIChat: () => void;
}

export default function HeroSection({ onSearch, setCurrentView, onOpenAIChat }: HeroSectionProps) {
  const [project, setProject] = React.useState('');
  const [type, setType] = React.useState('');
  const [priceRange, setPriceRange] = React.useState('');
  const [bedrooms, setBedrooms] = React.useState('');
  const [areaRange, setAreaRange] = React.useState('');
  const [subdivision, setSubdivision] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      project: project || undefined,
      subdivision: subdivision || undefined,
      type: type || undefined,
      price: priceRange || undefined,
      area: areaRange || undefined,
      bedrooms: bedrooms || undefined,
    });
    setCurrentView('listings');
  };

  return (
    <div id="hero-section" className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image Overlay with Deep Sea Glassmorphism */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80"
          alt="Vinhomes Ocean Park Background"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay filter blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-950"></div>
        {/* Decorative Grid Accents */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        {/* Banner Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-cyan-950/60 border border-cyan-800/40 rounded-full text-cyan-400 text-xs font-semibold tracking-wider mb-6 animate-fade-in uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Tư Vấn Tự Động Định Giá Bằng AI Siêu Tốc</span>
        </div>

        {/* Title Group */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-100 tracking-tight leading-none mb-4 font-sans">
          Chuyên Mua Bán & Cho Thuê Căn Hộ
          <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
            Vinhomes Ocean Park
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 font-medium">
          Hơn 100+ căn hộ độc quyền vị trí đắc địa tại Ocean Park 1, 2, 3 bàn giao sang xịn mịn.
          Trải nghiệm tìm nhà hoàn hảo hơn bao giờ hết với trợ lý trí tuệ nhân tạo Gemini AI.
        </p>

        {/* Dynamic Search Box with Classmorphism */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-slate-900/80 border border-cyan-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto text-left"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project Select */}
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center">
                <Building className="w-3.5 h-3.5 text-cyan-500 mr-1" /> Dự án Ocean Park
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-cyan-950 py-2.5 px-3 rounded-lg text-sm transition focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="">Tất cả 3 phân khu dự án</option>
                <option value="Vinhomes Ocean Park 1">Vinhomes Ocean Park 1 (Gia Lâm)</option>
                <option value="Vinhomes Ocean Park 2">Vinhomes Ocean Park 2 (The Empire)</option>
                <option value="Vinhomes Ocean Park 3">Vinhomes Ocean Park 3 (The Crown)</option>
              </select>
            </div>

            {/* Type Select */}
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Loại hình căn hộ
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-cyan-950 py-2.5 px-3 rounded-lg text-sm transition focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="">Tất cả phòng ngủ</option>
                <option value="Studio">Studio</option>
                <option value="1PN">1 Phòng Ngủ</option>
                <option value="2PN">2 Phòng Ngủ</option>
                <option value="3PN">3 Phòng Ngủ</option>
                <option value="Duplex">Duplex (Thông tầng)</option>
                <option value="Penthouse">Penthouse siêu sang</option>
              </select>
            </div>

            {/* Price Ranges Selector */}
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Khoảng Giá mong muốn
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-cyan-950 py-2.5 px-3 rounded-lg text-sm transition focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="">Tất cả giá tiền</option>
                <option value="rent-under-10">Thuê: Dưới 10 triệu/tháng</option>
                <option value="rent-above-10">Thuê: Trên 10 triệu/tháng</option>
                <option value="sale-under-3">Bán: Dưới 3 Tỷ VNĐ</option>
                <option value="sale-3-5">Bán: Từ 3 - 5 Tỷ VNĐ</option>
                <option value="sale-above-5">Bán: Trên 5 Tỷ VNĐ</option>
              </select>
            </div>

            {/* Subdivision Input */}
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-cyan-500 mr-1" /> Phân khu / Tòa nhà
              </label>
              <input
                type="text"
                value={subdivision}
                onChange={(e) => setSubdivision(e.target.value)}
                placeholder="Ví dụ: Sapphire, Zenpark, M2..."
                className="w-full bg-slate-950 text-slate-200 border border-cyan-950 py-2 px-3 rounded-lg text-sm transition focus:outline-none focus:border-cyan-500 font-medium placeholder-slate-600"
              />
            </div>

            {/* Bedrooms selector */}
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Số lượng phòng ngủ
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-cyan-950 py-2.5 px-3 rounded-lg text-sm transition focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="">Bất kỳ số phòng</option>
                <option value="0">Studio (0 PN)</option>
                <option value="1">1 Phòng Ngủ</option>
                <option value="2">2 Phòng Ngủ</option>
                <option value="3">3 Phòng Ngủ</option>
                <option value="4">4 Phòng Ngủ trở lên</option>
              </select>
            </div>

            {/* Area Selector */}
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Diện Tích sử dụng
              </label>
              <select
                value={areaRange}
                onChange={(e) => setAreaRange(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-cyan-950 py-2.5 px-3 rounded-lg text-sm transition focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="">Mọi diện tích</option>
                <option value="under-50">Dưới 50 m²</option>
                <option value="50-80">50 - 80 m²</option>
                <option value="80-120">80 - 120 m²</option>
                <option value="above-120">Trên 120 m²</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-cyan-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-medium">
              💡 Bạn cần gấp? Nói với AI nhu cầu của bạn để tìm căn phù hợp nhất tức thì!
            </span>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenAIChat}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-cyan-800/60 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-950/50 text-sm font-semibold transition"
              >
                Hỏi Trợ Lý AI
              </button>
              <button
                type="submit"
                id="search-submit-btn"
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 text-slate-950 font-bold px-7 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transform hover:-translate-y-0.5 transition"
              >
                <Search className="w-4 h-4 text-slate-950 stroke-3" />
                <span>TÌM NGAY</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
