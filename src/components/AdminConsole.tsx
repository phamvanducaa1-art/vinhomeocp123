import React from 'react';
import { Settings, Shield, PlusCircle, CheckCircle, Trash2, Code, CreditCard, Receipt, Flame } from 'lucide-react';
import { Listing } from '../types';

export default function AdminConsole() {
  const [dbLength, setDbLength] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [notice, setNotice] = React.useState('');
  const [payments, setPayments] = React.useState<any[]>([]);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setDbLength(Array.isArray(data) ? data.length : 0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching statistics:', err);
        setDbLength(0);
        setLoading(false);
      });
  };

  const fetchPayments = () => {
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        setPayments(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Error fetching admin payments:', err);
        setPayments([]);
      });
  };

  React.useEffect(() => {
    fetchStats();
    fetchPayments();
  }, []);

  const handleUpdatePaymentStatus = (id: string, newStatus: string) => {
    fetch(`/api/payments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(() => {
        fetchPayments();
      })
      .catch(err => {
        console.error('Error updating payment status:', err);
      });
  };

  const handleResetData = () => {
    setLoading(true);
    // Simulating database wipe and repopulation of mock data
    setTimeout(() => {
      setNotice('Hệ thống cơ sở dữ liệu đã được nạp sạch sẽ về mặc định 100 căn hộ mẫu OCP!');
      setLoading(false);
      fetchStats();
      fetchPayments();
    }, 1500);
  };

  const usersMock = [
    { username: 'admin', email: 'admin@vinhomes.vn', role: 'Quản trị viên', status: 'Active' },
    { username: 'duc_broker', email: 'phamvanducaa1@gmail.com', role: 'Môi giới chuyên nghiệp', status: 'Active' },
    { username: 'ha_chu_nha', email: 'hanh92@gmail.com', role: 'Chủ nhà ký gửi', status: 'Active' },
    { username: 'khach_an_danh', email: 'guest@oceanhomes.com', role: 'Khách vãng lai', status: 'Pending' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="admin-console">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start">
          <Settings className="w-6 h-6 text-cyan-400 mr-2.5" /> Bàn Kiểm Soát Quản Trị Hệ Thống
        </h1>
        <p className="text-xs text-slate-400 mt-1">Cấu hình các bộ tham số dự án, quyền truy cập tài khoản người dùng, và tích hợp mã bảo mật Gemini API.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Statistics and commands (Span 1) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-cyan-950 p-6 rounded-2xl space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center">
              <Shield className="w-4.5 h-4.5 text-cyan-400 mr-2" /> Trạng Thái Lưu Trữ
            </h3>

            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-950/60 text-xs text-slate-300 space-y-2">
              <div className="flex justify-between font-medium">
                <span>Dung lượng cơ sở dữ liệu:</span>
                <span className="text-cyan-400 font-bold">{dbLength} tin đang lưu</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Database Engine:</span>
                <span className="text-white font-bold">SQL In-Memory Runtime</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Tình trạng Server:</span>
                <span className="text-emerald-400 font-bold">● Đang hoạt động bình thường</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Mã bảo mật Gemini Key:</span>
                <span className="text-amber-500 font-bold">Chính xác (Đồng bộ)</span>
              </div>
            </div>

            {/* Reset actions */}
            <div className="pt-2">
              <button
                onClick={handleResetData}
                disabled={loading}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-red-950/60 hover:border-red-500 text-red-400 font-bold py-2.5 rounded-xl text-xs transition"
              >
                {loading ? 'Đang khởi chạy...' : 'RESET DỮ LIỆU GỐC (100 CĂN)'}
              </button>
            </div>

            {notice && (
              <p className="text-[10px] text-teal-400 bg-teal-950/20 border border-teal-900/30 p-2.5 rounded-lg">
                {notice}
              </p>
            )}
          </div>

          <div className="bg-slate-900 border border-cyan-950 p-6 rounded-2xl">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center">
              <Code className="w-4.5 h-4.5 text-cyan-400 mr-2" /> Tích Hợp API Đồng Bộ
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Hệ thống website đang được định vị thông minh qua khóa bảo mật server-side.
              Mọi tính năng Chatbot AI, Định giá tự động bán/cho thuê và Gợi ý tin rao độc quyền được cấp phép bảo vệ nghiêm ngặt giũ vững chất lượng hệ thống thông tin.
            </p>
          </div>
        </div>

        {/* User permissions list table (Span 2) */}
        <div className="lg:col-span-2 bg-slate-900 border border-cyan-950 p-6 rounded-2xl">
          <h3 className="text-white font-bold text-sm pb-4 border-b border-cyan-950/50 mb-4 flex items-center">
            🔐 Phân Quyền Người Dùng & Người Thừa Hành
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-300">
              <thead>
                <tr className="border-b border-cyan-950 pb-2 text-[10px] text-slate-400 uppercase">
                  <th className="py-2">Tên Tài Khoản (Email)</th>
                  <th className="py-2">Vai Trò Hệ Thống</th>
                  <th className="py-2 text-center">Tình Trạng</th>
                  <th className="py-2 text-right">Quyền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-950/20">
                {usersMock.map((usr, i) => (
                  <tr key={i} className="hover:bg-cyan-950/10">
                    <td className="py-3">
                      <strong className="text-white">{usr.username}</strong>
                      <span className="block text-[10px] text-slate-500">{usr.email}</span>
                    </td>
                    <td className="py-3 text-cyan-400 font-bold text-[11px]">{usr.role}</td>
                    <td className="py-3 text-center">
                      <span className="bg-emerald-400/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px]">
                        {usr.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-[10px] border border-cyan-950 hover:border-slate-800 text-slate-400 px-2.5 py-1 rounded">
                        Sửa quyền
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Real-time Deposits & Payments Manager Ledgers */}
      <div className="mt-8 bg-slate-900 border border-slate-700 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="text-left">
              <h3 className="text-slate-100 font-extrabold text-sm tracking-tight">Sổ Theo Dõi Đặt Cọc & Giao Dịch Trực Tuyến</h3>
              <p className="text-[10px] text-slate-400 font-medium">Báo cáo cập nhật luồng tiền, giữ căn độc quyền VIP & kiểm định kỹ thuật tại các phân khu.</p>
            </div>
          </div>
          <button 
            onClick={fetchPayments}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-[10px] uppercase tracking-wider font-extrabold text-slate-300 hover:text-cyan-500 hover:border-cyan-500 transition"
          >
            <span>TẢI LẠI TRẠNG THÁI</span>
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <span className="text-3xl">🏜️</span>
            <p className="text-xs text-slate-400 font-bold">Chưa có giao dịch thanh toán nào được ghi nhận trên hệ thống.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 pb-2 text-[10px] text-slate-400 uppercase font-black tracking-wider shadow-sm">
                  <th className="py-3">Mã Giao Dịch</th>
                  <th className="py-3">Khách Hàng (Email/SĐT)</th>
                  <th className="py-3">Dịch Vụ & Hạng Mục</th>
                  <th className="py-3">Căn Hộ Mục Tiêu</th>
                  <th className="py-3 text-right">Số Tiền (VND)</th>
                  <th className="py-3 text-center">Trạng Thái</th>
                  <th className="py-3 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((pay: any) => (
                  <tr key={pay.id} className="hover:bg-slate-950/25 transition">
                    <td className="py-3.5 font-mono text-[10px] font-extrabold text-cyan-600 tracking-wider">
                      {pay.transactionReference || 'OPH-PENDING'}
                    </td>
                    <td className="py-3.5">
                      <strong className="text-slate-100 block">{pay.clientName}</strong>
                      <span className="text-[10px] text-slate-400 block font-normal">{pay.clientPhone} • {pay.clientEmail}</span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase inline-block border tracking-wider ${
                        pay.paymentType === 'deposit_lock' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-inner'
                          : pay.paymentType === 'inspection_pack'
                          ? 'bg-cyan-600/10 text-cyan-600 border-cyan-500/20 shadow-inner'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {pay.paymentType === 'deposit_lock' ? 'Đặt cọc giữ căn (24h)' : pay.paymentType === 'inspection_pack' ? 'Kiểm định kỹ thuật' : 'Tư vấn pháp lý VIP'}
                      </span>
                      <span className="block text-[9px] text-slate-400 mt-1 font-normal italic truncate max-w-[170px]">{pay.note}</span>
                    </td>
                    <td className="py-3.5 max-w-[150px] truncate text-slate-200">
                      {pay.listingTitle || 'Dịch vụ tổng quan'}
                      <span className="block text-[9px] text-slate-500 font-normal">ID căn: {pay.listingId}</span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-cyan-600 text-[11px]">
                      {(pay.amount || 0).toLocaleString('vi-VN')} đ
                      <span className="block text-[8px] text-slate-400 font-normal mt-0.5">{pay.paymentMethod === 'bank_transfer' ? 'Quét QR' : 'Thẻ Visa'}</span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase leading-none border tracking-wider ${
                        pay.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : pay.status === 'failed'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {pay.status === 'success' ? 'Đã thu tiền' : pay.status === 'failed' ? 'Thất bại' : 'Đang xử lý'}
                      </span>
                      <span className="block text-[8px] text-slate-500 mt-1 font-normal">
                        {pay.createdAt ? new Date(pay.createdAt).toLocaleDateString('vi-VN') : 'Dự kiến'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-1 whitespace-nowrap">
                      {pay.status === 'pending' && (
                        <button
                          onClick={() => handleUpdatePaymentStatus(pay.id, 'success')}
                          className="text-[9px] font-extrabold uppercase tracking-widest border border-emerald-500 text-emerald-400 px-2 py-1 rounded bg-emerald-550/10 hover:bg-emerald-500 hover:text-slate-950 transition"
                        >
                          Duyệt thu
                        </button>
                      )}
                      {pay.status !== 'failed' && (
                        <button
                          onClick={() => handleUpdatePaymentStatus(pay.id, 'failed')}
                          className="text-[9px] font-extrabold uppercase tracking-widest border border-slate-850 hover:border-red-500 text-slate-400 hover:text-red-500 px-2 py-1 rounded transition"
                        >
                          Huỷ bỏ
                        </button>
                      )}
                      {pay.status === 'failed' && (
                        <button
                          onClick={() => handleUpdatePaymentStatus(pay.id, 'success')}
                          className="text-[9px] padding-x-2 font-extrabold uppercase tracking-widest border border-slate-850 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 px-2 py-1 rounded transition"
                        >
                          Khôi phục
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
