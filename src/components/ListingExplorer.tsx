import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, CornerDownRight, SquareStack, Compass, RefreshCw } from 'lucide-react';
import { Listing } from '../types';

interface ListingExplorerProps {
  initialSearchFilters?: {
    project?: string;
    subdivision?: string;
    type?: string;
    price?: string;
    area?: string;
    bedrooms?: string;
  };
  onSelectListing: (listingId: string) => void;
}

export default function ListingExplorer({ initialSearchFilters, onSelectListing }: ListingExplorerProps) {
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Filter States
  const [project, setProject] = React.useState(initialSearchFilters?.project || '');
  const [subdivision, setSubdivision] = React.useState(initialSearchFilters?.subdivision || '');
  const [type, setType] = React.useState(initialSearchFilters?.type || '');
  const [bedrooms, setBedrooms] = React.useState(initialSearchFilters?.bedrooms || '');
  const [transactionType, setTransactionType] = React.useState(
    initialSearchFilters?.price?.startsWith('rent') ? 'rent' : initialSearchFilters?.price?.startsWith('sale') ? 'sale' : ''
  );
  const [direction, setDirection] = React.useState('');
  const [priceRange, setPriceRange] = React.useState(initialSearchFilters?.price || '');
  const [areaRange, setAreaRange] = React.useState(initialSearchFilters?.area || '');
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState('newest');

  // Trigger search trigger
  const fetchFilteredListings = React.useCallback(() => {
    setLoading(true);

    let priceMin = '';
    let priceMax = '';
    if (priceRange === 'rent-under-10') {
      priceMax = '10000000';
    } else if (priceRange === 'rent-above-10') {
      priceMin = '10000000';
    } else if (priceRange === 'sale-under-3') {
      priceMax = '3000000000';
    } else if (priceRange === 'sale-3-5') {
      priceMin = '3000000000';
      priceMax = '5000000000';
    } else if (priceRange === 'sale-above-5') {
      priceMin = '5000000000';
    }

    let areaMin = '';
    let areaMax = '';
    if (areaRange === 'under-50') {
      areaMax = '50';
    } else if (areaRange === '50-80') {
      areaMin = '50';
      areaMax = '80';
    } else if (areaRange === '80-120') {
      areaMin = '80';
      areaMax = '120';
    } else if (areaRange === 'above-120') {
      areaMin = '120';
    }

    const tType = transactionType 
      ? transactionType 
      : priceRange.startsWith('rent') 
        ? 'rent' 
        : priceRange.startsWith('sale') 
          ? 'sale' 
          : '';

    const params = new URLSearchParams({
      project,
      subdivision,
      type,
      transactionType: tType,
      priceMin,
      priceMax,
      areaMin,
      areaMax,
      bedrooms,
      direction,
      search,
      sort
    });

    fetch(`/api/listings?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading listings:', err);
        setListings([]);
        setLoading(false);
      });
  }, [project, subdivision, type, transactionType, priceRange, areaRange, bedrooms, direction, search, sort]);

  // Load initially
  React.useEffect(() => {
    fetchFilteredListings();
  }, [fetchFilteredListings]);

  // Custom function to format big numbers to Vietnamese currency text nicely
  const formatCurrency = (price: number, transType: 'sale' | 'rent') => {
    if (transType === 'sale') {
      const billions = price / 1000000000;
      return `${billions.toFixed(2).replace(/\.00$/, '')} Tỷ`;
    } else {
      const millions = price / 1000000;
      return `${millions.toLocaleString('vi-VN')} Triệu/tháng`;
    }
  };

  const handleResetFilters = () => {
    setProject('');
    setSubdivision('');
    setType('');
    setBedrooms('');
    setTransactionType('');
    setDirection('');
    setPriceRange('');
    setAreaRange('');
    setSearch('');
    setSort('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="listings-explorer">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Kế hoạh tìm kiếm căn hộ tiện ích</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Hiện có {listings.length} tin bất động sản thích hợp trong kho.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Quick text search bar */}
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Từ khóa: căn Sapphire, view hồ..."
              className="w-full bg-slate-900 border border-cyan-950 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-cyan-500 placeholder-slate-600 transition"
            />
          </div>
          {/* Sort trigger */}
          <div className="relative flex items-center bg-slate-900 border border-cyan-950 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-300 focus:ring-0 font-semibold cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="area_asc">Diện tích nhỏ → lớn</option>
              <option value="area_desc">Diện tích lớn → nhỏ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Filters / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side: Advanced Filter Form Panel */}
        <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-5 lg:sticky lg:top-20 space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-cyan-950/40">
            <span className="flex items-center text-sm font-bold text-white uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400 mr-2" /> Bộ Lọc Nâng Cao
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-amber-500 flex items-center space-x-1 border border-cyan-950 px-2 py-1 rounded"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Thiết lập lại</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Project Filter */}
            <div>
              <label className="block text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-1.5">Khu vực dự án</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-950 text-slate-300 text-xs rounded-xl py-2.5 px-3 outline-none"
              >
                <option value="">Tất cả Ocean Park 1, 2, 3</option>
                <option value="Vinhomes Ocean Park 1">Vinhomes Ocean Park 1</option>
                <option value="Vinhomes Ocean Park 2">Vinhomes Ocean Park 2</option>
                <option value="Vinhomes Ocean Park 3">Vinhomes Ocean Park 3</option>
              </select>
            </div>

            {/* Rent/Sale */}
            <div>
              <label className="block text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-1.5">Loại hình giao dịch</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-cyan-950">
                <button
                  onClick={() => setTransactionType('')}
                  className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                    transactionType === '' ? 'bg-cyan-950 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setTransactionType('sale')}
                  className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                    transactionType === 'sale' ? 'bg-cyan-950 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mua Bán
                </button>
                <button
                  onClick={() => setTransactionType('rent')}
                  className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                    transactionType === 'rent' ? 'bg-cyan-950 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cho Thuê
                </button>
              </div>
            </div>

            {/* Price Ranges Filter */}
            <div>
              <label className="block text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-1.5">Khoảng giá lọc nhanh</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-950 text-slate-300 text-xs rounded-xl py-2.5 px-3 outline-none"
              >
                <option value="">Tất cả các mức giá</option>
                {transactionType !== 'sale' && <option value="rent-under-10">Thuê: Dưới 10 triệu/tháng</option>}
                {transactionType !== 'sale' && <option value="rent-above-10">Thuê: Trên 10 triệu/tháng</option>}
                {transactionType !== 'rent' && <option value="sale-under-3">Bán: Dưới 3 Tỷ</option>}
                {transactionType !== 'rent' && <option value="sale-3-5">Bán: Từ 3 - 5 Tỷ</option>}
                {transactionType !== 'rent' && <option value="sale-above-5">Bán: Trên 5 Tỷ</option>}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-1.5">Loại căn hộ</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-950 text-slate-300 text-xs rounded-xl py-2.5 px-3 outline-none"
              >
                <option value="">Mọi căn hộ</option>
                <option value="Studio">Studio</option>
                <option value="1PN">1PN (1 phòng ngủ)</option>
                <option value="2PN">2PN (2 phòng ngủ)</option>
                <option value="3PN">3PN (3 phòng ngủ)</option>
                <option value="Duplex">Duplex</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>

            {/* Subdivision Input */}
            <div>
              <label className="block text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-1.5">Phân khu (Gõ tìm kiếm)</label>
              <input
                type="text"
                value={subdivision}
                onChange={(e) => setSubdivision(e.target.value)}
                placeholder="Sapphire, Zenpark..."
                className="w-full bg-slate-950 border border-cyan-950 text-slate-300 text-xs rounded-xl py-2 px-3 outline-none placeholder-slate-700"
              />
            </div>

            {/* Direction Filter */}
            <div>
              <label className="block text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-1.5">Hướng ban công</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-950 text-slate-300 text-xs rounded-xl py-2.5 px-3 outline-none"
              >
                <option value="">Bất kỳ hướng nào</option>
                <option value="Đông Nam">Đông Nam (Mát mẻ)</option>
                <option value="Tây Bắc">Tây Bắc</option>
                <option value="Tây Nam">Tây Nam</option>
                <option value="Đông Bắc">Đông Bắc</option>
                <option value="Nam">Hướng Nam</option>
                <option value="Bắc">Hướng Bắc</option>
              </select>
            </div>

            {/* Area Filter */}
            <div>
              <label className="block text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-1.5">Diện tích sàn</label>
              <select
                value={areaRange}
                onChange={(e) => setAreaRange(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-950 text-slate-300 text-xs rounded-xl py-2.5 px-3 outline-none"
              >
                <option value="">Tất cả diện tích</option>
                <option value="under-50">Dưới 50m²</option>
                <option value="50-80">50 - 80m²</option>
                <option value="80-120">80 - 120m²</option>
                <option value="above-120">Trên 120m²</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-cyan-950/40">
            <button
              onClick={() => fetchFilteredListings()}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs tracking-wider transition uppercase"
            >
              Áp Dụng Lọc
            </button>
          </div>
        </div>

        {/* Right Side: Listings Grid Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-cyan-400">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400 mb-2"></div>
              <p className="text-sm font-medium">Đang tìm các căn hộ đặc quyền tốt nhất...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 border border-cyan-950 bg-slate-900/30 rounded-2xl">
              <Compass className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg">Không tìm thấy căn hộ khớp yêu cầu</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto leading-relaxed">
                Thử xoá bớt bộ lọc nâng cao hoặc gõ từ khoá đơn giản hơn để hệ thống hiển thị thêm căn hộ.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Xoá tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectListing(item.id)}
                  id={`listing-card-${item.id}`}
                  className="bg-slate-900 border border-cyan-950 rounded-xl overflow-hidden hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 transition duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail banner section with Badge info */}
                    <div className="relative h-44 overflow-hidden bg-slate-950">
                      <img
                        src={(Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'}
                        alt={item.title}
                        className="w-full h-full object-cover transition duration-300 hover:scale-103"
                        referrerPolicy="no-referrer"
                      />
                      {/* Price tag badge */}
                      <span className="absolute bottom-3 left-3 bg-slate-950/80 border border-cyan-800/40 text-cyan-400 backdrop-blur-md px-2.5 py-1 rounded-md text-[13px] font-extrabold tracking-tight">
                        {formatCurrency(item.price, item.transactionType)}
                      </span>
                      {/* Buy option badge */}
                      <span className={`absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        item.transactionType === 'sale' ? 'bg-amber-500 text-slate-950' : 'bg-cyan-600 text-white'
                      }`}>
                        {item.transactionType === 'sale' ? 'Bán' : 'Cho thuê'}
                      </span>
                    </div>

                    {/* Meta location and details */}
                    <div className="p-4">
                      <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <span>{item.project}</span>
                        <CornerDownRight className="w-3 h-3 text-cyan-500 mx-1 flex-shrink-0" />
                        <span>{item.subdivision}</span>
                      </div>

                      <h3 className="text-white font-bold text-[13px] tracking-tight leading-snug line-clamp-2 min-h-[36px] hover:text-cyan-400 transition">
                        {item.title}
                      </h3>

                      {/* Info value stats banner */}
                      <div className="grid grid-cols-3 gap-1 border-t border-cyan-950/50 pt-2.5 mt-3 text-[11px] font-semibold text-slate-400">
                        <div className="flex items-center space-x-1">
                          <SquareStack className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.area} m²</span>
                        </div>
                        <div>
                          <span>🛏️ {item.bedrooms === 0 ? 'Studio' : `${item.bedrooms} PN`}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Compass className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate">{item.direction}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detail action row */}
                  <div className="border-t border-cyan-950/50 p-3 bg-cyan-950/5 flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <div>
                      <span>Tòa: </span>
                      <strong className="text-slate-300 font-bold">{item.building}</strong>
                      <span className="mx-1">•</span>
                      <span>Mã: </span>
                      <strong className="text-slate-300 font-bold">{item.apartmentNumber}</strong>
                    </div>
                    <span className="text-cyan-400 font-semibold flex items-center group-hover:underline">
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
