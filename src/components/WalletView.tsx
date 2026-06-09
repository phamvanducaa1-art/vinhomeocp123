import React from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Check, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Info, 
  Building, 
  RefreshCw, 
  DollarSign, 
  X, 
  User, 
  Lock, 
  FileText,
  AlertTriangle 
} from 'lucide-react';
import { Wallet, WalletTransaction } from '../types';

export default function WalletView() {
  const [wallet, setWallet] = React.useState<Wallet>({
    balance: 15300000,
    holderName: 'PHẠM VĂN ĐỨC',
    holderAccount: '0326246516',
    bankName: 'Techcombank'
  });
  const [history, setHistory] = React.useState<WalletTransaction[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [errorMess, setErrorMess] = React.useState<string>('');
  const [successMess, setSuccessMess] = React.useState<string>('');

  // Modals state
  const [isDepositOpen, setIsDepositOpen] = React.useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = React.useState(false);

  // Form states FOR DEPOSIT
  const [depositAmount, setDepositAmount] = React.useState<string>('5000000');
  const [depositMethod, setDepositMethod] = React.useState<'bank_transfer' | 'credit_card'>('bank_transfer');
  const [depCardNumber, setDepCardNumber] = React.useState('');
  const [depCardExpiry, setDepCardExpiry] = React.useState('');
  const [depCardCvv, setDepCardCvv] = React.useState('');
  const [depCardName, setDepCardName] = React.useState('PHAM VAN DUC');
  const [isDepProcessing, setIsDepProcessing] = React.useState(false);
  const [depSuccessTx, setDepSuccessTx] = React.useState<WalletTransaction | null>(null);

  // Form states FOR WITHDRAW
  const [withdrawAmount, setWithdrawAmount] = React.useState<string>('2000000');
  const [withdrawBank, setWithdrawBank] = React.useState('Techcombank');
  const [withdrawAccount, setWithdrawAccount] = React.useState('0326246516');
  const [withdrawHolder, setWithdrawHolder] = React.useState('PHAM VAN DUC');
  const [withdrawNote, setWithdrawNote] = React.useState('');
  const [isWthProcessing, setIsWthProcessing] = React.useState(false);
  const [wthSuccessTx, setWthSuccessTx] = React.useState<WalletTransaction | null>(null);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wallet');
      if (res.ok) {
        const data = await res.json();
        if (data && data.wallet) {
          setWallet(data.wallet);
        }
        if (data && Array.isArray(data.history)) {
          setHistory(data.history);
        } else {
          setHistory([]);
        }
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWallet();
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess('');
    const amt = Number(depositAmount);
    if (!amt || amt <= 0) {
      setErrorMess('Số tiền nạp không hợp lệ.');
      return;
    }

    setIsDepProcessing(true);
    // Simulate slight loading transition for beautiful UX
    await new Promise(r => setTimeout(r, 1500));

    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amt,
          method: depositMethod,
          bankName: depositMethod === 'bank_transfer' ? 'Techcombank' : 'Thẻ Tín Dụng',
          accountNumber: depositMethod === 'bank_transfer' ? '0326246516' : depCardNumber.slice(-4),
          note: `Nạp tiền ví OceanPark Homes qua ${depositMethod === 'bank_transfer' ? 'VietQR' : 'Credit Card'}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet);
        setHistory(data.history);
        setDepSuccessTx(data.transaction);
        setSuccessMess(`Đã nạp thành công ${amt.toLocaleString('vi-VN')} đ vào ví!`);
        // reset forms
        setDepCardNumber('');
        setDepCardExpiry('');
        setDepCardCvv('');
      } else {
        const errData = await res.json();
        setErrorMess(errData.error || 'Nạp tiền thất bại.');
      }
    } catch (err) {
      console.error(err);
      setErrorMess('Lỗi kết nối máy chủ.');
    } finally {
      setIsDepProcessing(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess('');
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setErrorMess('Số tiền rút không hợp lệ.');
      return;
    }

    if (amt > wallet.balance) {
      setErrorMess('Số dư khả dụng trong ví không đủ để rút số tiền này.');
      return;
    }

    setIsWthProcessing(true);
    // Simulate processing
    await new Promise(r => setTimeout(r, 1800));

    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amt,
          bankName: withdrawBank,
          accountNumber: withdrawAccount,
          accountHolder: withdrawHolder,
          note: withdrawNote || `Rút tiền về tài khoản ${withdrawBank}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet);
        setHistory(data.history);
        setWthSuccessTx(data.transaction);
        setSuccessMess(`Đã gửi yêu cầu rút tiền thành công ${amt.toLocaleString('vi-VN')} đ!`);
        setWithdrawNote('');
      } else {
        const errData = await res.json();
        setErrorMess(errData.error || 'Rút tiền thất bại.');
      }
    } catch (err) {
      console.error(err);
      setErrorMess('Lỗi kết nối hệ thống.');
    } finally {
      setIsWthProcessing(false);
    }
  };

  const handleCardNumberChange = (val: string) => {
    const sanit = val.replace(/\D/g, '').substring(0, 16);
    const parts = sanit.match(/.{1,4}/g);
    setDepCardNumber(parts ? parts.join(' ') : sanit);
  };

  const handleExpiryChange = (val: string) => {
    const sanit = val.replace(/\D/g, '').substring(0, 4);
    if (sanit.length >= 2) {
      setDepCardExpiry(`${sanit.substring(0, 2)}/${sanit.substring(2, 4)}`);
    } else {
      setDepCardExpiry(sanit);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left">
      
      {/* Upper Title Description block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-cyan-950/40 pb-5">
        <div>
          <span className="text-[10px] bg-cyan-950 text-cyan-400 font-extrabold border border-cyan-800 px-2.5 py-1 rounded-full tracking-widest uppercase inline-block mb-2">
            VÍ ĐIỆN TỬ THÔNG MINH
          </span>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Cổng Tài Khoản & Ví Ký Quỹ</h1>
          <p className="text-xs text-slate-400 font-medium">Bảo lãnh dòng tiền cọc giữ căn hộ, rút tiền hoa hồng môi giới & nạp tiền quảng cáo VIP tự động.</p>
        </div>
        <button 
          onClick={fetchWallet}
          className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-xs tracking-wider font-extrabold text-slate-300 hover:text-cyan-400 hover:border-cyan-500 transition-all shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>CẬP NHẬT SỐ DƯ</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-cyan-500 animate-spin rounded-full"></div>
          <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Đang đối soát cổng tài khoản ví...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: WALLET CARD INFO + GENERAL STATS */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Visual Glassmorphic Gold/Platinum Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 border border-cyan-950/80 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[230px]">
              {/* Subtle background glow ornaments */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start z-10">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none block">TÀI KHOẢN VÍ TỔNG</span>
                  <span className="text-[10px] text-cyan-400 font-bold font-mono tracking-wider">MÃ ID: {wallet.holderAccount}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/30 to-amber-500/10 border border-cyan-800/40 flex items-center justify-center">
                  <WalletIcon className="w-4 h-4 text-cyan-400" />
                </div>
              </div>

              <div className="space-y-1.5 z-10 text-left">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide font-extrabold block">Số Dư Khả Dụng</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl font-black text-slate-100 tracking-tight font-sans">
                    {wallet.balance.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs font-black text-cyan-500">VND</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-slate-900 pt-4 z-10">
                <div className="text-left">
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-wide block">Chủ ví</span>
                  <span className="text-xs font-extrabold text-slate-300 font-mono uppercase">{wallet.holderName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-wide block">Đã xác minh</span>
                  <span className="text-[10px] font-black text-emerald-400 flex items-center justify-end space-x-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>PREMIUM</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action triggers */}
            <div className="grid grid-cols-2 gap-3.5">
              <button
                onClick={() => {
                  setDepSuccessTx(null);
                  setSuccessMess('');
                  setErrorMess('');
                  setIsDepositOpen(true);
                }}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-100 hover:text-white font-extrabold py-3.5 px-4 rounded-xl text-xs tracking-wider transition uppercase shadow-lg shadow-cyan-950/20"
              >
                <ArrowDownLeft className="w-4 h-4 text-slate-950 shrink-0 bg-white rounded-full p-0.5" />
                <span>NẠP TIỀN</span>
              </button>

              <button
                onClick={() => {
                  setWthSuccessTx(null);
                  setSuccessMess('');
                  setErrorMess('');
                  setIsWithdrawOpen(true);
                }}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-slate-100 hover:text-white font-extrabold py-3.5 px-4 rounded-xl text-xs tracking-wider transition uppercase shadow-lg shadow-amber-950/20"
              >
                <ArrowUpRight className="w-4 h-4 text-slate-950 shrink-0 bg-white rounded-full p-0.5" />
                <span>RÚT TIỀN</span>
              </button>
            </div>

            {/* Info warning alert box */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-left space-y-2.5">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Info className="w-4 h-4" />
                <h4 className="text-xs font-black uppercase tracking-wider">Hỗ Trợ Đại Lý & Khách Hàng</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Quý khách có thể nạp tiền để giữ chỗ giữ căn hộ trực tuyến nhanh nhất, hoa hồng sẽ được cổng đối soát tự động chi trả trực tiếp sau khi hoàn tất thủ tục bàn giao.
              </p>
            </div>

          </div>

          {/* MAIN COLUMN RIGHT: WALLET TRANSACTION HISTORICAL TABLES */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl space-y-5">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-850">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-600/10 border border-cyan-850 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-200 tracking-tight">Sổ Nhật Ký Biến Động Số Dư Ví</h3>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-2 py-1 rounded">
                {history.length} giao dịch
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-16 space-y-3.5">
                <span className="text-4xl block">🏜️</span>
                <p className="text-xs text-slate-400 font-bold">Chưa có giao dịch hoa hồng hay nạp rút nào được ký ghi.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-850 text-[10px] text-slate-400 uppercase font-black tracking-wider shadow-sm">
                      <th className="pb-3 text-left">Mã Giao Dịch</th>
                      <th className="pb-3">Phân loại</th>
                      <th className="pb-3">Thông Tin Tài Khoản</th>
                      <th className="pb-3 text-right">Số Tiền (đ)</th>
                      <th className="pb-3 text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60">
                    {history.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-950/20 transition">
                        <td className="py-4">
                          <span className="font-mono text-[10px] font-extrabold text-cyan-600 tracking-wider block">
                            {tx.transactionReference}
                          </span>
                          <span className="text-[9px] text-slate-500 font-normal">
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : 'Mới đây'}
                          </span>
                        </td>
                        
                        <td className="py-4">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border leading-none ${
                            tx.type === 'deposit'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {tx.type === 'deposit' ? (
                              <>
                                <ArrowDownLeft className="w-2.5 h-2.5" />
                                <span>NẠP TIỀN</span>
                              </>
                            ) : (
                              <>
                                <ArrowUpRight className="w-2.5 h-2.5" />
                                <span>RÚT TIỀN</span>
                              </>
                            )}
                          </span>
                        </td>

                        <td className="py-4 font-normal">
                          <strong className="text-slate-200 block text-xs">
                            {tx.type === 'deposit' ? 'Qua chuyển khoản' : `Cá nhân rút: ${tx.accountHolder || wallet.holderName}`}
                          </strong>
                          <span className="text-[10px] text-slate-450 block font-medium truncate max-w-[200px]">
                            {tx.bankName} • Số tài khoản: {tx.accountNumber}
                          </span>
                          {tx.note && (
                            <span className="text-[9px] text-slate-500 block italic mt-1 font-normal">
                              "{tx.note}"
                            </span>
                          )}
                        </td>

                        <td className="py-4 text-right">
                          <span className={`text-[12px] font-black font-sans ${
                            tx.type === 'deposit' ? 'text-emerald-400' : 'text-amber-500'
                          }`}>
                            {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}
                          </span>
                          <span className="block text-[8px] text-slate-500 font-normal">đ</span>
                        </td>

                        <td className="py-4 text-center">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded leading-none tracking-widest">
                            {tx.status === 'success' ? 'THÀNH CÔNG' : 'ĐANG XỬ LÝ'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================= MODAL 1: DEPOSIT FUNDING (NẠP TIỀN) ================= */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl flex flex-col overflow-hidden shadow-2xl relative my-8 animate-fade-in text-left">
            
            {/* Header */}
            <div className="bg-slate-850 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ArrowDownLeft className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-sm text-slate-100 tracking-tight">Nạp Tiền Giao Dịch / Ký Quỹ</h3>
              </div>
              <button 
                onClick={() => setIsDepositOpen(false)}
                className="text-slate-400 hover:text-cyan-500 p-1 bg-slate-950/20 hover:bg-slate-950/50 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {depSuccessTx ? (
                /* Success Layout */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Check className="w-7 h-7 text-slate-950 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-100 text-sm">Giao Dịch Nạp Tiền Hoàn Tất!</h4>
                    <p className="text-xs text-slate-400">Hệ thống đã tự động ghi nhận số tiền và gia tăng số dư khả dụng ví.</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2.5 max-w-sm mx-auto leading-relaxed">
                    <div className="flex justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-450 uppercase text-[9px] font-bold">Mã giao dịch</span>
                      <span className="font-mono text-cyan-400 font-extrabold">{depSuccessTx.transactionReference}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-450 uppercase text-[9px] font-bold">Hình thức</span>
                      <span className="text-slate-200">{depSuccessTx.method === 'bank_transfer' ? 'Chuyển khoản VietQR' : 'Thẻ Tín dụng Quốc tế'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase text-[9px] font-bold">Số tiền</span>
                      <span className="font-black text-emerald-400">{depSuccessTx.amount.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDepositOpen(false)}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-extrabold text-xs tracking-wider rounded-xl uppercase hover:opacity-95 text-center mt-2.5"
                  >
                    Đóng lại
                  </button>
                </div>
              ) : (
                /* Form Inputs */
                <form onSubmit={handleDeposit} className="space-y-5">
                  
                  {/* Select amount inputs */}
                  <div>
                    <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Hạn mức / Số tiền muốn nạp (đ)</label>
                    <input
                      type="number"
                      required
                      min="100000"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Ví dụ: 10,000,000"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-black text-sm rounded-xl py-2.5 px-3.5 focus:border-cyan-500 outline-none"
                    />

                    {/* Fast selects */}
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {['1000000', '5000000', '10000000', '50000000'].map((sum) => (
                        <button
                          key={sum}
                          type="button"
                          onClick={() => setDepositAmount(sum)}
                          className={`py-1.5 rounded-lg border text-[10px] font-bold tracking-wider uppercase transition ${
                            depositAmount === sum
                              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                              : 'bg-slate-950 border-slate-850 hover:bg-slate-950 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {(Number(sum) / 1000000)}Tr đ
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment option selector tabs */}
                  <div>
                    <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Phương thức nạp bảo mật</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
                      <button
                        type="button"
                        onClick={() => setDepositMethod('bank_transfer')}
                        className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
                          depositMethod === 'bank_transfer'
                            ? 'bg-cyan-600 text-slate-950 shadow-inner'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Quét VietQR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositMethod('credit_card')}
                        className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
                          depositMethod === 'credit_card'
                            ? 'bg-cyan-600 text-slate-950 shadow-inner'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Thẻ Quốc Tế Visa</span>
                      </button>
                    </div>
                  </div>

                  {/* DYNAMIC METOD DETAIL */}
                  {depositMethod === 'bank_transfer' ? (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row items-center gap-5">
                      
                      {/* Gold design VietQR */}
                      <div className="bg-white p-2.5 border-2 border-cyan-500 rounded-xl relative shrink-0">
                        <div className="w-[110px] h-[110px] bg-slate-100 flex flex-col justify-center items-center rounded relative">
                          <span className="w-8 h-8 border-4 border-slate-900 flex items-center justify-center font-black text-slate-950 text-xs">QR</span>
                          <span className="text-[6px] tracking-widest text-slate-400 mt-1 font-bold">VIETQR.VN</span>
                        </div>
                      </div>

                      {/* Detail Transfer Account */}
                      <div className="space-y-2 text-xs w-full">
                        <div className="flex justify-between border-b border-slate-850 pb-1.5 font-semibold">
                          <span className="text-slate-450">Ngân hàng thụ hưởng:</span>
                          <span className="text-slate-200">Techcombank (TCB)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-850 pb-1.5 font-semibold">
                          <span className="text-slate-450">Số Tài khoản:</span>
                          <span className="text-cyan-500 font-mono tracking-wider font-extrabold select-all">0326246516</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-850 pb-1.5 font-semibold">
                          <span className="text-slate-450">Chủ tài khoản:</span>
                          <span className="text-slate-200 uppercase font-bold">PHAM VAN DUC</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-450">Nội dung bắt buộc:</span>
                          <span className="text-amber-500 font-mono font-extrabold select-all bg-amber-550/10 px-1.5 py-0.5 rounded border border-amber-500/10 uppercase">
                            OPH NAP {wallet.holderAccount}
                          </span>
                        </div>

                        <span className="block text-[9px] text-amber-500 font-medium">
                          ⚠️ Hệ thống dò quét giao dịch tự động. Trạng thái cọc ví sẽ được xử lý kích hoạt tự động sau 30-45 giây.
                        </span>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                      <div>
                        <label className="block text-slate-400 text-[10px] font-extrabold uppercase mb-1">Họ tên in nổi trên thẻ</label>
                        <input
                          type="text"
                          required
                          value={depCardName}
                          onChange={(e) => setDepCardName(e.target.value)}
                          placeholder="NGUYEN VAN A"
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl py-2 px-3 focus:border-cyan-500 uppercase font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] font-extrabold uppercase mb-1">Số thẻ tín dụng</label>
                        <input
                          type="text"
                          required
                          value={depCardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="4221 5590 1029 4580"
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl py-2 px-3 focus:border-cyan-500 font-mono font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-slate-400 text-[10px] font-extrabold uppercase mb-1">Ngày hết hạn</label>
                          <input
                            type="text"
                            required
                            value={depCardExpiry}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl py-2 focus:border-cyan-500 font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-[10px] font-extrabold uppercase mb-1">Mã CVV bảo mật</label>
                          <input
                            type="password"
                            required
                            value={depCardCvv}
                            onChange={(e) => setDepCardCvv(e.target.value.substring(0, 3))}
                            placeholder="•••"
                            className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl py-2 focus:border-cyan-500 font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {errorMess && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-2 text-rose-450 text-[11px] font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMess}</span>
                    </div>
                  )}

                  {/* Submission row */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isDepProcessing}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-500 text-slate-950 font-extrabold text-xs tracking-wider rounded-xl uppercase hover:opacity-95 flex items-center space-x-2 shadow-glowing transition"
                    >
                      {isDepProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                          <span>ĐANG XỬ LÝ...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-slate-950" />
                          <span>XÁC NHẬN NẠP {Number(depositAmount).toLocaleString('vi-VN')} đ</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: WITHDRAWAL REQUEST (RÚT TIỀN) ================= */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl flex flex-col overflow-hidden shadow-2xl relative my-8 animate-fade-in text-left">
            
            {/* Header */}
            <div className="bg-slate-850 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-sm text-slate-100 tracking-tight">Rút Tiền Ví Điện Tử Về Tài Khoản</h3>
              </div>
              <button 
                onClick={() => setIsWithdrawOpen(false)}
                className="text-slate-400 hover:text-cyan-500 p-1 bg-slate-950/20 hover:bg-slate-950/50 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {wthSuccessTx ? (
                /* Success Layout */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Check className="w-7 h-7 text-slate-950 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-100 text-sm">Giao Dịch Rút Tiền Thành Công!</h4>
                    <p className="text-xs text-slate-400">Giao dịch gốc đã được giải ngân tức thời về tài khoản thụ hưởng đăng ký của quý khách.</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2.5 max-w-sm mx-auto leading-relaxed">
                    <div className="flex justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-450 uppercase text-[9px] font-bold">Mã đối soát</span>
                      <span className="font-mono text-cyan-400 font-extrabold">{wthSuccessTx.transactionReference}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-450 uppercase text-[9px] font-bold">Ngân hàng nhận</span>
                      <span className="text-slate-200 font-bold">{wthSuccessTx.bankName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-450 uppercase text-[9px] font-bold">Số tài khoản</span>
                      <span className="text-slate-200 font-mono">{wthSuccessTx.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase text-[9px] font-bold">Số tiền rút thực lĩnh</span>
                      <span className="font-black text-amber-500">{wthSuccessTx.amount.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsWithdrawOpen(false)}
                    className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-extrabold text-xs tracking-wider rounded-xl uppercase hover:opacity-95 text-center mt-2.5"
                  >
                    Đóng lại
                  </button>
                </div>
              ) : (
                /* Withdrawal requests form inputs */
                <form onSubmit={handleWithdraw} className="space-y-4">
                  
                  {/* Current Balance Reminder Card */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Số dư khả dụng hiện tại:</span>
                    <strong className="text-cyan-500 text-sm font-black font-sans">{wallet.balance.toLocaleString('vi-VN')} đ</strong>
                  </div>

                  {/* Amount to withdraw */}
                  <div>
                    <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Số tiền cần rút khỏi ví (đ) <span className="text-amber-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="50000"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Ví dụ: 2000000"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-black text-xs rounded-xl py-2.5 px-3.5 focus:border-cyan-500 outline-none"
                    />
                    
                    <div className="flex justify-end mt-1 text-[10px] text-slate-500">
                      <button 
                        type="button" 
                        onClick={() => setWithdrawAmount(wallet.balance.toString())}
                        className="hover:text-cyan-400 font-semibold"
                      >
                        ⚡ Rút tối đa (Toàn bộ số dư)
                      </button>
                    </div>
                  </div>

                  {/* Bank list choose */}
                  <div>
                    <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Ngân hàng thụ hưởng <span className="text-amber-500">*</span></label>
                    <select
                      value={withdrawBank}
                      onChange={(e) => setWithdrawBank(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-2.5 px-3 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Techcombank">Techcombank (TCB)</option>
                      <option value="Vietcombank">Vietcombank (VCB)</option>
                      <option value="MB Bank">Ngân hàng Quân Đội (MB)</option>
                      <option value="BIDV">Ngân hàng Đầu tư và Phát triển (BIDV)</option>
                      <option value="VIB">Ngân hàng Quốc tế (VIB)</option>
                      <option value="TPBank">Tên Phong Bank (TPB)</option>
                    </select>
                  </div>

                  {/* Account number */}
                  <div>
                    <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Số tài khoản nhận tiền <span className="text-amber-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={withdrawAccount}
                      onChange={(e) => setWithdrawAccount(e.target.value)}
                      placeholder="190352..."
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-2.5 px-3 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                    />
                  </div>

                  {/* Holder Name */}
                  <div>
                    <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Tên chủ tài khoản thụ hưởng <span className="text-amber-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={withdrawHolder}
                      onChange={(e) => setWithdrawHolder(e.target.value.toUpperCase())}
                      placeholder="PHAM VAN DUC"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-2.5 px-3 focus:outline-none focus:border-cyan-500 font-mono font-bold uppercase"
                    />
                  </div>

                  {/* Reason/memo */}
                  <div>
                    <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Lý do / Mô tả rút tiền</label>
                    <textarea
                      value={withdrawNote}
                      onChange={(e) => setWithdrawNote(e.target.value)}
                      placeholder="Ví dụ: Rút tiền rút hoa hồng giao dịch căn hộ Masteri Waterfront"
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-cyan-500 resize-none font-medium leading-relaxed"
                    />
                  </div>

                  {errorMess && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-2 text-rose-450 text-[11px] font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMess}</span>
                    </div>
                  )}

                  {/* Submission row */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isWthProcessing}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-extrabold text-xs tracking-wider rounded-xl uppercase hover:opacity-95 flex items-center space-x-2 shadow-glowing transition"
                    >
                      {isWthProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                          <span>ĐANG KHỞI TẠO ĐƠN CHUYỂN...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                          <span>RÚT {Number(withdrawAmount).toLocaleString('vi-VN')} đ</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
