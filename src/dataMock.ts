import { Listing, BlogPost } from './types';

// Let's create realistic anchor listings for Vinhomes Ocean Park 1, 2, 3
export const initialBlogPosts: BlogPost[] = [
  {
    id: 'b1',
    title: 'Phân tích biến động giá căn hộ Vinhomes Ocean Park 1 quý 2/2026',
    summary: 'Nhận định chi tiết về giá bán và giá cho thuê tại các phân khu Sapphire, Ruby và Masteri Waterfront.',
    content: `Thị trường căn hộ chung cư tại Vinhomes Ocean Park 1 (Gia Lâm, Hà Nội) ghi nhận sự tăng trưởng ổn định trong quý 2/2026. Nhờ hệ thống tiện ích đã vận hành đồng bộ và sự gia tăng dân số cơ học vượt bậc, nhu cầu mua và thuê căn hộ duy trì ở mức rất cao.

    1. Phân khu Đọc vị (The Sapphire):
    Mức giá bán dao động từ 38 triệu - 45 triệu/m2. Cho thuê từ 6 triệu - 10 triệu/tháng tùy theo loại căn hộ đầy đủ đồ hay cơ bản.

    2. Phân khu cao cấp (The Zenpark - Ruby & Masteri Waterfront):
    Ghi nhận giá giao dịch tăng từ 10% so với cùng kỳ năm ngoái, tiệm cận mức 60 triệu - 80 triệu/m2 nhờ tiêu chuẩn bàn giao cao cấp, sảnh lễ tân sang trọng, và tiện ích bể bơi bốn mùa, hồ cá Koi riêng tư.

    Kinh nghiệm đầu tư: Phù hợp nhất cho dòng tiền cho thuê ổn định với tỷ suất lợi nhuận đạt từ 5.5% - 6.8%/năm, cao hơn trung tâm Hà Nội nhờ lượng chuyên gia, sinh viên VinUniversity đông đúc.`,
    category: 'Phân tích giá',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
    author: 'Trần Minh Hải (Chuyên gia BĐS OceanPark Homes)',
    createdAt: '2026-05-15',
    slug: 'phan-tich-bien-dong-gia-can-ho-vinhomes-ocean-park-1'
  },
  {
    id: 'b2',
    title: 'Kinh nghiệm lần đầu chọn thuê căn hộ tại Vinhomes Ocean Park 2',
    summary: 'Tổng hợp chi tiết các phân khu thấp tầng, cao tầng và những điều cần lưu ý về chi phí gửi xe, phí dịch vụ.',
    content: `Vinhomes Ocean Park 2 - The Empire được biết đến như siêu đô thị biển khẩn trương đưa vào vận hành. Để có một trải nghiệm thuê nhà hoàn hảo tại đây, bạn nên lưu ý:

    - Lựa chọn loại hình: Biệt thự liền kề, Shophouse hay chung cư cao cấp. Hiện tại, lượng nhà phố liền kề cho thuê làm văn phòng kết hợp ở rất lớn ở phân khu Chà Là, Hải Âu, Sao Biển.
    - Chi phí vận hành: Phí dịch vụ quản lý khoảng 16.000đ/m2 đối với biệt thự, phí điện nước theo giá nhà nước.
    - Tiện ích nổi bật: Công viên sóng nhân tạo lớn nhất thế giới Wave Park là đặc quyền sống không thể bỏ qua. Nếu bạn có con nhỏ, phân khu có công viên nội khu rợp bóng cây xanh chính là lựa chọn tối ưu.`,
    category: 'Kinh nghiệm mua nhà',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
    author: 'Nguyễn Thị Hương',
    createdAt: '2026-05-20',
    slug: 'kinh-nghiem-lan-dau-cho-thue-can-ho-tai-ocean-park-2'
  },
  {
    id: 'b3',
    title: 'Vinhomes Ocean Park 3 - Điểm nóng đầu tư bất động sản phía Đông Hà Nội',
    summary: 'Tại sao Mega Grand World và Vịnh Thiên Đường lại đón nhận dòng tiền khổng lồ rốt ráo đổ về?',
    content: `Nằm tại tâm điểm của "Thành phố du lịch" Ocean City, Vinhomes Ocean Park 3 (The Crown) đang khẳng định vị thế độc tôn nhờ những đại tiện ích quy mô chưa từng có.

    - Mega Grand World Hà Nội: Sân khấu nghệ thuật, ẩm thực, mua sắm trải dài hai bờ sông Venice lãng mạn đã trở thành điểm đến quốc dân, mang lại nguồn khách du lịch khổng lồ cho các căn Homestay, Shophouse tại đây.
    - Tiềm năng sinh lời: Giá thuê các căn hộ studio phục vụ nghỉ dưỡng vào dịp cuối tuần đạt hiệu suất khai thác lên tới 80-90%. Giá trị bất động sản giữ nhịp tăng mạnh mẽ khi các đường vành đai và cầu kết nối tiếp tục được khánh thành.`,
    category: 'Kinh nghiệm đầu tư',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
    author: 'Phạm Đức Anh (Giám đốc dự án)',
    createdAt: '2026-06-01',
    slug: 'vinhomes-ocean-park-3-diem-nong-dau-tu'
  }
];

export const staticProjectsInfo = [
  {
    id: 'ocp1',
    name: 'Vinhomes Ocean Park 1',
    location: 'Gia Lâm, Hà Nội',
    description: 'Thành phố Biển Hồ với quy mô 420ha, nổi tiếng với Biển hồ nước mặn 6.1ha và hồ nước ngọt trải cát trắng lớn nhất Việt Nam.',
    towers: '66 tòa chung cư',
    avgSalePrice: '42 - 85 triệu/m²',
    avgRentPrice: '6.5 - 18 triệu/tháng',
    totalPostings: 48,
    highlights: ['Biển hồ nước ngọt 24.5ha', 'Trường Đại học VinUniversity', 'Bệnh viện Vinmec', 'Vincom Mega Mall']
  },
  {
    id: 'ocp2',
    name: 'Vinhomes Ocean Park 2',
    location: 'Văn Giang, Hưng Yên',
    description: 'Kinh đô ánh sáng nổi bật với siêu công viên nước Wave Park rộng 18ha chứa 6 bể tạo sóng khổng lồ.',
    towers: '24 tòa (Đang bàn giao) & hàng ngàn biệt thự',
    avgSalePrice: '55 - 110 triệu/m²',
    avgRentPrice: '8 - 25 triệu/tháng',
    totalPostings: 32,
    highlights: ['Công viên tạo sóng Wave Park', 'Quảng trường Kinh đô ánh sáng', 'Đại lộ xanh Kingdom Avenue']
  },
  {
    id: 'ocp3',
    name: 'Vinhomes Ocean Park 3',
    location: 'Văn Giang, Hưng Yên',
    description: 'Vịnh biển kỳ quan bốn mùa quy tụ vịnh trượt nước, hồ bơi nước mặn trong nhà lớn bậc nhất khu vực.',
    towers: '18 tòa & hàng vạn biệt thự thấp tầng',
    avgSalePrice: '60 - 130 triệu/m²',
    avgRentPrice: '9 - 30 triệu/tháng',
    totalPostings: 20,
    highlights: ['Vịnh biển bốn mùa Paradise Bay', 'Công viên nước Aquabay', 'Liền kề Mega Grand World']
  }
];

// Helper to generate 100 realistic apartments dynamically
export const generate100Apartments = (): Listing[] => {
  const listings: Listing[] = [];

  // Standard actual listings
  const baseListings: Partial<Listing>[] = [
    {
      id: 'listing-1',
      title: 'Căn hộ Masteri Waterfront 2PN view trực diện Biển Hồ cát trắng cực đẹp',
      description: 'Chính chủ gửi bán gấp căn hộ cao cấp thuộc dự án Masteri Waterfront, phân khu Miami tại Vinhomes Ocean Park 1. Căn hộ tầng trung hướng Đông Nam cực kỳ mát mẻ, phòng khách và phòng ngủ đều view trọn vẹn cảnh quan hồ nước ngọt 24.5ha. Đủ nội thất cao cấp nhập khẩu châu Âu, tủ lạnh, tivi, sofa, thiết bị vệ sinh Kohler cao cấp.',
      project: 'Vinhomes Ocean Park 1',
      subdivision: 'Masteri Waterfront',
      building: 'M2',
      floor: 18,
      apartmentNumber: '1809',
      type: '2PN',
      price: 3650000000,
      transactionType: 'sale',
      area: 68,
      bedrooms: 2,
      bathrooms: 2,
      direction: 'Đông Nam',
      furniture: 'Đầy đủ',
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60'
      ],
      amenities: ['Bể bơi cao cấp lớp kính', 'Phòng Gym riêng', 'Vườn trên không', 'Sảnh lễ tân', 'Nướng BBQ', 'Sân chơi trẻ em'],
      createdAt: '2026-06-01',
      views: 312,
      contacts: 18
    },
    {
      id: 'listing-2',
      title: 'Cho thuê căn hộ Studio full đồ phân khu Sapphire 1 gác mác tiện ích đẹp',
      description: 'Cần cho thuê lâu dài căn Studio gác cao view công viên xanh nội khu tại toà S1.06 Vinhomes Ocean Park 1. Đầy đủ đồ dùng thiết yếu: điều hoà, nóng lạnh, giường tủ gỗ mộc mạc, bộ bếp từ hút mùi Tây Ban Nha. Khách thuê chỉ việc đem vali quần áo vào ở ngay. Phù hợp sinh viên VinUni hoặc nhân viên văn phòng.',
      project: 'Vinhomes Ocean Park 1',
      subdivision: 'The Sapphire 1',
      building: 'S1.06',
      floor: 25,
      apartmentNumber: '2512',
      type: 'Studio',
      price: 6000000,
      transactionType: 'rent',
      area: 32,
      bedrooms: 0,
      bathrooms: 1,
      direction: 'Đông Bắc',
      furniture: 'Đầy đủ',
      images: [
        'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop&q=60'
      ],
      amenities: ['Công viên thể thao ngoài trời', 'Bể bơi nội khu', 'Sân tennis', 'Hồ nước ngọt điều hoà', 'Siêu thị VinMart'],
      createdAt: '2026-06-03',
      views: 145,
      contacts: 6
    },
    {
      id: 'listing-3',
      title: 'Căn hộ Zenpark Ruby 3PN hướng Đông Nam, bàn giao nội thất CĐT cao cấp',
      description: 'Gia đình cần bán căn hộ 3 phòng ngủ thuộc phân khu cao cấp The Zenpark (Ruby) - OCP1. Căn góc có 2 ban công cực kỳ rộng lớn thoáng sáng, bàn giao nguyên bản chủ đầu tư cao cấp: sàn gỗ công nghiệp, hệ thống tủ bếp, thiết bị vệ sinh, điều hòa âm trần Daikin hai chiều. Tiện ích phân khu mang đậm hơi thở Nhật Bản, hồ cá Koi xinh đẹp dạo mát mát rượi.',
      project: 'Vinhomes Ocean Park 1',
      subdivision: 'The Zenpark',
      building: 'R1.02',
      floor: 12,
      apartmentNumber: '1222',
      type: '3PN',
      price: 5200000000,
      transactionType: 'sale',
      area: 88,
      bedrooms: 3,
      bathrooms: 2,
      direction: 'Đông Nam',
      furniture: 'Cơ bản',
      images: [
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=60'
      ],
      amenities: ['Vườn Nhật nội khu', 'Hồ cá Koi Nhật Bản', 'Sảnh Lounge đón tiếp quý khách', 'Bể bơi bốn mùa kính', 'Khu nướng BBQ biệt lập'],
      createdAt: '2026-05-28',
      views: 289,
      contacts: 14
    },
    {
      id: 'listing-4',
      title: 'Chính chủ cho thuê căn hộ Sapphire 2 tòa S2.12 view hồ 24.5ha bao quát',
      description: 'Cho thuê căn hộ 1PN + 1 gác đa năng siêu tiện lợi tại S2.12, tầng trung view thẳng trường đại học VinUni thơ mộng và hồ Ngọc Trai cát trắng mát mắt. Căn hộ bố trí đầy đủ đồ gồm bếp từ, giường thông minh, bàn trà Sofa, giàn phơi thông minh, điều hòa phòng khách và phòng ngủ. Nhận nhà ngay.',
      project: 'Vinhomes Ocean Park 1',
      subdivision: 'The Sapphire 2',
      building: 'S2.12',
      floor: 15,
      apartmentNumber: '1515',
      type: '1PN',
      price: 7500000,
      transactionType: 'rent',
      area: 47,
      bedrooms: 1,
      bathrooms: 1,
      direction: 'Tây Nam',
      furniture: 'Đầy đủ',
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
      ],
      amenities: ['Sân bóng rổ', 'Hồ san hô cát trắng', 'Sân chơi trẻ em', 'Trường học liên cấp Vinschool', 'Hầm xe rộng thông thoáng'],
      createdAt: '2026-06-05',
      views: 198,
      contacts: 9
    },
    {
      id: 'listing-5',
      title: 'Biệt Thự Song Lập Chà Là 120m2 hoàn thiện sang trọng mặt tiền rộng',
      description: 'Chuyển nhượng biệt thự song lập phân khu Chà Là tại Vinhomes Ocean Park 2. Diện tích 120m2, đã hoàn thiện thiết kế tân cổ điển Pháp 4 tầng đẳng cấp, thang máy cao cấp nhập khẩu của Ý. Toạ lạc tại trục đường nội bộ thông suốt, sát cạnh quảng trường ánh sáng và cụm công viên hồ Wave Park.',
      project: 'Vinhomes Ocean Park 2',
      subdivision: 'Phân khu Chà Là',
      building: 'CL3-08',
      floor: 4,
      apartmentNumber: 'CL3-08',
      type: 'Duplex', // Treat multi-floor townhouse as Duplex or label beautifully
      price: 13500000000,
      transactionType: 'sale',
      area: 120,
      bedrooms: 4,
      bathrooms: 4,
      direction: 'Đông Nam',
      furniture: 'Đầy đủ',
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60'
      ],
      amenities: ['Công viên thể thao hoàng gia', 'Thang máy biệt thự độc lập', 'An ninh 24/7 nghiêm ngặt', 'Đặc quyền câu lạc bộ cư dân', 'Bể bơi resort'],
      createdAt: '2026-06-01',
      views: 450,
      contacts: 22
    },
    {
      id: 'listing-6',
      title: 'Căn hộ Vinhomes Ocean Park 3 phân khu Thời Đại 1PN giá siêu rẻ',
      description: 'Chính chủ kẹt tiền cần nhượng lại căn hộ chung cư phân khu Thời Đại mới nhất tại Vinhomes Ocean Park 3. Căn hộ thiết kế gọn gàng, sở hữu tầm nhìn cảnh quan hồ bơi Lagoon bốn mùa mát rượi quanh năm. Giá cực tốt để đầu tư hoặc an cư tại thành phố biển hoành tráng hàng đầu phía Đông.',
      project: 'Vinhomes Ocean Park 3',
      subdivision: 'Phân khu Thời Đại',
      building: 'TD1',
      floor: 10,
      apartmentNumber: '1004',
      type: '1PN',
      price: 1900000000,
      transactionType: 'sale',
      area: 42,
      bedrooms: 1,
      bathrooms: 1,
      direction: 'Bắc',
      furniture: 'Bàn giao thô',
      images: [
        'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&auto=format&fit=crop&q=60'
      ],
      amenities: ['Paradise Bay tắm 4 mùa', 'Sử dụng miễn phí cụm công viên nước', 'Vườn nướng đại gia đình', 'Bãi đỗ xe thông minh'],
      createdAt: '2026-06-02',
      views: 120,
      contacts: 5
    },
    {
      id: 'listing-7',
      title: 'Cho thuê lâu dài Shophouse Kinh Đô Ánh Sáng kinh doanh sầm uất',
      description: 'Cho thuê căn nhà phố thương mại shophouse trục đường huyết mạch đại lộ Kinh Đô Ánh Sáng của Vinhomes Ocean Park 2. Diện tích sàn sử dụng lên tới 350m2, thiết kế hiện đại sang chảnh 5 tầng thích hợp làm văn phòng đại diện, ngân hàng, spa, chuỗi cafe, nhà hàng ẩm thực Âu Á đa dạng.',
      project: 'Vinhomes Ocean Park 2',
      subdivision: 'Phân khu Kinh Đô',
      building: 'KD-SP.22',
      floor: 5,
      apartmentNumber: 'SP-22',
      type: 'Penthouse', // labeled as Penthouse to showcase large scale premium
      price: 28000000,
      transactionType: 'rent',
      area: 320,
      bedrooms: 5,
      bathrooms: 5,
      direction: 'Bắc',
      furniture: 'Cơ bản',
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60'
      ],
      amenities: ['Mặt phố đi bộ King Club', 'Biển quảng cáo rộng thoáng', 'Sân đậu xe rộng rãi', 'Kết nối liền kề trung tâm ẩm thực sầm uất'],
      createdAt: '2026-05-25',
      views: 322,
      contacts: 11
    },
    {
      id: 'listing-8',
      title: 'Căn hộ Penthouse Masteri Sky view Hồ Điều Hòa 24.5ha đỉnh cao thượng lưu',
      description: 'Siêu phẩm căn hộ Penthouse thông tầng thiết kế kính tràn viền kịch trần Panorama bao quát toàn cảnh 360 độ hồ Ngọc Trai mát rượi. Đích thực là không gian sống tinh hoa xứng tầm của giới chủ nhân tinh tú tại Vinhomes Ocean Park 1. Nội thất thiết kế riêng thiết kế bởi nhà mốt danh giá của Ý.',
      project: 'Vinhomes Ocean Park 1',
      subdivision: 'Masteri Waterfront',
      building: 'M1',
      floor: 30,
      apartmentNumber: '3001',
      type: 'Penthouse',
      price: 18500000000,
      transactionType: 'sale',
      area: 210,
      bedrooms: 4,
      bathrooms: 4,
      direction: 'Đông Nam',
      furniture: 'Đầy đủ',
      images: [
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=60'
      ],
      amenities: ['Dịch vụ quản gia cao cấp', 'Bể bơi tầng mái biệt lập', 'Nút bấm thang máy thông tầng VIP', 'Sky Lounge riêng', 'Gym chăm sóc sức khoẻ'],
      createdAt: '2026-06-08',
      views: 890,
      contacts: 42
    },
    {
      id: 'listing-9',
      title: 'Cho thuê căn 2PN Sapphire 1 toà S1.11 gác thoáng, đủ đồ điện tử xịn xò',
      description: 'Cho thuê lâu dài căn hộ 2 phòng ngủ 1 WC tại toà S1.11, trung tâm phân khu Sapphire 1 Vinhomes Ocean Park 1. Gần ngay hồ điều hoà lớn và nhà giữ xe 5 tầng nổi bật. Căn đã làm ban công decor xanh mướt chim ca, nội thất đầy đủ điều hoà hai chiều, smart tivi 55 inch, máy giặt electrolux, tủ lạnh hai cánh samsung, giường nệm cao su.',
      project: 'Vinhomes Ocean Park 1',
      subdivision: 'The Sapphire 1',
      building: 'S1.11',
      floor: 16,
      apartmentNumber: '1608',
      type: '2PN',
      price: 8500000,
      transactionType: 'rent',
      area: 55,
      bedrooms: 2,
      bathrooms: 1,
      direction: 'Nam',
      furniture: 'Đầy đủ',
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=60'
      ],
      amenities: ['Công viên thể thao ngoài trời', 'Gần nhà để xe thông minh', 'Shophouse ăn uống chân đế đầy đủ'],
      createdAt: '2026-06-07',
      views: 110,
      contacts: 4
    },
    {
      id: 'listing-10',
      title: 'Cho thuê căn cao cấp 3PN Vịnh Thiên Đường Vinhomes Ocean Park 3 cực hot',
      description: 'Cho thuê gấp căn hộ mẫu 3PN phân khu Vịnh Thiên Đường tại OCP3. Thiết kế sang chảnh hiện đại, hệ kính kịch trần tầm nhìn hướng trực diện Paradise Bay có sóng nước bốn mùa. Bạn sẽ được thụ hưởng hệ sinh thái tiện ích vui chơi tắm biển vô hạn cực chill.',
      project: 'Vinhomes Ocean Park 3',
      subdivision: 'Vịnh Thiên Đường',
      building: 'VT1',
      floor: 11,
      apartmentNumber: '1102',
      type: '3PN',
      price: 16000000,
      transactionType: 'rent',
      area: 94,
      bedrooms: 3,
      bathrooms: 2,
      direction: 'Tây Nam',
      furniture: 'Đầy đủ',
      images: [
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=800&auto=format&fit=crop&q=60'
      ],
      amenities: ['Vé vào cửa Paradise Bay vô hạn', 'Bể bơi resort ngoài trời 1000m2', 'Phòng xông hơi sục thảo mộc', 'Nhà hàng ven vịnh'],
      createdAt: '2026-06-04',
      views: 175,
      contacts: 10
    }
  ];

  // Fill array with base listings
  listings.push(...(baseListings as Listing[]));

  // Let's generate remaining 90 listings using structured randomization
  const projects = [
    'Vinhomes Ocean Park 1',
    'Vinhomes Ocean Park 2',
    'Vinhomes Ocean Park 3'
  ] as const;

  const subdivisions: Record<string, string[]> = {
    'Vinhomes Ocean Park 1': ['The Sapphire 1', 'The Sapphire 2', 'The Zenpark', 'The Tonkin', 'Masteri Waterfront'],
    'Vinhomes Ocean Park 2': ['Phân khu Chà Là', 'Phân khu San Hô', 'Phân khu Hải Âu', 'Phân khu Sao Biển', 'Phân khu Ngọc Trai'],
    'Vinhomes Ocean Park 3': ['Phân khu Thời Đại', 'Vịnh Tây', 'Vịnh Thiên Đường', 'Phố Biển', 'Ánh Dương']
  };

  const buildings: Record<string, string[]> = {
    'The Sapphire 1': ['S1.01', 'S1.02', 'S1.05', 'S1.08', 'S1.12'],
    'The Sapphire 2': ['S2.01', 'S2.05', 'S2.09', 'S2.15', 'S2.18'],
    'The Zenpark': ['R1.01', 'R1.03', 'R1.05'],
    'The Tonkin': ['TK1', 'TK2'],
    'Masteri Waterfront': ['M1', 'M2', 'H1', 'H2'],
    'Phân khu Chà Là': ['CL1', 'CL2', 'CL5'],
    'Phân khu San Hô': ['SH1', 'SH3', 'SH5'],
    'Phân khu Hải Âu': ['HA2', 'HA3', 'HA5'],
    'Phân khu Sao Biển': ['SB1', 'SB2'],
    'Phân khu Ngọc Trai': ['NT1', 'NT3'],
    'Phân khu Thời Đại': ['TD1', 'TD2', 'TD3'],
    'Vịnh Tây': ['VT-01', 'VT-02'],
    'Vịnh Thiên Đường': ['VTĐ1', 'VTĐ2'],
    'Phố Biển': ['PB2', 'PB3'],
    'Ánh Dương': ['AD1', 'AD2']
  };

  const directions = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', 'Đông Bắc', 'Tây Nam', 'Tây Bắc'] as const;
  const types = ['Studio', '1PN', '2PN', '3PN', 'Duplex', 'Penthouse'] as const;
  const furnitures = ['Cơ bản', 'Đầy đủ', 'Bàn giao thô'] as const;

  const amenitiesPool = [
    'Bể bơi ngoài trời', 'Vườn nướng BBQ', 'Phòng tập Gym', 'Sân bóng rổ', 
    'Sân Tennis', 'Khu vui chơi trẻ em', 'Hồ nước ngọt', 'Vườn thiền Nhật', 
    'Mega Mall sát cạnh', 'An ninh đa lớp 24/7', 'Chỗ để xe nổi bọc kính',
    'Trường học Vinschool', 'Xe điện đưa đón VinBus miễn phí', 'Sảnh lễ tân phục vụ'
  ];

  // Room configs
  const roomConfigMap = {
    'Studio': { bedrooms: 0, bathrooms: 1, areaRange: [28, 35] },
    '1PN': { bedrooms: 1, bathrooms: 1, areaRange: [43, 50] },
    '2PN': { bedrooms: 2, bathrooms: 2, areaRange: [55, 75] },
    '3PN': { bedrooms: 3, bathrooms: 2, areaRange: [78, 105] },
    'Duplex': { bedrooms: 3, bathrooms: 3, areaRange: [110, 150] },
    'Penthouse': { bedrooms: 4, bathrooms: 4, areaRange: [160, 240] }
  };

  const imagesPool = [
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60'
  ];

  for (let i = 11; i <= 100; i++) {
    const project = projects[i % projects.length];
    const subList = subdivisions[project];
    const subdivision = subList[i % subList.length];
    const bldList = buildings[subdivision] || [' tòa CT1'];
    const building = bldList[i % bldList.length];
    
    const type = types[i % types.length];
    const roomConfig = roomConfigMap[type];
    const { bedrooms, bathrooms, areaRange } = roomConfig;
    const area = Math.floor(Math.random() * (areaRange[1] - areaRange[0]) + areaRange[0]);
    
    const transactionType: 'sale' | 'rent' = i % 2 === 0 ? 'sale' : 'rent';
    const direction = directions[i % directions.length];
    const furniture = furnitures[i % furnitures.length];

    // Build consistent pricing based on area & premium level (Waterfront/Zenpark are more expensive)
    let unitPrice = 0; // price per m2 in listing currency or absolute calculations
    if (transactionType === 'sale') {
      // Sale pricing per m2: OCP1 Sapphire is ~38-46 mil. Premium is ~50-80 mil. OCP2/3 are higher
      let baseSaleM2 = 40; // million per m2
      if (subdivision === 'Masteri Waterfront' || subdivision === 'The Zenpark' || subdivision === 'The Tonkin') {
        baseSaleM2 = 65;
      } else if (project === 'Vinhomes Ocean Park 2' || project === 'Vinhomes Ocean Park 3') {
        baseSaleM2 = 75; // high-end luxury land/premium
      }
      unitPrice = baseSaleM2 * area * 1000000;
    } else {
      // Rental pricing: 5-30 mil per month depending on type
      let baseRentValue = 5000000;
      if (type === 'Studio') baseRentValue = 5500000;
      else if (type === '1PN') baseRentValue = 7500000;
      else if (type === '2PN') baseRentValue = 9500000;
      else if (type === '3PN') baseRentValue = 15000000;
      else if (type === 'Duplex') baseRentValue = 22000000;
      else baseRentValue = 35000000;

      // Adjust for furniture and standard subdivisions
      if (furniture === 'Đầy đủ') {
        baseRentValue += 2000000;
      } else if (furniture === 'Bàn giao thô') {
        baseRentValue -= 1500000;
      }
      unitPrice = baseRentValue;
    }

    const price = Math.round(unitPrice / 50000000) * 50000000 || unitPrice; // Round to clean intervals
    const floor = Math.floor(Math.random() * 25) + 2;
    const aptSfx = String(Math.floor(Math.random() * 24) + 1).padStart(2, '0');
    const apartmentNumber = `${floor}${aptSfx}`;

    const titlePrefix = transactionType === 'sale' ? 'Bán căn hộ' : 'Cho thuê gấp căn hộ';
    const title = `${titlePrefix} ${type} tại tòa ${building} phân khu ${subdivision} - ${project}`;

    const description = `Bất động sản OceanPark Homes hân hạnh giới thiệu căn hộ ${type} tuyệt đẹp tại tòa nhà ${building} của dự án ${project}. Căn hộ nằm tại tầng ${floor}, rất thoáng gió và mát mẻ, vị trí cực kỳ đắc địa giúp di chuyển thuận lợi đến trung tâm Hà Nội, trường đua biển hồ, Vincom Mega Mall hoặc khu vui chơi Mega Grand World sầm uất bậc nhất. Nội thất bàn giao dạng ${furniture} tiêu chuẩn cực cao. Liên hệ Hotline để nhận tư vấn miễn phí ngay hôm nay!`;

    // Select 2-3 images
    const images = [
      imagesPool[i % imagesPool.length],
      imagesPool[(i + 1) % imagesPool.length]
    ];

    // Select 3 amenities
    const amenities = [
      amenitiesPool[i % amenitiesPool.length],
      amenitiesPool[(i + 3) % amenitiesPool.length],
      amenitiesPool[(i + 7) % amenitiesPool.length]
    ];

    listings.push({
      id: `listing-${i}`,
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
      images,
      amenities,
      createdAt: `2026-06-${String((i % 7) + 1).padStart(2, '0')}`,
      views: Math.floor(Math.random() * 200) + 10,
      contacts: Math.floor(Math.random() * 15)
    });
  }

  return listings;
};

export const sampleListings = generate100Apartments();
