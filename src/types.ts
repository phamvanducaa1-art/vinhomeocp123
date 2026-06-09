export interface Listing {
  id: string;
  title: string;
  description: string;
  project: 'Vinhomes Ocean Park 1' | 'Vinhomes Ocean Park 2' | 'Vinhomes Ocean Park 3';
  subdivision: string;
  building: string;
  floor: number;
  apartmentNumber: string;
  type: 'Studio' | '1PN' | '2PN' | '3PN' | 'Duplex' | 'Penthouse';
  price: number; // For sale: VND (e.g. 3,200,000,000). For rent: VND/month (e.g. 7,500,000)
  transactionType: 'sale' | 'rent';
  area: number; // m2
  bedrooms: number;
  bathrooms: number;
  direction: 'Đông' | 'Tây' | 'Nam' | 'Bắc' | 'Đông Nam' | 'Đông Bắc' | 'Tây Nam' | 'Tây Bắc';
  furniture: 'Cơ bản' | 'Đầy đủ' | 'Bàn giao thô';
  images: string[];
  amenities: string[];
  createdAt: string;
  views: number;
  contacts: number;
}

export interface Appointment {
  id: string;
  listingId?: string;
  listingTitle?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: string;
  time: string;
  status: 'Chờ duyệt' | 'Đã xác nhận' | 'Đã hủy' | 'Đã hoàn thành';
  note: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  listingId?: string;
  listingTitle?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  message: string;
  source: 'Chi tiết' | 'Zalo' | 'Tư vấn tổng quan' | 'AI Chatbot';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Tin thị trường' | 'Phân tích giá' | 'Kinh nghiệm mua nhà' | 'Kinh nghiệm đầu tư' | 'Tin tức Vinhomes Ocean Park';
  image: string;
  author: string;
  createdAt: string;
  slug: string;
}

export interface PaymentTransaction {
  id: string;
  listingId: string;
  listingTitle: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  amount: number;
  paymentType: 'deposit_lock' | 'inspection_pack' | 'vip_promote'; // Đặt cọc giữ căn, Gói kiểm định, Đăng tin VIP
  paymentMethod: 'bank_transfer' | 'credit_card';
  status: 'pending' | 'success' | 'failed';
  note?: string;
  createdAt: string;
  transactionReference: string;
}

export interface Wallet {
  balance: number;
  holderName: string;
  holderAccount: string;
  bankName: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  method: 'bank_transfer' | 'credit_card';
  status: 'pending' | 'success' | 'failed';
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  createdAt: string;
  transactionReference: string;
  note?: string;
}

