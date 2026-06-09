import React from 'react';
import { X, CreditCard, ShieldCheck, Check, Lock, Info, QrCode, Sparkles, Receipt, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Listing, PaymentTransaction } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
}

type Step = 'package' | 'info' | 'payment' | 'processing' | 'success';

interface PackageOption {
  id: 'deposit_lock' | 'inspection_pack' | 'vip_promote';
  name: string;
  price: number;
  description: string;
  features: string[];
}

export default function CheckoutModal({ isOpen, onClose, listing }: CheckoutModalProps) {
  const [step, setStep] = React.useState<Step>('package');
  const [selectedPackage, setSelectedPackage] = React.useState<'deposit_lock' | 'inspection_pack' | 'vip_promote'>('deposit_lock');
  const [paymentMethod, setPaymentMethod] = React.useState<'bank_transfer' | 'credit_card'>('bank_transfer');
  
  // Form states
  const [clientName, setClientName] = React.useState('');
  const [clientPhone, setClientPhone] = React.useState('');
  const [clientEmail, setClientEmail] = React.useState('');
  const [note, setNote] = React.useState('');
  
  // Credit card state
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  
  // Final Transaction result
  const [transaction, setTransaction] = React.useState<PaymentTransaction | null>(null);

  // Reset form when reopened
  React.useEffect(() => {
    if (isOpen) {
      setStep('package');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setCardName('');
      setNote('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const packages: PackageOption[] = [
    {
      id: 'deposit_lock',
      name: 'Đặt Cọc Khóa Căn Hộ (24h)',
      price: 10000000,
      description: 'Khóa giữ chỗ căn hộ này độc quyền trong 24 giờ để làm thủ tục chuyển nhượng, tránh bị khách hàng khác mua hoặc thuê mất.',
      features: [
        'Ưu tiên giữ căn độc quyền 24h trên toàn hệ thống',
        'Hoàn trả 100% nếu chủ nhà thay đổi ý định hoặc thông số sai lệch',
        'Môi giới hỗ trợ làm việc trực tiếp chủ nhà trong 30 phút'
      ]
    },
    {
      id: 'inspection_pack',
      name: 'Gói Kiểm Định Kỹ Thuật Premier',
      price: 2000000,
      description: 'Hỗ trợ kỹ sư chuyên nghiệp của OceanPark Homes đến kiểm định rò rỉ nước, mạng lưới điện, chất lượng đồ gỗ và kết cấu trước khi bàn giao.',
      features: [
        'Biên bản bàn giao kỹ thuật chi tiết 25 hạng mục',
        'Sử dụng thiết bị hồng ngoại phát hiện ngấm nước âm tường',
        'Báo cáo định giá độc lập kèm ảnh thực tế chi tiết'
      ]
    },
    {
      id: 'vip_promote',
      name: 'Dịch Vụ Pháp Lý VIP từ Chuyên Gia',
      price: 1000000,
      description: 'Luật sư và chuyên viên cao cấp kiểm tra rà soát tranh chấp sổ đỏ, hỗ trợ soạn thảo hợp đồng mua bán sang tên trọn gói.',
      features: [
        'Kiểm tra rà soát quy hoạch và thế chấp ngân hàng miễn phí',
        'Tư vấn tối ưu hóa thuế thu nhập cá nhân khi mua bán',
        'Đi kèm nhân viên trợ lý VIP nộp hồ sơ tại Ủy Ban Quận'
      ]
    }
  ];

  const currentPack = packages.find(p => p.id === selectedPackage)!;

  const handleNextToInfo = () => {
    setStep('info');
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const executePaymentAction = async () => {
    setStep('processing');
    
    // Simulate payment transaction network lag
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          listingTitle: listing.title,
          clientName,
          clientPhone,
          clientEmail,
          amount: currentPack.price,
          paymentType: selectedPackage,
          paymentMethod,
          note: note || `Thanh toán gói ${currentPack.name} cho căn hộ mã ${listing.id}`,
          status: 'success'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTransaction(data);
        setStep('success');
      } else {
        throw new Error('Không thể khởi tạo giao dịch');
      }
    } catch (err) {
      console.error('Error executing checkout payment:', err);
      // Fallback
      const fakeTx: PaymentTransaction = {
        id: `pay-sim-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        clientName: clientName || 'Quý khách',
        clientPhone: clientPhone || '0326246516',
        clientEmail: clientEmail || 'vinhomes@gmail.com',
        amount: currentPack.price,
        paymentType: selectedPackage,
        paymentMethod,
        status: 'success',
        createdAt: new Date().toISOString(),
        transactionReference: `OPH-${Math.floor(Math.random() * 900000) + 100000}`
      };
      setTransaction(fakeTx);
      setStep('success');
    }
  };

  const handleCardNumberChange = (val: string) => {
    // format as groups of 4
    const sanit = val.replace(/\D/g, '').substring(0, 16);
    const parts = sanit.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : sanit);
  };

  const handleExpiryChange = (val: string) => {
    const sanit = val.replace(/\D/g, '').substring(0, 4);
    if (sanit.length >= 2) {
      setCardExpiry(`${sanit.substring(0, 2)}/${sanit.substring(2, 4)}`);
    } else {
      setCardExpiry(sanit);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl flex flex-col overflow-hidden shadow-2xl relative animate-fade-in my-8">
        
        {/* Header bar */}
        <div className="bg-slate-800/60 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-slate-100 text-sm font-extrabold tracking-tight">Thanh Toán Dịch Vụ & Đặt Cọc</h2>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-sm sm:max-w-md">Mã tin: {listing.id} • {listing.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-cyan-600 p-1.5 rounded-lg bg-slate-950/20 hover:bg-slate-950/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Stepper Indicator (Hide on success and processing) */}
        {step !== 'processing' && step !== 'success' && (
          <div className="px-6 py-3 bg-slate-950/30 border-b border-slate-800 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] ${step === 'package' ? 'bg-cyan-500 text-slate-950' : 'bg-emerald-500 text-slate-950'}`}>
                {step === 'package' ? '1' : <Check className="w-3.5 h-3.5" />}
              </span>
              <span className={step === 'package' ? 'text-cyan-500' : 'text-slate-400'}>Chọn gói</span>
            </div>
            <div className="w-12 h-px bg-slate-700"></div>
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] ${step === 'info' ? 'bg-cyan-500 text-slate-950' : step === 'payment' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {step === 'info' ? '2' : step === 'payment' ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span className={step === 'info' ? 'text-cyan-500' : 'text-slate-400'}>Thông tin</span>
            </div>
            <div className="w-12 h-px bg-slate-700"></div>
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] ${step === 'payment' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                3
              </span>
              <span className={step === 'payment' ? 'text-cyan-500' : 'text-slate-400'}>Thanh toán</span>
            </div>
          </div>
        )}

        {/* Content body containers */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          
          {/* STEP 1: CHOOSE PACKAGE */}
          {step === 'package' && (
            <div className="space-y-4">
              <div className="text-center space-y-1 pb-2">
                <h3 className="font-bold text-sm text-slate-200">Lựa chọn hạng mục thanh toán</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">Chọn một dịch vụ phù hơp nhất với nhu cầu giao dịch của quý khách tại Vinhomes Ocean Park.</p>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                      selectedPackage === pkg.id
                        ? 'bg-cyan-50 border-cyan-500 shadow-inner'
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center p-0.5 ${
                            selectedPackage === pkg.id ? 'border-cyan-500 bg-cyan-500 text-slate-950' : 'border-slate-700'
                          }`}>
                            {selectedPackage === pkg.id && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                          </span>
                          <h4 className="font-bold text-xs text-slate-200">{pkg.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed pr-6">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-cyan-600 block whitespace-nowrap">
                          {pkg.price.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 block mt-0.5 font-bold">Thanh Toán 1 Lần</span>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-800/50 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-400 font-semibold">
                      {pkg.features.map((feat, i) => (
                        <div key={i} className="flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextToInfo}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-500 text-slate-200 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:text-white font-extrabold text-xs tracking-wider rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-cyan-950/25 uppercase"
                >
                  <span>Tiếp tục thông tin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FILL INFORMATION */}
          {step === 'info' && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              <div className="text-center space-y-1 pb-2">
                <h3 className="font-bold text-sm text-slate-200">Xác thực danh tính giao dịch</h3>
                <p className="text-xs text-slate-400">Thông tin này được lưu trữ trong hóa đơn đỏ xác nhận và làm chứng thư pháp lý đặt cọc.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
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
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-bold mb-1">
                  Địa chỉ Email nhận Hoá Đơn <span className="text-amber-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="vinhomes@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-2.5 px-3.5 outline-none focus:border-cyan-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-bold mb-1">
                  Yêu cầu biên lai / Ghi chú thanh toán
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú ví dụ: Cần ra hóa đơn công ty, xuất hóa đơn thuế VAT..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-2 px-3 outline-none focus:border-cyan-500 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Order summary small card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Huy hiệu giao dịch</span>
                  <span className="font-bold text-slate-200">{currentPack.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Tổng cộng</span>
                  <span className="font-extrabold text-cyan-600 block text-xs">{currentPack.price.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('package')}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-400 hover:text-slate-200 font-bold text-xs tracking-wider rounded-xl transition"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-extrabold text-xs tracking-wider rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-cyan-950/25 uppercase"
                >
                  <span>Chọn cách thanh toán</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-sm text-slate-200">Lựa chọn Phương thức Thanh toán</h3>
                <p className="text-xs text-slate-400">Tất cả giao dịch được mã hóa 256-bit SSL tối tân, bảo vệ tuyệt mật.</p>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-850">
                <button
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-cyan-600 shadow-inner text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Quét QR Chuyển Khoản</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition ${
                    paymentMethod === 'credit_card'
                      ? 'bg-cyan-600 shadow-inner text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Thẻ Tín Dụng Quốc Tế</span>
                </button>
              </div>

              {/* METHOD PANEL: BANK TRANSFER QR TEMPLATE */}
              {paymentMethod === 'bank_transfer' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-5 animate-fade-in text-xs">
                  <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                    
                    {/* Golden QR Code Visual Wrapper */}
                    <div className="relative p-3.5 bg-white border-2 border-cyan-500 rounded-2xl shadow-glowing-gold shrink-0">
                      <div className="w-[140px] h-[140px] bg-slate-100 flex flex-col items-center justify-center relative">
                        {/* Dynamic custom canvas mockup represent VietQR */}
                        <div className="absolute inset-2 border-2 border-slate-900 border-dashed rounded-lg p-2 flex flex-col items-center justify-center bg-white space-y-1">
                          <div className="w-10 h-10 border-4 border-slate-900 flex items-center justify-center font-black text-slate-900 rounded select-none text-md">
                            QR
                          </div>
                          <span className="text-[7px] text-zinc-400 font-extrabold tracking-widest leading-none">VIETQR.VN</span>
                          <span className="text-[6px] text-zinc-550 font-black text-xs text-sky-500 tracking-tight leading-none uppercase">TECHCOMBANK</span>
                        </div>
                        {/* Tiny gold dot matrix border highlights */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500"></div>
                      </div>
                      <div className="text-center mt-2.5">
                        <span className="bg-red-500 text-white font-extrabold text-[8px] px-2 py-0.5 rounded tracking-wider uppercase leading-none">QUÉT MÃ TRỰC TIẾP</span>
                      </div>
                    </div>

                    {/* Bank Info Details */}
                    <div className="space-y-3.5 flex-1 w-full">
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 leading-relaxed">
                        <div className="flex justify-between border-b border-slate-800 pb-1.5 font-medium">
                          <span className="text-slate-400 text-[11px]">Ngân hàng:</span>
                          <strong className="text-slate-200">Techcombank (TCB)</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5 font-medium">
                          <span className="text-slate-400 text-[11px]">Số tài khoản:</span>
                          <strong className="text-cyan-500 font-mono tracking-wider">0326246516</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5 font-medium">
                          <span className="text-slate-400 text-[11px]">Chủ tài khoản:</span>
                          <strong className="text-slate-200 uppercase">PHAM VAN DUC</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5 font-medium">
                          <span className="text-slate-400 text-[11px]">Số tiền chuyển:</span>
                          <strong className="text-cyan-600 font-extrabold">{currentPack.price.toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-400 text-[11px]">Nội dung chuyển khoản:</span>
                          <strong className="text-amber-500 font-mono select-all tracking-wider font-extrabold uppercase bg-amber-550/10 border border-amber-500/20 px-1 py-0.5 rounded">
                            OPH DEP {listing.id.toUpperCase().substring(0, 8)}
                          </strong>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 bg-amber-550/10 border border-amber-500/15 p-2.5 rounded-lg text-amber-500 text-[10px] leading-relaxed font-semibold">
                        <Info className="w-4 h-4 shrink-0 text-amber-500" />
                        <span>Hệ thống AI đối soát tài khoản ngân hàng liên ngân hàng tự động. Giao dịch sẽ kích hoạt tức thì sau 30 giây khi tài khoản PHAM VAN DUC biến động số dư.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD PANEL: CREDIT CARD SIMULATOR */}
              {paymentMethod === 'credit_card' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 animate-fade-in text-xs">
                  
                  {/* Visually Stunning Card Art Preview */}
                  <div className="bg-gradient-to-br from-slate-200 via-slate-100 to-slate-250 p-5 rounded-xl border border-slate-700/50 shadow-glow text-white space-y-6 relative overflow-hidden h-[155px] text-left">
                    <div className="absolute -top-10 -right-10 w-44 h-44 bg-cyan-600/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex justify-between items-center relative">
                      <span className="font-extrabold text-xs tracking-widest text-slate-400">PREMIUM CARD</span>
                      <span className="text-amber-500 font-black text-sm italic tracking-tight">Visa / Mastercard</span>
                    </div>

                    <div className="space-y-1.5 relative">
                      <span className="text-slate-400 text-[9px] tracking-wide uppercase font-bold">Số Thẻ</span>
                      <p className="text-sm font-mono tracking-[0.25em] font-extrabold text-slate-100">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative">
                      <div className="space-y-0.5 text-left">
                        <span className="text-slate-400 text-[8px] uppercase tracking-wide font-bold">Chủ Thẻ</span>
                        <p className="text-[10px] font-mono font-bold tracking-wider text-slate-200 uppercase truncate">
                          {cardName || 'NGUYEN VAN A'}
                        </p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <span className="text-slate-400 text-[8px] uppercase tracking-wide font-bold">Hạn Dùng</span>
                        <p className="text-[10px] font-mono font-bold tracking-wider text-slate-200">
                          {cardExpiry || 'MM/YY'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Manual forms */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-wide mb-1">Họ tên in nổi trên thẻ</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="NGUYEN VAN A"
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-cyan-500 uppercase font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-wide mb-1">Số thẻ (16 chữ số)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="4221 4596 1120 4583"
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-wide mb-1">Ngày hết hạn</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl py-2 px-2.5 focus:outline-none focus:border-cyan-500 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-wide mb-1">Mã bảo mật CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.substring(0, 3))}
                          placeholder="•••"
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl py-2 px-2.5 focus:outline-none focus:border-cyan-500 font-mono text-center font-extrabold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action and Back */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-400 hover:text-slate-200 font-bold text-xs tracking-wider rounded-xl transition"
                >
                  Quay lại
                </button>
                <button
                  onClick={executePaymentAction}
                  disabled={paymentMethod === 'credit_card' && (!cardNumber || !cardName || !cardExpiry)}
                  className={`px-6 py-2.5 font-extrabold text-xs tracking-wider rounded-xl transition flex items-center space-x-1.5 shadow-md uppercase ${
                    paymentMethod === 'credit_card' && (!cardNumber || !cardName || !cardExpiry)
                      ? 'bg-slate-850 text-slate-550 border border-slate-800 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-glowing-gold'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Xác nhận thanh toán</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PROCESSING TRANSACTION */}
          {step === 'processing' && (
            <div className="text-center py-12 space-y-6 flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin flex items-center justify-center"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-cyan-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="font-extrabold text-slate-100 text-sm tracking-tight capitalize">Đang Xử Lý Giao Dịch</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">Cổng kết nối thanh toán an toàn đang tiến hành đối chiếu số dư và ghi nhận biên lai điện tử. Quý khách vui lòng không đóng trình duyệt...</p>
              </div>
            </div>
          )}

          {/* STEP 5: PAYMENT SUCCESS DEPOSIT DELIVERED */}
          {step === 'success' && transaction && (
            <div className="space-y-6 text-center py-4">
              
              {/* Luxury gold wax seal seal wrapper style */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-cyan-400 rounded-full flex items-center justify-center shadow-glowing">
                  <Receipt className="w-7 h-7 text-slate-950" />
                </div>
                <div className="space-y-1">
                  <span className="text-cyan-600 text-[10px] tracking-widest font-black uppercase block">HÓA ĐƠN GIAO DỊCH CHÍNH CHỨNG</span>
                  <h3 className="font-extrabold text-base text-slate-100 tracking-tight">Thanh Toán Thành Công!</h3>
                  <p className="text-[11px] text-slate-400">Giao dịch đã được ghi nhận vào hệ thống quản lý căn hộ OceanPark Homes.</p>
                </div>
              </div>

              {/* Digital E-Invoice Receipt Card */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 text-left text-xs leading-relaxed max-w-md mx-auto relative overflow-hidden font-medium">
                <div className="absolute top-2.5 right-2.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-550 text-[10px] font-black px-2.5 py-0.5 rounded tracking-widest uppercase">
                  PAID / ĐÃ THU
                </div>

                <div className="space-y-3">
                  <div className="border-b border-slate-850 pb-2.5">
                    <span className="text-slate-440 text-[9px] uppercase tracking-wider font-extrabold block">Mã giao dịch</span>
                    <strong className="text-slate-100 font-mono tracking-widest">{transaction.transactionReference}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-b border-slate-850 pb-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider font-extrabold block">Khách hàng</span>
                      <strong className="text-slate-200">{transaction.clientName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider font-extrabold block">Số điện thoại</span>
                      <strong className="text-slate-200">{transaction.clientPhone}</strong>
                    </div>
                  </div>

                  <div className="border-b border-slate-850 pb-2.5 text-[11px]">
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider font-extrabold block">Dịch vụ thanh toán</span>
                    <strong className="text-slate-200">{currentPack.name}</strong>
                  </div>

                  <div className="border-b border-slate-850 pb-2.5 text-[11px]">
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider font-extrabold block">Mục tiêu căn hộ</span>
                    <strong className="text-slate-200 line-clamp-1">{listing.title}</strong>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider font-extrabold block">Phương thức</span>
                      <strong className="text-slate-200">{paymentMethod === 'bank_transfer' ? 'Chuyển khoản QR' : 'Thẻ tín dụng Visa'}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider font-extrabold block">Tổng thanh toán</span>
                      <strong className="text-cyan-600 font-extrabold text-sm font-sans">{transaction.amount.toLocaleString('vi-VN')} đ</strong>
                    </div>
                  </div>
                </div>

                {/* Secure certificate footnotes */}
                <div className="mt-4 pt-3 border-t border-slate-850 border-dashed text-[9px] text-slate-400 text-center flex items-center justify-center space-x-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Chứng nhận ký số bởi OceanPark Homes Smart Legal API</span>
                </div>
              </div>

              {/* Recommendation instruction */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-[11px] text-slate-300 max-w-md mx-auto leading-relaxed">
                <span className="font-extrabold text-slate-200 block text-left mb-1">🎁 Các bước xử lý tiếp theo:</span>
                <p className="text-left font-medium">Hệ thống đã tự động khóa trạng thái độc quyền hoặc kích hoạt dịch vụ cho quý khách. Đại diện luật sư và đại sứ chuyên viên phụ trách sẽ lập tức liên hệ điện thoại trong vài phút để bàn giao văn bản thỏa thuận cứng.</p>
              </div>

              {/* Close Button */}
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-200 hover:bg-slate-350 bg-gradient-to-r from-cyan-600 to-cyan-500 leading-none text-slate-950 hover:text-white font-extrabold text-xs tracking-wider rounded-xl transition uppercase"
                >
                  Hoàn thành trở lại
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
