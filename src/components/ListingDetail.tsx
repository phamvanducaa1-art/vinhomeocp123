import React from 'react';
import { Calendar, Phone, Mail, ChevronRight, CornerDownRight, Compass, ShieldCheck, Sparkles, Building, MapPin, Share2, CreditCard } from 'lucide-react';
import { Listing } from '../types';
import CheckoutModal from './CheckoutModal';

interface ListingDetailProps {
  listingId: string;
  onBackToListing: () => void;
  onOpenAIChat: () => void;
}

interface PriceAnalysis {
  rating: string;
  score: number;
  analysis: string;
  advice: string;
  isSimulated?: boolean;
}

export default function ListingDetail({ listingId, onBackToListing, onOpenAIChat }: ListingDetailProps) {
  const [listing, setListing] = React.useState<Listing | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeImage, setActiveImage] = React.useState(0);

  // Appt state
  const [clientName, setClientName] = React.useState('');
  const [clientPhone, setClientPhone] = React.useState('');
  const [clientEmail, setClientEmail] = React.useState('');
  const [apptDate, setApptDate] = React.useState('');
  const [apptTime, setApptTime] = React.useState('');
  const [apptNote, setApptNote] = React.useState('');
  const [apptSuccess, setApptSuccess] = React.useState(false);

  // AI Price Analyzer States
  const [analysis, setAnalysis] = React.useState<PriceAnalysis | null>(null);
  const [analyzing, setAnalyzing] = React.useState(false);

  // Checkout modal toggle state
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/listings/${listingId}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setListing(data);
        } else {
          setListing(null);
        }
        setLoading(false);
        setActiveImage(0);
        setAnalysis(null); // Reset when switching listing
      })
      .catch(err => {
        console.error('Error fetching listing detail:', err);
        setListing(null);
        setLoading(false);
      });
  }, [listingId]);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !apptDate || !apptTime) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId,
        listingTitle: listing?.title,
        clientName,
        clientPhone,
        clientEmail,
        date: apptDate,
        time: apptTime,
        note: apptNote
      })
    })
      .then(res => res.json())
      .then(() => {
        setApptSuccess(true);
        // Reset form
        setApptNote('');
      })
      .catch(err => {
        console.error('Error booking appointment:', err);
      });
  };

  const handleTriggerAIAnalysis = () => {
    if (!listing) return;
    setAnalyzing(true);
    fetch('/api/ai/analyze-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: listing.id,
        price: listing.price,
        area: listing.area,
        project: listing.project,
        subdivision: listing.subdivision,
        type: listing.type,
        transactionType: listing.transactionType
      })
    })
      .then(res => res.json())
      .then(data => {
        setAnalysis(data);
        setAnalyzing(false);
      })
      .catch(err => {
        console.error('Error triggering AI analytics:', err);
        setAnalyzing(false);
      });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-cyan-400">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400 mx-auto mb-2"></div>
        <p>Đang tải thông tin chi tiết căn hộ...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
        <h3 className="text-xl font-bold">Không tìm thấy căn hộ này</h3>
        <button onClick={onBackToListing} className="mt-4 text-cyan-400 font-semibold underline">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const formatCurrency = (price: number) => {
    if (listing.transactionType === 'sale') {
      const billions = price / 1000000000;
      return `${billions.toFixed(2).replace(/\.00$/, '')} Tỷ VNĐ`;
    } else {
      const millions = price / 1000000;
      return `${millions.toLocaleString('vi-VN')} VNĐ/tháng`;
    }
  };

  const images = Array.isArray(listing.images) ? listing.images : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="listing-detail">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={onBackToListing}
          className="inline-flex items-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
        >
          ← Quay lại danh sách căn hộ
        </button>
      </div>

      {/* Grid: Photo & specs on left, Appointment book on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery block */}
          <div className="bg-slate-900 border border-cyan-950 rounded-2xl overflow-hidden pb-4">
            <div className="relative h-96 sm:h-[450px] bg-slate-950">
              <img
                src={images[activeImage] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000'}
                alt={listing.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 text-white border border-cyan-800/40 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                {listing.transactionType === 'sale' ? 'Mua bán chuyển nhượng' : 'Cho thuê lâu dài'}
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-950/70 border border-slate-700/30 text-white text-xs px-3 py-1.5 rounded-lg">
                Ảnh {activeImage + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex space-x-2.5 px-4 mt-4 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImage === i ? 'border-cyan-400' : 'border-cyan-950 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Core Specifications Bento Grid */}
          <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-cyan-950/40 pb-4">
              <div>
                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest gap-1 mb-1">
                  <span>{listing.project}</span>
                  <CornerDownRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Phân khu {listing.subdivision}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">{listing.title}</h1>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right flex-shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">Giá chào bán/thuê</span>
                <span className="text-2xl font-extrabold text-cyan-400 block leading-tight">
                  {formatCurrency(listing.price)}
                </span>
                <span className="text-xs text-slate-400">~ {(listing.price / listing.area).toLocaleString('vi-VN')} đ/m²</span>
              </div>
            </div>

            {/* Grid specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-950/50 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Diện Tích</span>
                <span className="text-base font-extrabold text-white mt-1 block">{listing.area} m²</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-950/50 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Phòng Ngủ</span>
                <span className="text-base font-extrabold text-white mt-1 block">
                  {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} phòng`}
                </span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-950/50 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ban công hướng</span>
                <span className="text-base font-extrabold text-white mt-1 block">{listing.direction}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-950/50 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bàn giao đồ</span>
                <span className="text-base font-extrabold text-white mt-1 block">{listing.furniture}</span>
              </div>
            </div>

            {/* Quick specifications lists */}
            <div className="border-t border-cyan-950/45 pt-4 grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm text-slate-300">
              <div className="flex justify-between border-b border-cyan-950/20 pb-2">
                <span className="text-slate-400 font-medium">Toà nhà / Tháp:</span>
                <strong className="text-white font-bold">{listing.building}</strong>
              </div>
              <div className="flex justify-between border-b border-cyan-950/20 pb-2">
                <span className="text-slate-400 font-medium">Tầng số:</span>
                <strong className="text-white font-bold">{listing.floor} ({listing.floor > 10 ? 'Tầng trung' : 'Tầng thấp'})</strong>
              </div>
              <div className="flex justify-between border-b border-cyan-950/20 pb-2">
                <span className="text-slate-400 font-medium">Mã số căn hộ:</span>
                <strong className="text-white font-bold">{listing.apartmentNumber}</strong>
              </div>
              <div className="flex justify-between border-b border-cyan-950/20 pb-2">
                <span className="text-slate-400 font-medium">Phòng vệ sinh:</span>
                <strong className="text-white font-bold">{listing.bathrooms} WC</strong>
              </div>
            </div>
          </div>

          {/* AI ADVANCED ASSESSER - DYNAMIC COMPONENT */}
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-6">
            <div className="absolute right-4 top-4 text-cyan-400/20">
              <Sparkles className="w-24 h-24 stroke-1 animate-pulse" />
            </div>

            <div className="flex items-center space-x-2.5 mb-3.5">
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-lg text-cyan-400">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Trợ Lý AI Thẩm Định Giá Tự Động</h3>
                <p className="text-slate-400 text-xs">Phân tích giá bán, cho thuê so với mặt bằng thực tế Vinhomes Ocean Park.</p>
              </div>
            </div>

            {!analysis && !analyzing && (
              <div className="bg-slate-950/40 p-4 rounded-xl border border-cyan-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-medium leading-relaxed max-w-md">
                  Gemini AI khuyên bạn: Hãy thẩm định giá trước khi mua hoặc đặt lịch xem để dễ dàng thực hiện thỏa thuận thương lượng hời hơn.
                </span>
                <button
                  onClick={handleTriggerAIAnalysis}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs tracking-wider transition-all shadow-lg shadow-amber-500/10"
                >
                  BẮT ĐẦU PHÂN TÍCH
                </button>
              </div>
            )}

            {analyzing && (
              <div className="py-6 flex flex-col items-center justify-center text-cyan-400 space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
                <span className="text-xs font-semibold animate-pulse uppercase tracking-widest">Hệ thống đang định giá qua mã nguồn dữ liệu lớn...</span>
              </div>
            )}

            {analysis && (
              <div className="space-y-4 pt-1 animate-fade-in text-xs font-medium">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Rating block */}
                  <div className="bg-slate-950/80 border border-cyan-900/60 p-4 rounded-xl text-center">
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold mb-1">Xếp Hạng Giá</span>
                    <span className={`text-[13px] font-extrabold ${
                      analysis.rating.includes('HỜI') ? 'text-emerald-400' : 'text-cyan-400'
                    }`}>
                      {analysis.rating}
                    </span>
                  </div>
                  {/* Score block */}
                  <div className="bg-slate-950/80 border border-cyan-900/60 p-4 rounded-xl text-center">
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold mb-1">Điểm Tài Chính</span>
                    <span className="text-amber-500 text-lg font-extrabold block">
                      {analysis.score}/10
                    </span>
                  </div>
                  {/* AI Badge indicator */}
                  <div className="bg-slate-950/80 border border-cyan-900/60 p-4 rounded-xl text-center flex flex-col justify-center">
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold mb-1">Chế độ xử lý</span>
                    <span className="text-slate-300 text-[10px] font-semibold text-center truncate">
                      {analysis.isSimulated ? 'Hàm nội bộ tối ưu' : 'Hệ Thống Gemini Pro Live'}
                    </span>
                  </div>
                </div>

                {/* Analysis detail */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-cyan-950 space-y-2 text-slate-300">
                  <span className="block font-bold text-white text-xs">📝 Nhận Định Chuyên Gia AI:</span>
                  <p className="leading-relaxed leading-5">{analysis.analysis}</p>
                </div>

                {/* advice */}
                <div className="bg-teal-950/10 p-4 rounded-xl border border-teal-900/40 space-y-2 text-slate-300">
                  <span className="block font-bold text-teal-400 text-xs">💼 Lời Khuyên Đầu Tư Tài Chính:</span>
                  <p className="leading-relaxed leading-5">{analysis.advice}</p>
                </div>
              </div>
            )}
          </div>

          {/* Detailed written description */}
          <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white border-b border-cyan-950 pb-3 mb-4">
              Mô Tả Chi Tiết Khai Thác Bất Động Sản
            </h3>
            <div className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">
              {listing.description}
            </div>
          </div>

          {/* Surround amenities bento item List */}
          <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white border-b border-cyan-950/50 pb-3 mb-4">
              Tiện Ích Đặc Quyền Đặc Sắc Vây Quanh
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {listing.amenities.map((am, i) => (
                <div key={i} className="flex items-center space-x-2 bg-slate-950 px-3 py-2.5 rounded-lg border border-cyan-950/50 text-slate-300 text-xs font-semibold">
                  <span>✨</span>
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Google Map Mock */}
          <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-6">
            <div className="flex justify-between items-center border-b border-cyan-950/50 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">
                Vị Trí Định Vị Bản Đồ Dự Án
              </h3>
              <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-900/20 border border-cyan-800/30 px-2 py-0.5 rounded">
                Tòa {listing.building} OCP
              </span>
            </div>
            
            {/* Elegant schematic visual representative */}
            <div className="h-64 rounded-xl border border-cyan-950 bg-slate-950 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-15">
                {/* Simulated grid lines */}
                <div className="w-full h-full" style={{
                  backgroundImage: 'radial-gradient(circle, #0e7490 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}></div>
              </div>

              {/* Simulated Map Components */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-amber-500 text-slate-950 p-2.5 rounded-full shadow-lg shadow-amber-500/20 border-2 border-white animate-bounce">
                  <MapPin className="w-5 h-5 text-slate-950 stroke-3" />
                </div>
                <span className="mt-1 bg-slate-900/90 text-white border border-cyan-800 border-b-2 border-r-2 text-[10px] font-extrabold px-3 py-1 rounded-md tracking-tight whitespace-nowrap shadow-md">
                  Vị trí Tòa {listing.building} ({listing.subdivision})
                </span>
              </div>

              {/* Nearby anchors */}
              <div className="absolute top-12 left-16 flex items-center bg-cyan-950/70 border border-cyan-800/20 px-2 py-1 rounded text-[10px] text-slate-300">
                <span>🌊 Biển Hồ Cát Trắng (300m)</span>
              </div>
              <div className="absolute bottom-12 right-12 flex items-center bg-cyan-950/70 border border-cyan-800/20 px-2 py-1 rounded text-[10px] text-slate-300">
                <span>🎓 Trường Đại học VinUni (1km)</span>
              </div>
              <div className="absolute bottom-16 left-10 flex items-center bg-cyan-950/70 border border-cyan-800/20 px-2 py-1 rounded text-[10px] text-slate-300">
                <span>🛍️ Vincom Mega Mall (5ph đi xe)</span>
              </div>

              {/* Navigation help overlay */}
              <div className="absolute bottom-3 inset-x-3 text-center">
                <span className="bg-slate-900/90 inline-block text-[10px] text-slate-400 px-3 py-1.5 rounded-lg border border-cyan-950">
                  📍 Vinhomes Ocean Park, Huyện Gia Lâm, Thành phố Hà Nội, Việt Nam.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Sticky booking panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-6 sticky top-20">
            <h3 className="text-base font-bold text-white border-b border-cyan-950/40 pb-3 mb-4">
              Đặt Lịch Hẹn Xem Căn Hộ
            </h3>

            {!apptSuccess ? (
              <form onSubmit={handleBookAppointment} className="space-y-4">
                {/* Client Name */}
                <div>
                  <label className="block text-slate-400 text-xs font-bold mb-1">
                    Họ và Tên quý khách <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Client Phone */}
                <div>
                  <label className="block text-slate-400 text-xs font-bold mb-1">
                    Số Điện Thoại liên hệ <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="0911222333"
                    className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Client Email */}
                <div>
                  <label className="block text-slate-400 text-xs font-bold mb-1">
                    Email nhận xác nhận
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="vinhomes@gmail.com"
                    className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Date & Time Select */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-xs font-bold mb-1">
                      Ngày xem <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={apptDate}
                      onChange={(e) => setApptDate(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2 px-2.5 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-bold mb-1">
                      Giờ xem <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={apptTime}
                      onChange={(e) => setApptTime(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2 px-2.5 outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Custom Note */}
                <div>
                  <label className="block text-slate-400 text-xs font-bold mb-1">
                    Ghi chú yêu cầu thêm
                  </label>
                  <textarea
                    value={apptNote}
                    onChange={(e) => setApptNote(e.target.value)}
                    placeholder="Ví dụ: Muốn gặp chủ căn trực tiếp, cần đo giếng trời..."
                    rows={2}
                    className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2 px-3 outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                {/* Submit Booking */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs tracking-wider transition uppercase"
                >
                  <Calendar className="w-4 h-4 text-slate-950" />
                  <span>XÁC NHẬN ĐẶT LỊCH HẸN</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4 animate-fade-in text-xs font-medium">
                <span className="text-4xl block">🎉</span>
                <h4 className="text-emerald-400 font-bold text-sm tracking-tight">Gửi Yêu Cầu Xem Nhà Thành Công!</h4>
                <p className="text-slate-300 leading-relaxed leading-5">
                  Lịch xem căn hộ **{listing.title}** nhận được mã duyệt. Đại diện đại sứ môi giới OceanPark Homes sẽ liên hệ để xác nhận trạng thái trống của phòng và hướng dẫn đưa đón quý khách bằng xe điện VinBus trong vòng 15 phút tới.
                </p>
                <button
                  onClick={() => setApptSuccess(false)}
                  className="mt-2 text-cyan-400 underline font-semibold text-xs"
                >
                  Đặt thêm một lịch khác
                </button>
              </div>
            )}

            {/* Quick CTAs buttons (Call, Zalo, Messenger) */}
            <div className="border-t border-cyan-950/40 pt-5 mt-5 space-y-3">
              <a
                href="tel:0326246516"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 text-slate-950 font-bold py-2.5 rounded-xl text-xs tracking-wider transition"
              >
                <Phone className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>HOTLINE: 0326.246.516</span>
              </a>

              <a
                href="https://zalo.me/0326246516"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-slate-950 border border-sky-400/20 hover:border-sky-400/50 text-sky-400 font-bold py-2.5 rounded-xl text-xs tracking-wider transition"
              >
                <span>💬 CHAT ZALO NGAY</span>
              </a>

              {/* Open AI chat link recommendation */}
              <button
                onClick={onOpenAIChat}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-900 border border-cyan-800 hover:border-cyan-500 text-cyan-300 font-bold py-2.5 rounded-xl text-xs tracking-wider transition"
              >
                <span>🤖 CHAT CHI TIẾT VỚI AI VỀ CĂN NÀY</span>
              </button>

              {/* Added Premium Online Payment Trigger */}
              <div className="border-t border-amber-500/20 pt-4 mt-4 space-y-1 text-center">
                <span className="text-[10px] text-amber-500 uppercase font-black tracking-widest block mb-2">⭐ Đặt Cọc Giữ Chỗ & Dịch Vụ</span>
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-light-gold text-slate-100 bg-cyan-500 hover:opacity-90 font-extrabold py-3 rounded-xl text-xs tracking-wider transition uppercase shadow-glowing"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>THANH TOÁN ĐẶT CỌC GIỮ CĂN</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {listing && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          listing={listing}
        />
      )}
    </div>
  );
}
