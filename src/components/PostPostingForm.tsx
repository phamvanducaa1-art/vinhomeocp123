import React from 'react';
import { Sparkles, Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Listing } from '../types';

interface PostPostingFormProps {
  onSuccess: (newListingId: string) => void;
}

export default function PostPostingForm({ onSuccess }: PostPostingFormProps) {
  const [project, setProject] = React.useState('Vinhomes Ocean Park 1');
  const [subdivision, setSubdivision] = React.useState('The Sapphire 1');
  const [building, setBuilding] = React.useState('S1.02');
  const [floor, setFloor] = React.useState(12);
  const [apartmentNumber, setApartmentNumber] = React.useState('1205');
  const [type, setType] = React.useState<'Studio' | '1PN' | '2PN' | '3PN' | 'Duplex' | 'Penthouse'>('2PN');
  const [price, setPrice] = React.useState(3200000000);
  const [transactionType, setTransactionType] = React.useState<'sale' | 'rent'>('sale');
  const [area, setArea] = React.useState(64);
  const [bedrooms, setBedrooms] = React.useState(2);
  const [bathrooms, setBathrooms] = React.useState(2);
  const [direction, setDirection] = React.useState<'Đông' | 'Tây' | 'Nam' | 'Bắc' | 'Đông Nam' | 'Đông Bắc' | 'Tây Nam' | 'Tây Bắc'>('Đông Nam');
  const [furniture, setFurniture] = React.useState<'Cơ bản' | 'Đầy đủ' | 'Bàn giao thô'>('Đầy đủ');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [keywords, setKeywords] = React.useState('');

  // Upload representations
  const [uploadedImages, setUploadedImages] = React.useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState(false);
  const [postingSuccess, setPostingSuccess] = React.useState(false);
  const [newId, setNewId] = React.useState('');

  // AI assistant states
  const [aiWriting, setAiWriting] = React.useState(false);
  const [aiNotice, setAiNotice] = React.useState('');

   const randomVinhomesImages = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80'
  ];

  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadProgress(true);
      setTimeout(() => {
        // Pick a matching preloaded photo or generic Picsum/Unsplash as mock path
        const fileNames = Array.from(e.target.files || []);
        const paths = fileNames.map((_, idx) => randomVinhomesImages[(uploadedImages.length + idx) % randomVinhomesImages.length]);
        setUploadedImages([...uploadedImages, ...paths]);
        setUploadProgress(false);
      }, 1200);
    }
  };

  const handleTriggerAIWriter = () => {
    setAiWriting(true);
    setAiNotice('');
    fetch('/api/ai/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project,
        subdivision,
        building,
        type,
        price,
        area,
        bedrooms,
        direction,
        furniture,
        highlights: keywords
      })
    })
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setDescription(data.description);
        setAiWriting(false);
        if (data.isSimulated) {
          setAiNotice('Hệ thống tự động sử dụng thuật toán tối ưu cục bộ. Thêm mã API Key ở panel để gọi Gemini AI thật.');
        } else {
          setAiNotice('Tiêu đề & mô tả đã được soạn thảo từ Gemini AI thành công!');
        }
      })
      .catch(err => {
        console.error('Error with AI auto-writer:', err);
        setAiWriting(false);
      });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Vui lòng soạn thảo Tiêu Đề và Mô Tả căn hộ (Có thể dùng trợ lý AI tự viết)');
      return;
    }

    const payload = {
      title,
      description,
      project,
      subdivision,
      building,
      floor,
      apartmentNumber,
      type,
      price,
      transactionType,
      area,
      bedrooms,
      bathrooms,
      direction,
      furniture,
      images: uploadedImages.length > 0 ? uploadedImages : undefined,
      amenities: ['Công viên thể thao ngoài trời', 'Bể bơi resort nội khu', 'Sát cạnh VinBus']
    };

    fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then((data: Listing) => {
        setPostingSuccess(true);
        setNewId(data.id);
      })
      .catch((err) => {
        console.error('Error posting listing:', err);
      });
  };

  const handleCreateAnother = () => {
    setPostingSuccess(false);
    setTitle('');
    setDescription('');
    setUploadedImages([]);
    setKeywords('');
  };

  if (postingSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6" id="posting-success-panel">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Đăng Tin Thành Công!</h2>
          <p className="text-slate-400 text-sm mt-1.5">Tin đăng của bạn đã được ghi nhận trực tiếp vào kho dữ liệu và hiển thị công khai trên website.</p>
        </div>

        <div className="bg-slate-900 border border-cyan-950 p-5 rounded-2xl flex flex-col items-center max-w-sm mx-auto space-y-3">
          <span className="text-xs text-slate-400 font-medium">Mã tin của bạn: <strong className="text-white text-semibold">{newId}</strong></span>
          <div className="flex space-x-3 w-full">
            <button
              onClick={() => onSuccess(newId)}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-slate-950 font-bold py-2 rounded-xl text-xs"
            >
              Xem Tin Đã Đăng
            </button>
            <button
              onClick={handleCreateAnother}
              className="flex-1 bg-slate-950 border border-cyan-950 text-slate-300 font-semibold py-2 rounded-xl text-xs hover:border-slate-800"
            >
              Đăng căn hộ khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="posting-form-portal">
      {/* Title */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-white tracking-tight">Ký Gửi / Đăng Tin Căn Hộ Miễn Phí</h1>
        <p className="text-xs text-slate-400 mt-1">Dành cho chính chủ nhà, đại sứ nhà đầu tư gửi thông tin bán hoặc cho thuê căn hộ Vinhomes Ocean Park.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6 bg-slate-900 border border-cyan-950/80 rounded-2xl p-6 sm:p-8">
        
        {/* Core Specs Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-cyan-950/40">
          
          {/* Project select */}
          <div>
            <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Lựa chọn đô thị Vinhomes *</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-3 px-3.5 focus:border-cyan-500 outline-none font-semibold"
            >
              <option value="Vinhomes Ocean Park 1">Vinhomes Ocean Park 1 (Gia Lâm, HN)</option>
              <option value="Vinhomes Ocean Park 2">Vinhomes Ocean Park 2 (Văn Giang, Hưng Yên)</option>
              <option value="Vinhomes Ocean Park 3">Vinhomes Ocean Park 3 (Nghĩa Trụ, Hưng Yên)</option>
            </select>
          </div>

          {/* Transaction Type rent / sale */}
          <div>
            <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Hình thức ký gửi *</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-cyan-950">
              <button
                type="button"
                onClick={() => setTransactionType('sale')}
                className={`py-2 rounded-lg text-xs font-bold transition uppercase ${
                  transactionType === 'sale' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cần bán căn hộ
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('rent')}
                className={`py-2 rounded-lg text-xs font-bold transition uppercase ${
                  transactionType === 'rent' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cho thuê lâu dài
              </button>
            </div>
          </div>

          {/* Subdivision and Building inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-1.5">Phân khu (ví dụ: Sapphire 1) *</label>
              <input
                type="text"
                required
                value={subdivision}
                onChange={(e) => setSubdivision(e.target.value)}
                placeholder="The Zenpark, Miami..."
                className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-1.5">Tòa nhà (ví dụ: R1.02) *</label>
              <input
                type="text"
                required
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="M2, S1.12..."
                className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* Floor and Apartment Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-1.5">Tầng số (ví dụ: 12) *</label>
              <input
                type="number"
                required
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-1.5">Nhãn số căn (ví dụ: 1208) *</label>
              <input
                type="text"
                required
                value={apartmentNumber}
                onChange={(e) => setApartmentNumber(e.target.value)}
                placeholder="1208, PK-18..."
                className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* Area & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-1.5">Diện tích sàn (m²) *</label>
              <input
                type="number"
                required
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 focus:border-cyan-500 outline-none font-semibold text-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-1.5">Giá {transactionType === 'sale' ? 'giao dịch (VND)' : 'thuê (VND/tháng)'} *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 focus:border-cyan-500 outline-none font-semibold text-amber-500"
              />
            </div>
          </div>

          {/* Layout specs & direction */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-1.5">Cấu trúc phòng ngủ *</label>
              <select
                value={type}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setType(val);
                  setBedrooms(val === 'Studio' ? 0 : val === '1PN' ? 1 : val === '2PN' ? 2 : val === '3PN' ? 3 : 4);
                }}
                className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3 focus:outline-none"
              >
                <option value="Studio">Studio (0 PN)</option>
                <option value="1PN">1 Phòng Ngủ</option>
                <option value="2PN">2 Phòng Ngủ</option>
                <option value="3PN">3 Phòng Ngủ</option>
                <option value="Duplex">Duplex (Thông tầng)</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-1.5">Hướng ban công *</label>
              <select
                value={direction}
                onChange={(e: any) => setDirection(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2.5 px-3 focus:outline-none"
              >
                <option value="Đông Nam">Đông Nam</option>
                <option value="Tây Bắc">Tây Bắc</option>
                <option value="Tây Nam">Tây Nam</option>
                <option value="Đông Bắc">Đông Bắc</option>
                <option value="Đông">Hướng Đông</option>
                <option value="Tây">Hướng Tây</option>
                <option value="Nam">Hướng Nam</option>
                <option value="Bắc">Hướng Bắc</option>
              </select>
            </div>
          </div>
        </div>

        {/* IMAGE PREVIEW AND DRAG & DROP SIMULATION */}
        <div className="pb-6 border-b border-cyan-950/40">
          <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Hình Ảnh & File Đính Kèm Căn Hộ *</label>
          <div className="h-32 border-2 border-dashed border-cyan-950 hover:border-cyan-500 rounded-2xl flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden transition group">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUploadSimulated}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="text-center space-y-1">
              <Upload className="w-8 h-8 text-slate-500 mx-auto group-hover:text-cyan-400 transition" />
              <p className="text-xs text-slate-300 font-semibold">Bấm hoặc kéo thả tối đa 30 tệp ảnh/video/PDF đính kèm</p>
              <p className="text-[10px] text-slate-500">Hỗ trợ JPG, PNG, MP4, dung lượng tối đa 50MB</p>
            </div>
          </div>

          {/* Upload loading state indicator */}
          {uploadProgress && (
            <p className="text-xs text-cyan-400 font-semibold text-center mt-2 animate-pulse">
              Đang bảo mật tải ảnh lên máy chủ cục bộ...
            </p>
          )}

          {/* Display grid results of loaded files */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
              {uploadedImages.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-cyan-850">
                  <img src={img} alt="Spec" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-slate-950/80 p-1 text-[10px] rounded hover:text-amber-500"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI AUTO WRITER FOR COPYWRITERS */}
        <div className="bg-gradient-to-br from-cyan-950/40 via-slate-950 to-slate-950 p-5 rounded-2xl border border-cyan-500/20 relative space-y-3">
          <div className="absolute right-4 top-4 text-cyan-500/5">
            <Sparkles className="w-20 h-20" />
          </div>

          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <h3 className="text-white font-bold text-sm">Trợ lý Viết Tin Rao AI Toàn Năng</h3>
              <p className="text-slate-400 text-xs">Phân tích thuộc tính căn hộ để soạn thảo nội dung tin đăng giật tít tức thì.</p>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Từ Khóa Điểm Nhấn (Tùy chọn)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="ví dụ: view hồ cá Koi, chủ nhà bán cắt lỗ thu hồi vốn gấp..."
              className="w-full bg-slate-900 border border-cyan-950 text-slate-200 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">
              Nhập đầy đủ thông tin phân khu, tầng, giá rồi nhấn nút soạn tin tự động!
            </span>
            <button
              type="button"
              disabled={aiWriting}
              onClick={handleTriggerAIWriter}
              className="bg-cyan-950 border border-cyan-500 hover:bg-cyan-550 hover:border-cyan-400 text-cyan-400 font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition whitespace-nowrap"
            >
              {aiWriting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>AI Đang soạn tin...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>SOẠN THẢO BẰNG AI</span>
                </>
              )}
            </button>
          </div>

          {aiNotice && (
            <p className="text-[10px] text-teal-400 bg-teal-950/20 border border-teal-900/30 p-2.5 rounded-lg">
              {aiNotice}
            </p>
          )}
        </div>

        {/* Written content */}
        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Tiêu Đề Tin Đăng *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề rao tin, ví dụ: Căn hộ Studio toà S1.02 view ngắm công viên hồ bơi siêu thơ mộng..."
              className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-3 px-3.5 focus:border-cyan-500 outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Nội dung mô tả căn hộ chi tiết *</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập nội dung mô tả tiện ích vây quanh, tiêu chuẩn bàn giao nội thất, hướng gió, giá gánh phí chuyển nhượng..."
              rows={6}
              className="w-full bg-slate-950 border border-cyan-950 text-slate-200 text-xs rounded-xl py-3 px-3.5 focus:border-cyan-500 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start text-xs text-slate-500 space-x-1.5">
            <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <span>Tin đăng sẽ được kiểm duyệt mã và công khai ngay lập tức trên hệ thống website OceanPark Homes.</span>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 text-slate-950 font-extrabold px-9 py-3 rounded-xl text-xs tracking-wider transition uppercase"
          >
            Đăng Tin Ngay
          </button>
        </div>

      </form>
    </div>
  );
}
