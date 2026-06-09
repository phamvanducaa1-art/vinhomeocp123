import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { sampleListings, initialBlogPosts, staticProjectsInfo } from './src/dataMock.js';
import { Listing, Appointment, Inquiry, BlogPost } from './src/types.js';

// Server state in memory
let dbListings: Listing[] = [...sampleListings];
let dbAppointments: Appointment[] = [
  {
    id: 'appt-1',
    listingId: 'listing-1',
    listingTitle: 'Căn hộ Masteri Waterfront 2PN view trực diện Biển Hồ cát trắng cực đẹp',
    clientName: 'Anh Hà Quang Minh',
    clientPhone: '0912345678',
    clientEmail: 'minhhq@gmail.com',
    date: '2026-06-12',
    time: '14:30',
    status: 'Đã xác nhận',
    note: 'Yêu cầu mang theo mặt bằng kỹ thuật chi tiết phân khu Miami để xem xét giếng trời.',
    createdAt: '2026-06-08T09:00:00Z'
  },
  {
    id: 'appt-2',
    listingId: 'listing-4',
    listingTitle: 'Chính chủ cho thuê căn hộ Sapphire 2 tòa S2.12 view hồ 24.5ha bao quát',
    clientName: 'Chị Lê Hoài Thu',
    clientPhone: '0987654321',
    clientEmail: 'thule@gmail.com',
    date: '2026-06-15',
    time: '09:00',
    status: 'Chờ duyệt',
    note: 'Muốn xem trực tiếp chất lượng hoàn thiện của hệ thống tủ gỗ gõ đỏ gia chủ tự lắp đặt.',
    createdAt: '2026-06-09T03:00:00Z'
  }
];
let dbInquiries: Inquiry[] = [
  {
    id: 'inq-1',
    listingId: 'listing-1',
    listingTitle: 'Căn hộ Masteri Waterfront 2PN view trực diện Biển Hồ cát trắng cực đẹp',
    clientName: 'Nguyễn Văn Đạt',
    clientPhone: '0901239845',
    clientEmail: 'datnv@yahoo.com',
    message: 'Tôi đang có 2.5 tỷ muốn vay thêm ngân hàng 1.15 tỷ mua căn này có được hỗ trợ ân hạn nợ gốc 24 tháng không? Nhờ môi giới liên hệ giải đáp tư vấn phương án tài chính.',
    source: 'Chi tiết',
    createdAt: '2026-06-08T12:00:00Z'
  },
  {
    id: 'inq-2',
    clientName: 'Trần Thị Thuỷ',
    clientPhone: '0944555666',
    clientEmail: 'thuytran@gmail.com',
    message: 'Tôi muốn tìm mua căn 1PN hoặc Studio tại Ocean Park 1 tầm giá tài chính 1.8 tỷ quay đầu rộng rãi có ban công Đông Nam.',
    source: 'Tư vấn tổng quan',
    createdAt: '2026-06-09T08:30:00Z'
  }
];
let dbBlogs: BlogPost[] = [...initialBlogPosts];

// Lazy initialize Gemini client to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // ================= API ROUTES =================

  // 1. Listings Collection
  app.get('/api/listings', (req, res) => {
    try {
      let filtered = [...dbListings];
      const {
        project,
        subdivision,
        type,
        transactionType,
        priceMin,
        priceMax,
        areaMin,
        areaMax,
        bedrooms,
        direction,
        search,
        sort
      } = req.query;

      // Log of search params
      if (project) {
        filtered = filtered.filter(l => l.project.toLowerCase() === (project as string).toLowerCase());
      }
      if (subdivision) {
        filtered = filtered.filter(l => l.subdivision.toLowerCase().includes((subdivision as string).toLowerCase()));
      }
      if (type) {
        filtered = filtered.filter(l => l.type === type);
      }
      if (transactionType) {
        filtered = filtered.filter(l => l.transactionType === transactionType);
      }
      if (priceMin) {
        filtered = filtered.filter(l => l.price >= Number(priceMin));
      }
      if (priceMax) {
        filtered = filtered.filter(l => l.price <= Number(priceMax));
      }
      if (areaMin) {
        filtered = filtered.filter(l => l.area >= Number(areaMin));
      }
      if (areaMax) {
        filtered = filtered.filter(l => l.area <= Number(areaMax));
      }
      if (bedrooms) {
        filtered = filtered.filter(l => l.bedrooms === Number(bedrooms));
      }
      if (direction) {
        filtered = filtered.filter(l => l.direction.toLowerCase().includes((direction as string).toLowerCase()));
      }
      if (search) {
        const query = (search as string).toLowerCase();
        filtered = filtered.filter(l => 
          l.title.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.subdivision.toLowerCase().includes(query) ||
          l.building.toLowerCase().includes(query)
        );
      }

      // Sort
      if (sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'area_asc') {
        filtered.sort((a, b) => a.area - b.area);
      } else if (sort === 'area_desc') {
        filtered.sort((a, b) => b.area - a.area);
      } else {
        // default: newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific listing
  app.get('/api/listings/:id', (req, res) => {
    const listingId = req.params.id;
    const listing = dbListings.find(l => l.id === listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Không tìm thấy căn hộ này' });
    }
    // Increment views counter
    listing.views = (listing.views || 0) + 1;
    res.json(listing);
  });

  // Create new apartment listing
  app.post('/api/listings', (req, res) => {
    try {
      const data = req.body;
      const newListing: Listing = {
        id: `listing-${Date.now()}`,
        title: data.title || 'Căn hộ chung cư mới đăng',
        description: data.description || '',
        project: data.project || 'Vinhomes Ocean Park 1',
        subdivision: data.subdivision || 'The Sapphire',
        building: data.building || 'Tòa nhà',
        floor: Number(data.floor) || 12,
        apartmentNumber: data.apartmentNumber || '1205',
        type: data.type || '2PN',
        price: Number(data.price) || 3000000000,
        transactionType: data.transactionType || 'sale',
        area: Number(data.area) || 60,
        bedrooms: Number(data.bedrooms) || 2,
        bathrooms: Number(data.bathrooms) || 2,
        direction: data.direction || 'Đông Nam',
        furniture: data.furniture || 'Cơ bản',
        images: data.images && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800'],
        amenities: data.amenities || ['Bể bơi', 'Gym', 'Vườn nướng BBQ'],
        createdAt: new Date().toISOString().split('T')[0],
        views: 1,
        contacts: 0
      };
      
      dbListings.unshift(newListing);
      res.status(201).json(newListing);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete/Archive listing
  app.delete('/api/listings/:id', (req, res) => {
    const { id } = req.params;
    const index = dbListings.findIndex(l => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Căn hộ không tồn tại' });
    }
    dbListings.splice(index, 1);
    res.json({ success: true, message: 'Đã xoá tin đăng thành công' });
  });

  // 2. static values & analytic dashboards
  app.get('/api/projects-info', (req, res) => {
    const overview = staticProjectsInfo.map(info => {
      const projectListings = dbListings.filter(l => l.project === info.name);
      return {
        ...info,
        totalPostings: projectListings.length,
        saleCount: projectListings.filter(l => l.transactionType === 'sale').length,
        rentCount: projectListings.filter(l => l.transactionType === 'rent').length
      };
    });
    res.json(overview);
  });

  // 3. Blogs endpoints
  app.get('/api/blogs', (req, res) => {
    res.json(dbBlogs);
  });

  app.get('/api/blogs/:slug', (req, res) => {
    const blog = dbBlogs.find(b => b.slug === req.params.slug);
    if (!blog) return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    res.json(blog);
  });

  app.post('/api/blogs', (req, res) => {
    const data = req.body;
    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      title: data.title || 'Bài viết mới',
      summary: data.summary || '',
      content: data.content || '',
      category: data.category || 'Tin tức Vinhomes Ocean Park',
      image: data.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      author: data.author || 'Môi giới OceanPark Homes',
      createdAt: new Date().toISOString().split('T')[0],
      slug: (data.title || 'bai-viet-moi').toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    };
    dbBlogs.unshift(newBlog);
    res.status(201).json(newBlog);
  });

  // 4. Appointments Endpoint
  app.get('/api/appointments', (req, res) => {
    res.json(dbAppointments);
  });

  app.post('/api/appointments', (req, res) => {
    try {
      const data = req.body;
      const listing = dbListings.find(l => l.id === data.listingId);
      if (listing) {
        listing.contacts = (listing.contacts || 0) + 1;
      }
      const newAppt: Appointment = {
        id: `appt-${Date.now()}`,
        listingId: data.listingId,
        listingTitle: data.listingTitle || listing?.title || 'Tư vấn dự án tổng quan',
        clientName: data.clientName || 'Khách hàng',
        clientPhone: data.clientPhone || '',
        clientEmail: data.clientEmail || '',
        date: data.date || '',
        time: data.time || '',
        status: 'Chờ duyệt',
        note: data.note || '',
        createdAt: new Date().toISOString()
      };
      dbAppointments.unshift(newAppt);
      res.status(201).json(newAppt);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const appt = dbAppointments.find(a => a.id === id);
    if (!appt) return res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
    appt.status = status;
    res.json(appt);
  });

  // 5. Inquiries (Consultation request)
  app.get('/api/inquiries', (req, res) => {
    res.json(dbInquiries);
  });

  app.post('/api/inquiries', (req, res) => {
    try {
      const data = req.body;
      const listing = data.listingId ? dbListings.find(l => l.id === data.listingId) : null;
      if (listing) {
        listing.contacts = (listing.contacts || 0) + 1;
      }
      const newInq: Inquiry = {
        id: `inq-${Date.now()}`,
        listingId: data.listingId,
        listingTitle: data.listingTitle || listing?.title || undefined,
        clientName: data.clientName || 'Khách hàng ẩn danh',
        clientPhone: data.clientPhone || '',
        clientEmail: data.clientEmail || '',
        message: data.message || '',
        source: data.source || 'Tư vấn tổng quan',
        createdAt: new Date().toISOString()
      };
      dbInquiries.unshift(newInq);
      res.status(201).json(newInq);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // 5.5. Payments Endpoint
  let dbPayments: any[] = [
    {
      id: 'pay-1',
      listingId: 'listing-1',
      listingTitle: 'Căn hộ Masteri Waterfront 2PN view trực diện Biển Hồ cát trắng cực đẹp',
      clientName: 'Anh Hà Quang Minh',
      clientPhone: '0912345678',
      clientEmail: 'minhhq@gmail.com',
      amount: 10000000,
      paymentType: 'deposit_lock',
      paymentMethod: 'bank_transfer',
      status: 'success',
      note: 'Thanh toán đặt cọc giữ căn hộ Masteri Waterfront trong 48h.',
      createdAt: '2026-06-08T09:15:00Z',
      transactionReference: 'OPH-DEP-109283'
    },
    {
      id: 'pay-2',
      listingId: 'listing-4',
      listingTitle: 'Chính chủ cho thuê căn hộ Sapphire 2 tòa S2.12 view hồ 24.5ha bao quát',
      clientName: 'Chị Lê Hoài Thu',
      clientPhone: '0987654321',
      clientEmail: 'thule@gmail.com',
      amount: 2000000,
      paymentType: 'inspection_pack',
      paymentMethod: 'credit_card',
      status: 'success',
      note: 'Thanh toán gói kiểm định kỹ thuật căn hộ trước khi bàn giao hợp đồng thuê.',
      createdAt: '2026-06-09T03:30:00Z',
      transactionReference: 'OPH-INSP-582910'
    }
  ];

  app.get('/api/payments', (req, res) => {
    res.json(dbPayments);
  });

  app.post('/api/payments', (req, res) => {
    try {
      const data = req.body;
      const listing = dbListings.find(l => l.id === data.listingId);
      const newPay = {
        id: `pay-${Date.now()}`,
        listingId: data.listingId || 'general',
        listingTitle: data.listingTitle || listing?.title || 'Dịch vụ OceanPark Homes',
        clientName: data.clientName || 'Khách hàng',
        clientPhone: data.clientPhone || '',
        clientEmail: data.clientEmail || '',
        amount: Number(data.amount) || 500000,
        paymentType: data.paymentType || 'deposit_lock',
        paymentMethod: data.paymentMethod || 'bank_transfer',
        status: data.status || 'success',
        note: data.note || '',
        createdAt: new Date().toISOString(),
        transactionReference: `OPH-${Math.floor(Math.random() * 900000) + 100000}`
      };
      
      dbPayments.unshift(newPay);
      res.status(201).json(newPay);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/payments/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const pay = dbPayments.find(p => p.id === id);
    if (!pay) return res.status(404).json({ error: 'Không tìm thấy giao dịch' });
    pay.status = status;
    res.json(pay);
  });

  // 5.6. Wallet System Database (In-Memory Deposit & Withdrawal)
  let dbWallet = {
    balance: 15300000, // 15.3M VND starting balance
    holderName: 'PHẠM VĂN ĐỨC',
    holderAccount: '0326246516',
    bankName: 'Techcombank'
  };

  let dbWalletTransactions: any[] = [
    {
      id: 'wtx-1',
      type: 'deposit',
      amount: 10000000,
      method: 'bank_transfer',
      status: 'success',
      bankName: 'Techcombank',
      accountNumber: '0326246516',
      createdAt: '2026-06-08T09:00:00Z',
      transactionReference: 'WTX-DEP-721054',
      note: 'Nạp tiền ký quỹ đại lý phân phối OceanPark Homes'
    },
    {
      id: 'wtx-2',
      type: 'deposit',
      amount: 5300000,
      method: 'credit_card',
      status: 'success',
      bankName: 'Vietcombank',
      accountNumber: '9984920491',
      createdAt: '2026-06-09T03:00:00Z',
      transactionReference: 'WTX-DEP-829103',
      note: 'Nạp tiền để nâng cấp Đăng Tin VIP phong thủy'
    }
  ];

  app.get('/api/wallet', (req, res) => {
    res.json({
      wallet: dbWallet,
      history: dbWalletTransactions
    });
  });

  app.post('/api/wallet/deposit', (req, res) => {
    try {
      const { amount, method, bankName, accountNumber, note } = req.body;
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ error: 'Số tiền nạp không hợp lệ' });
      }

      const txRef = `WTX-DEP-${Math.floor(Math.random() * 900000) + 100000}`;
      const newTx = {
        id: `wtx-${Date.now()}`,
        type: 'deposit',
        amount: parsedAmount,
        method: method || 'bank_transfer',
        status: 'success',
        bankName: bankName || 'Techcombank',
        accountNumber: accountNumber || '0326246516',
        createdAt: new Date().toISOString(),
        transactionReference: txRef,
        note: note || 'Nạp tiền ví điện tử qua cổng thanh toán bảo mật'
      };

      // Add balance
      dbWallet.balance += parsedAmount;
      dbWalletTransactions.unshift(newTx);

      res.status(201).json({
        success: true,
        transaction: newTx,
        wallet: dbWallet
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/wallet/withdraw', (req, res) => {
    try {
      const { amount, bankName, accountNumber, accountHolder, note } = req.body;
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ error: 'Số tiền rút không hợp lệ' });
      }

      if (dbWallet.balance < parsedAmount) {
        return res.status(400).json({ error: 'Số dư ví khả dụng không đủ để hoàn tất giao dịch rút tiền này' });
      }

      const txRef = `WTX-WTH-${Math.floor(Math.random() * 900000) + 100000}`;
      const newTx = {
        id: `wtx-${Date.now()}`,
        type: 'withdraw',
        amount: parsedAmount,
        method: 'bank_transfer',
        status: 'success',
        bankName: bankName || 'Techcombank',
        accountNumber: accountNumber || '0326246516',
        accountHolder: accountHolder || 'PHAM VAN DUC',
        createdAt: new Date().toISOString(),
        transactionReference: txRef,
        note: note || 'Rút tiền đại lý / hoa hồng ký gửi căn hộ'
      };

      // Deduct balance
      dbWallet.balance -= parsedAmount;
      dbWalletTransactions.unshift(newTx);

      res.status(201).json({
        success: true,
        transaction: newTx,
        wallet: dbWallet
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // 6. AI CAPABILITIES (INTELLIGENT INTEGRATION)

  // A. AI Chatbot endpoint
  app.post('/api/ai/chat', async (req, res) => {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Yêu cầu truyền tin nhắn' });
    }

    // Load available query specs to help the AI match
    const listingsSummary = dbListings.slice(0, 15).map(l => (
      `- [${l.transactionType === 'sale' ? 'BÁN' : 'CHO THUÊ'}] ${l.type} tâng ${l.floor} tại toà ${l.building} phân khu ${l.subdivision} | Dự án: ${l.project}. Giá: ${l.transactionType === 'sale' ? (l.price / 1000000000).toFixed(2) + ' Tỷ' : (l.price / 1000000).toFixed(1) + ' Triệu/tháng'}. Diện tích: ${l.area}m2. Hướng: ${l.direction}. Mã căn: ${l.id}`
    )).join('\n');

    const systemInstruction = `Bạn là Trợ lý Ảo AI cao cấp của OceanPark Homes - Chuyên trang mua bán, cho thuê căn hộ Vinhomes Ocean Park 1, 2, 3.
    Nhiệm vụ của bạn là tư vấn tận tâm, chuyên nghiệp, thông tin chính xác về các dự án Vinhomes Ocean Park 1 (Gia Lâm), 2 & 3 (Văn Giang, Hưng Yên) cho khách hàng Việt Nam.
    Hãy tư vấn căn hộ dựa trên danh sách dữ liệu thực tế sau đây nếu người dùng hỏi tìm mua hoặc thuê căn hộ:
    ${listingsSummary}

    Hướng dẫn cách trả lời:
    1. Giọng điệu hào hứng, thân thiện và hiểu biết sâu sắc về tiện ích Vinhomes (Như Hồ Ngọc Trai 24.5ha, biển hồ nước mặn Tây Ban Nha, Mega Grand World, Vịnh Thiên Đường Paradise Bay, VinBus, VinUniversity).
    2. Nếu khách muốn mua căn hộ, hãy giới thiệu các mã căn từ danh sách trên mà khớp tốt nhất với tài chính, số phòng ngủ, hoặc diện tích họ cần. Trích dẫn chính xác mã căn (ví dụ: listing-1) để họ biết.
    3. Thường xuyên gợi ý họ tạo Lịch Hẹn Xem Nhà hoặc bấm vào liên hệ Zalo/Hotline hoặc gửi thông tin để chuyên viên gọi điện trực tiếp hỗ trợ.
    4. Trả lời bằng tiếng Việt sạch sẽ, định dạng Markdown lịch sự và dễ học. Nếu không có căn hộ nào khớp hoàn toàn, hãy đưa ra một gợi ý gần giống nhất từ danh sách trên hoặc hứa sẽ liên hệ tìm thêm.`;

    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback when Gemini API key is missing
      console.log('Gemini API key is not set. Using fallback assistant responses.');
      const responseText = simulateChatbotResponse(message, dbListings);
      return res.json({
        text: responseText,
        isSimulated: true
      });
    }

    try {
      // Standard chat loop representation
      const formattedHistory = (chatHistory || []).map((h: any) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));

      // Append current message
      formattedHistory.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.75
        }
      });

      res.json({
        text: response.text,
        isSimulated: false
      });
    } catch (err: any) {
      console.error('Gemini Chat Error:', err);
      // Fallback on error
      const responseText = simulateChatbotResponse(message, dbListings);
      res.json({
        text: responseText + `\n\n*(Lưu ý: Hệ thống vừa chuyển sang chế độ tự động tối ưu vì gặp sự cố xử lý API: ${err.message})*`,
        isSimulated: true
      });
    }
  });

  // B. AI Description Generator
  app.post('/api/ai/generate-description', async (req, res) => {
    const { project, subdivision, building, type, price, area, bedrooms, direction, furniture, highlights } = req.body;
    
    const formattedPrice = price > 500000000 
      ? `${(price / 1000000000).toFixed(2)} tỷ` 
      : `${(price / 1000000).toFixed(1)} triệu/tháng`;

    const instructionsPrompt = `Bạn là nhà môi giới bất động sản xuất sắc viết tin rao bán/cho thuê cực kỳ hút khách.
    Hãy tạo một tiêu đề giật tít hấp dẫn và một bài mô tả tin đăng chi tiết, ấn tượng bằng tiếng Việt cho căn hộ sau:
    - Dự án: ${project}
    - Phân khu: ${subdivision}
    - Tòa nhà: ${building}
    - Loại căn hộ: ${type} (${bedrooms} PN)
    - Giá bán/thuê: ${formattedPrice}
    - Diện tích: ${area} m²
    - Hướng ban công: ${direction}
    - Tình trạng nội thất: Bàn giao sổ đỏ ${furniture}
    - Điểm nhấn nổi bật: ${highlights || 'Gần biển hồ, gần trường học VinSchool, công viên nội khu râm mát, xe VinBus đón chân đế.'}

    Yêu cầu trả lời định dạng JSON hoàn chỉnh sau:
    {
      "title": "[Tiêu đề tin đăng giật tít không quá 80 ký tự, hấp dẫn]",
      "description": "[Nội dung mô tả chi tiết khoảng 3-4 đoạn văn, nêu bật lý do nên mua/thuê ngay lập tức, phân tích tiện ích xã hội, cấu trúc căn hộ, và lời bình kết luận đầy thôi thúc kêu gọi hành động đặt lịch xem nhà]"
    }`;

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback offline simulator
      const simTitle = `[Chính Chủ] Bán gấp căn hộ ${type} phân khu ${subdivision} - ${project}, view ngắm tuyệt phẩm đỉnh cao`;
      const simDesc = `Cần nhượng lại căn hộ ấm cúng diện tích ${area}m² thiết kế cực kỳ hiện đại tại toà ${building} phân khu ${subdivision} thuộc siêu đô thị ${project}.
- Vị trí: Tầng trung hoàng gia cực kỳ đắc địa, hướng ban công ${direction} đón ánh bình minh phong thủy mang lại phú quý tài lộc cho chủ nhân.
- Nội thất bàn giao: ${furniture} đầy đủ tiện nghi nhập khẩu chính hãng sang trọng.
- Giá cực tốt: Chỉ ${formattedPrice}, hỗ trợ toàn bộ thủ tục pháp lý sang tên nhanh chóng.
- Hệ sinh thái tiện ích: Tận hưởng đại đặc quyền nghỉ dưỡng tắm biển hồ nhân tạo mát mẻ quanh năm, sử dụng miễn phí sân tennis, gym nội khu hiện đại, cùng hệ thống trường học liên cấp Vinschool chuẩn quốc tế gác móng sát sườn. Xem nhà trực tiếp 24/7!`;
      
      return res.json({
        title: simTitle,
        description: simDesc,
        isSimulated: true
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: instructionsPrompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json({
        title: result.title || 'Căn hộ đẹp Vinhomes Ocean Park',
        description: result.description || 'Nội dung mô tả căn hộ.',
        isSimulated: false
      });
    } catch (err: any) {
      console.error('Gemini Generate Description Error:', err);
      res.json({
        title: `Hạ bán gấp căn ${type} ${subdivision} - toà ${building} giá chỉ ${formattedPrice}`,
        description: `Cơ hội sở hữu tuyệt vời căn hộ ${type} diện tích ${area}m² tại trung tâm dự án ${project}. Ban công hướng ${direction} thoáng đãng. Bàn giao: ${furniture}. Giá bán siêu hời chỉ ${formattedPrice}. Liên hệ xem nhà thực tế ngay hôm nay!`,
        isSimulated: true
      });
    }
  });

  // C. AI Price Analyzer
  app.post('/api/ai/analyze-price', async (req, res) => {
    const { listingId, price, area, project, subdivision, type, transactionType } = req.body;
    
    const instructionsPrompt = `Hãy đóng vai trò chuyên gia dữ liệu bất động sản chuyên sâu tại Vinhomes Ocean Park.
    Thực hiện phân tích, định giá và nhận định tài chính cho căn hộ mới sau:
    - Dự án: ${project} (Phân khu: ${subdivision})
    - Loại hình: ${type} - Loại giao dịch: ${transactionType === 'sale' ? 'MUA BÁN' : 'CHO THUÊ'}
    - Diện tích: ${area} m²
    - Mức giá đưa ra: ${transactionType === 'sale' ? (price / 1000000000).toFixed(2) + ' Tỷ' : (price / 1000000).toFixed(1) + ' Triệu/tháng'} (Tương đương khoảng ${Math.round(price / area).toLocaleString('vi-VN')} đ/m²)

    Yêu cầu xuất đầu ra dạng JSON gồm:
    {
      "rating": "[Một trong 3 chuỗi: 'HỜI (Dưới giá thị trường)' | 'HỢP LÝ (Bằng giá thị trường)' | 'CAO (Phân khúc đặc biệt)']",
      "score": [Điểm số từ 1 đến 10 đánh giá sự hấp dẫn tài chính của căn hộ này],
      "analysis": "[Giải thích chi tiết 2-3 câu bằng tiếng Việt vì sao có xếp hạng đó, so sánh với mặt bằng thị trường khu vực]",
      "advice": "[Lời khuyên bổ ích dành cho người mua/người thuê gánh khoản tài chính này, ví dụ phương án vay ngân hàng hoặc mặc cả thỏa thuận thêm]"
    }`;

    const ai = getGeminiClient();

    if (!ai) {
      // Simulated evaluation
      const tempRating = price / area < 50000000 && transactionType === 'sale' ? 'HỜI (Dưới giá thị trường)' : 'HỢP LÝ (Bằng giá thị trường)';
      const tempScore = price / area < 50000000 ? 9 : 8;
      return res.json({
        rating: tempRating,
        score: tempScore,
        analysis: `Đơn giá của căn hộ này tương đương tầm ${Math.round(price / area).toLocaleString('vi-VN')} VNĐ/m². Đây là mức giá vô cùng cạnh tranh và ổn định so với giá trị bàn giao nội thất và vị trí thuộc phân khu ${subdivision} tại ${project}. Phù hợp cho cả an cư lẫn đầu tư sinh lời bền vững quý khách cư ngụ lâu dài.`,
        advice: `Quý khách nên chuẩn bị sẵn tối thiểu 30% vốn tự có (khoảng ${(price * 0.3 / 1000000000).toFixed(2)} tỷ). Phần còn lại có thể tận dụng các gói vay ưu đãi hỗ trợ lãi suất kéo dài của ngân hàng liên kết Techcombank để tối ưu tính thanh khoản tài chính cá nhân.`,
        isSimulated: true
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: instructionsPrompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const Evaluation = JSON.parse(response.text || '{}');
      res.json({
        ...Evaluation,
        isSimulated: false
      });
    } catch (err: any) {
      res.json({
        rating: 'HỢP LÝ (Bằng giá thị trường)',
        score: 7,
        analysis: 'Giá căn hộ nằm trong phạm vi giao dịch trung bình ổn định của khu vực phân khu tại Vinhomes. Phản ánh đúng giá trị hạ tầng tiện tích xanh bao quanh.',
        advice: 'Nên thương thảo thêm về phí chuyển nhượng sổ đỏ hoặc đàm phán gia lộc một chút lấy may mắn khi dọn nhà mới.',
        isSimulated: true
      });
    }
  });

  // ================= VITE OR STATIC MIDDLEWARES =================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server OceanPark Homes runs on http://localhost:${PORT}`);
  });
}

// Fallback logic helper for simulated chat response to keep the chatbot highly responsive offline
function simulateChatbotResponse(message: string, listings: Listing[]): string {
  const msg = message.toLowerCase();
  
  if (msg.includes('thuê') || msg.includes('thue')) {
    const rentals = listings.filter(l => l.transactionType === 'rent').slice(0, 3);
    let listStr = rentals.map(r => `* **${r.title}**: Giá ${r.price.toLocaleString('vi-VN')} đ/tháng, diện tích ${r.area}m², tòa ${r.building} (${r.subdivision}). Mã căn: \`${r.id}\``).join('\n');
    return `Chào bạn! Tôi thấy bạn đang quan tâm đến các căn hộ cho thuê tại Vinhomes Ocean Park. Hệ thống đang có hơn 50+ căn hộ cho thuê giá cực tốt từ Studio sinh viên đến căn 3PN đẳng cấp.

Dưới đây là một số căn cho thuê nổi bật bạn có thể xem xét:
${listStr}

Bạn có muốn đặt lịch hẹn đi xem trực tiếp những căn hộ này hay cần tư vấn tài chính phân tích kỹ hơn không?`;
  }
  
  if (msg.includes('bán') || msg.includes('ban') || msg.includes('mua')) {
    const sales = listings.filter(l => l.transactionType === 'sale').slice(0, 3);
    let listStr = sales.map(s => `* **${s.title}**: Giá ${(s.price / 1000000000).toFixed(2)} Tỷ, diện tích ${s.area}m², phòng ngủ ${s.bedrooms} phòng, ban công ${s.direction}. Mã căn: \`${s.id}\``).join('\n');
    return `Kính chào quý khách! Vinhomes Ocean Park 1, 2, 3 sở hữu bãi biển lagoon lộng lẫy và không gian sống hoàng gia. Với tầm tài chính mua bán, căn hộ sinh lời cao đang rất được săn đón.

Gửi bạn 3 căn hộ đang được chào bán siêu hot trong quỹ căn của OceanPark Homes:
${listStr}

Các căn hộ này đều hỗ trợ vay ngân hàng ưu đãi lên đến 70-80% giá trị hợp đồng, ân hạn nợ gốc dài hạn. Quý khách muốn đặt lịch xem nhà trực tiếp hay nhận phân tích định giá chi tiết từ trợ lý AI?`;
  }

  return `Chào quý khách! Tôi là trợ lý AI cao cấp của **OceanPark Homes**. Tôi có thể hỗ trợ quý khách:

1. 🔍 **Tìm kiếm căn hộ** phù hợp nhu cầu mua bán hoặc thuê tại Ocean Park 1, 2, 3.
2. 💰 **Phân tích định giá** căn nhà xem đang hời hay đắt so với mặt bằng thực tế.
3. 🏠 **Tính toán phương án tài chính** vay vốn trả góp ngân hàng hàng tháng.
4. 📆 **Đăng ký lịch hẹn** xem căn trực tiếp thực tế cùng môi giới chuyên nghiệp.

Quý khách hãy chia sẻ cụ thể mong muốn của mình nhé (ví dụ: *"Tôi muốn tìm thuê căn 2PN khoảng 8 triệu"* hoặc *"Tư vấn cho tôi căn hộ mua tài chính 3 tỷ"*...)`;
}

startServer();
