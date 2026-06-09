import React from 'react';
import { BarChart3, Users, Calendar, MessageSquare, Check, X, ClipboardCheck, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Appointment, Inquiry, Listing } from '../types';

interface BrokerDashboardProps {
  onSelectListing: (id: string) => void;
}

export default function BrokerDashboard({ onSelectListing }: BrokerDashboardProps) {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [brokerListings, setBrokerListings] = React.useState<Listing[]>([]);
  const [loading, setLoading] = React.useState(true);

  // States for stats counters
  const [totalViews, setTotalViews] = React.useState(0);
  const [totalContacts, setTotalContacts] = React.useState(0);

  const fetchDashboardData = React.useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/appointments').then(res => res.json()).catch(() => []),
      fetch('/api/inquiries').then(res => res.json()).catch(() => []),
      fetch('/api/listings?sort=newest').then(res => res.json()).catch(() => [])
    ])
      .then(([appts, inqs, lists]) => {
        const safeAppts = Array.isArray(appts) ? appts : [];
        const safeInqs = Array.isArray(inqs) ? inqs : [];
        const safeLists = Array.isArray(lists) ? lists : [];

        setAppointments(safeAppts);
        setInquiries(safeInqs);
        // Take first 8 listings as broker's simulated managed listings
        setBrokerListings(safeLists.slice(0, 8));

        // Calculate stats
        const viewsCount = safeLists.reduce((acc: number, item: any) => acc + (item.views || 0), 0);
        const contactsCount = safeLists.reduce((acc: number, item: any) => acc + (item.contacts || 0), 0) + safeInqs.length + safeAppts.length;
        setTotalViews(viewsCount);
        setTotalContacts(contactsCount);

        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading dashboard data:', err);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(() => {
        // Update local list
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus as any } : a));
      })
      .catch(err => {
        console.error('Error updating appointment status:', err);
      });
  };

  // Format currency text
  const formatCurrency = (price: number, transType: 'sale' | 'rent') => {
    if (transType === 'sale') {
      return `${(price / 1000000000).toFixed(2)} Tỷ`;
    } else {
      return `${(price / 1000000).toFixed(1)} Tr/tháng`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-cyan-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400 mx-auto mb-2"></div>
        <p>Đang tải thống liệu phân tích môi giới...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="broker-dashboard">
      {/* Welcome header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            <BarChart3 className="w-6 h-6 text-cyan-500 mr-2.5" /> Broker Analytics Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">Trang phân tích tổng kết hoạt động tư vấn, ký gửi và quản lý đặt lịch xem nhà chuyên nghiệp.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-slate-900 border border-cyan-950 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl hover:border-cyan-500 hover:text-white transition flex items-center gap-1.5"
        >
          🔄 Làm mới dữ liệu
        </button>
      </div>

      {/* Grid: 4 stat metric boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Views */}
        <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Lượt Xem Căn</span>
            <span className="text-2xl font-extrabold text-white tracking-tight">{totalViews.toLocaleString('vi-VN')}</span>
            <div className="flex items-center text-emerald-400 text-xs mt-1 font-bold">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+18.2% tuần này</span>
            </div>
          </div>
          <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Contacts */}
        <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Tổng Liên Hệ</span>
            <span className="text-2xl font-extrabold text-white tracking-tight">{totalContacts}</span>
            <div className="flex items-center text-emerald-400 text-xs mt-1 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
              <span>Tỉ lệ phản hồi 100%</span>
            </div>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-400">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Viewing Appts count */}
        <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Lịch Hẹn Xem Đất</span>
            <span className="text-2xl font-extrabold text-cyan-400 tracking-tight">{appointments.length}</span>
            <span className="text-[10px] text-slate-500 block mt-1.5">
              {appointments.filter(a => a.status === 'Chờ duyệt').length} lịch chờ duyệt
            </span>
          </div>
          <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 text-cyan-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Lead Conversion Metrics ratio */}
        <div className="bg-slate-900 border border-cyan-950/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Hiệu suất chuyển đổi</span>
            <span className="text-2xl font-extrabold text-amber-400 tracking-tight">
              {((totalContacts / (totalViews || 1)) * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-1.5">&#128200; Đánh giá: Rất tốt</span>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-500">
            <ClipboardCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Grid: Appointments on left, customer inquiries on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Appointments column (Span 2) */}
        <div className="lg:col-span-2 bg-slate-900 border border-cyan-950 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-cyan-950/45 mb-4">
            <h3 className="text-white font-bold text-sm flex items-center">
              <Calendar className="w-4 h-4 text-cyan-500 mr-2" /> Quản Lý Đặt Lịch Xem Nhà Trực Tiếp
            </h3>
            <span className="text-[10px] bg-slate-950 border border-cyan-950 text-slate-400 px-3 py-1 rounded">
              Tổng số lịch hẹn: {appointments.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {appointments.length === 0 ? (
              <p className="text-center py-8 text-slate-500 text-xs font-semibold">Chưa có khách đặt lịch xem nhà nào.</p>
            ) : (
              appointments.map((appt) => (
                <div key={appt.id} className="bg-slate-950 border border-cyan-950/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{appt.clientName}</span>
                      <div className="text-[11px] text-slate-400 mt-0.5 space-x-2">
                        <span>📱 {appt.clientPhone}</span>
                        {appt.clientEmail && <span>✉ {appt.clientEmail}</span>}
                      </div>
                    </div>
                    {/* Status icon badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      appt.status === 'Chờ duyệt' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      appt.status === 'Đã xác nhận' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      appt.status === 'Đã hoàn thành' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                      'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  {/* Target Listing detail path */}
                  <div className="bg-slate-900/60 p-2.5 rounded border border-cyan-950/30 text-[11px] text-slate-300">
                    <span className="block text-slate-500 uppercase tracking-widest text-[9px] font-bold mb-0.5">Căn hộ đích:</span>
                    <span>{appt.listingTitle}</span>
                  </div>

                  {appt.note && (
                    <p className="text-xs text-slate-400 italic bg-cyan-950/5 p-2 rounded-lg border border-cyan-950/20">
                      📝 {appt.note}
                    </p>
                  )}

                  {/* Date & Time display */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500">
                      📅 Lịch yêu cầu: <strong className="text-white font-semibold">{appt.date}</strong> vào lúc <strong className="text-white font-semibold">{appt.time}</strong>
                    </span>

                    {/* Broker actions to update status */}
                    {appt.status === 'Chờ duyệt' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(appt.id, 'Đã hủy')}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Hủy/Từ chối"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(appt.id, 'Đã xác nhận')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold p-1 rounded transition"
                          title="Xác nhận duyệt lịch"
                        >
                          <Check className="w-3.5 h-3.5 text-slate-950 stroke-3" />
                        </button>
                      </div>
                    )}

                    {appt.status === 'Đã xác nhận' && (
                      <button
                        onClick={() => handleUpdateStatus(appt.id, 'Đã hoàn thành')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-800/30 bg-cyan-950/20 px-2.5 py-1 rounded"
                      >
                        ✔ Đã dẫn xem xong
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Customer Inquiries / Requests (Span 1) */}
        <div className="bg-slate-900 border border-cyan-950 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-cyan-950/45 mb-4">
              <h3 className="text-white font-bold text-sm flex items-center">
                <MessageSquare className="w-4 h-4 text-cyan-500 mr-2" /> Ý Kiến Tư Vấn Khách Hàng
              </h3>
            </div>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {inquiries.length === 0 ? (
                <p className="text-center py-10 text-slate-500 text-xs font-semibold">Chưa nhận được yêu cầu tư vấn nào.</p>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="bg-slate-950 border border-cyan-950/50 p-3.5 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{inq.clientName}</strong>
                      <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded">
                        {inq.source}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      <span>📱 {inq.clientPhone}</span>
                      {inq.clientEmail && <span className="ml-2">✉ {inq.clientEmail}</span>}
                    </div>
                    <p className="text-slate-300 leading-snug font-medium border-t border-cyan-950/30 pt-1.5 mt-1.5">
                      {inq.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-cyan-950/30">
            <span className="text-[10px] text-slate-500 block leading-tight text-center">
              💡 Chuyên viên môi giới lưu ý: Hãy kiểm tra hòm thư Zalo/Hotline liên thục để tối ưu hóa sự phục vụ.
            </span>
          </div>
        </div>

      </div>

      {/* Broker posted listings review list */}
      <div className="bg-slate-900 border border-cyan-950 rounded-2xl p-6">
        <h3 className="text-white font-bold text-sm pb-4 border-b border-cyan-950/45 mb-4">
          📚 Quản lý Quỹ Căn Ký Gửi Độc Quyền ({brokerListings.length} căn nổ bật)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-slate-300">
            <thead>
              <tr className="border-b border-cyan-950/60 pb-2 text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="py-2">Mã & Căn Hộ</th>
                <th className="py-2">Phân khu / Dự án</th>
                <th className="py-2">Loại hình</th>
                <th className="py-2">Giá chào bán</th>
                <th className="py-2 text-center">Lượt xem</th>
                <th className="py-2 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/30">
              {brokerListings.map((l) => (
                <tr key={l.id} className="hover:bg-cyan-950/10">
                  <td className="py-3 pr-2">
                    <span onClick={() => onSelectListing(l.id)} className="block text-white font-bold cursor-pointer hover:text-cyan-400 truncate max-w-xs">{l.title}</span>
                    <span className="text-[9px] text-slate-500 font-semibold">{l.id} (Tòa {l.building} - Căn {l.apartmentNumber})</span>
                  </td>
                  <td className="py-3">
                    <span className="block font-semibold">{l.subdivision}</span>
                    <span className="text-[10px] text-slate-500">{l.project}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      l.transactionType === 'sale' ? 'bg-amber-500/10 text-amber-500' : 'bg-cyan-600/10 text-cyan-400'
                    }`}>
                      {l.transactionType === 'sale' ? 'Mua bán' : 'Cho thuê'}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-white">
                    {formatCurrency(l.price, l.transactionType)}
                  </td>
                  <td className="py-3 text-center text-slate-400 font-bold">
                    👁 {l.views || 0}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectListing(l.id)}
                      className="text-[10px] font-bold bg-cyan-950 text-cyan-400 hover:bg-cyan-900 border border-cyan-800/20 px-2.5 py-1 rounded"
                    >
                      Kiểm tra căn →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
