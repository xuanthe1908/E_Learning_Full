// Mock data for frontend - Products with images
export interface MockProduct {
  _id: string;
  title: string;
  instructorId: string;
  instructorName: string;
  category: string;
  level: string;
  tags: string[];
  price: number;
  isPaid: boolean;
  about: string;
  description: string;
  syllabus: string[];
  requirements: string[];
  thumbnail: {
    name: string;
    key: string;
    url: string;
  };
  thumbnailUrl: string;
  rating: number;
  isVerified: boolean;
  createdAt: string;
  coursesEnrolled: string[];
  completionStatus: number;
}

export const mockProducts: MockProduct[] = [
  {
    _id: '1',
    title: 'Laptop Dell XPS 15 9520 - Intel Core i7',
    instructorId: 'seller1',
    instructorName: 'Nguyễn Văn An',
    category: 'Laptop',
    level: 'Mới',
    tags: ['laptop', 'dell', 'xps', 'intel', 'cao cấp'],
    price: 35000000,
    isPaid: true,
    about: 'Laptop Dell XPS 15 với hiệu năng mạnh mẽ, màn hình OLED 15.6 inch, phù hợp cho công việc chuyên nghiệp và giải trí',
    description: 'Dell XPS 15 9520 là laptop cao cấp với màn hình OLED 15.6 inch 4K, CPU Intel Core i7-12700H thế hệ 12, RAM 32GB DDR5, SSD 1TB NVMe. Thiết kế mỏng nhẹ chỉ 1.92kg, pin lên đến 12 giờ, card đồ họa NVIDIA RTX 3050 Ti.',
    syllabus: [
      'Thông số kỹ thuật chi tiết',
      'Hướng dẫn thiết lập ban đầu',
      'Tối ưu hiệu năng',
      'Bảo hành và hỗ trợ',
      'Phụ kiện đi kèm và nâng cấp'
    ],
    requirements: ['Điện áp: 100-240V AC', 'Hệ điều hành: Windows 11 Pro', 'Kết nối: WiFi 6, Bluetooth 5.2'],
    thumbnail: {
      name: 'dell-xps-15.jpg',
      key: 'products/dell-xps-15.jpg',
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop',
    rating: 4.8,
    isVerified: true,
    createdAt: '2024-01-15T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '2',
    title: 'iPhone 15 Pro Max 256GB - Titanium',
    instructorId: 'seller2',
    instructorName: 'Trần Thị Bình',
    category: 'Điện thoại',
    level: 'Mới',
    tags: ['iphone', 'apple', 'smartphone', 'pro max', 'titanium'],
    price: 32900000,
    isPaid: true,
    about: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP, pin lâu dài, vỏ Titanium cao cấp',
    description: 'iPhone 15 Pro Max là flagship mới nhất của Apple với màn hình Super Retina XDR 6.7 inch, chip A17 Pro mạnh mẽ nhất, hệ thống camera 48MP chuyên nghiệp với zoom quang học 5x, pin lên đến 29 giờ video playback.',
    syllabus: [
      'Tính năng nổi bật của iPhone 15 Pro Max',
      'Hướng dẫn sử dụng iOS 17',
      'Camera Pro và video 4K',
      'Bảo hành Apple Care+',
      'Phụ kiện chính hãng và tối ưu'
    ],
    requirements: ['SIM: Nano SIM hoặc eSIM', 'Hệ điều hành: iOS 17+', 'Kết nối: 5G, WiFi 6E'],
    thumbnail: {
      name: 'iphone-15-pro-max.jpg',
      key: 'products/iphone-15-pro-max.jpg',
      url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=800&fit=crop',
    rating: 4.9,
    isVerified: true,
    createdAt: '2024-01-20T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '3',
    title: 'Samsung Galaxy Watch 6 Classic 47mm',
    instructorId: 'seller2',
    instructorName: 'Trần Thị Bình',
    category: 'Đồng hồ thông minh',
    level: 'Mới',
    tags: ['samsung', 'smartwatch', 'fitness', 'bluetooth', 'classic'],
    price: 8990000,
    isPaid: true,
    about: 'Đồng hồ thông minh với màn hình AMOLED, theo dõi sức khỏe toàn diện, vòng bezel xoay',
    description: 'Samsung Galaxy Watch 6 Classic với màn hình AMOLED 1.4 inch, vòng bezel xoay vật lý, theo dõi nhịp tim, huyết áp, ECG, giấc ngủ, SpO2. Pin lên đến 2 ngày, chống nước IP68.',
    syllabus: [
      'Cài đặt và kết nối với smartphone',
      'Theo dõi sức khỏe và fitness',
      'Ứng dụng và tính năng thông minh',
      'Bảo hành và hỗ trợ',
      'Dây đeo và phụ kiện'
    ],
    requirements: ['Smartphone Android 8.0+ hoặc iOS 13+', 'Bluetooth 5.0', 'Ứng dụng Galaxy Wearable'],
    thumbnail: {
      name: 'galaxy-watch-6.jpg',
      key: 'products/galaxy-watch-6.jpg',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop',
    rating: 4.6,
    isVerified: true,
    createdAt: '2024-01-25T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '4',
    title: 'Tai nghe Sony WH-1000XM5 - Chống ồn chủ động',
    instructorId: 'seller2',
    instructorName: 'Trần Thị Bình',
    category: 'Tai nghe',
    level: 'Mới',
    tags: ['sony', 'headphone', 'noise-cancelling', 'bluetooth', 'wireless'],
    price: 7990000,
    isPaid: true,
    about: 'Tai nghe chống ồn chủ động hàng đầu với chất âm Hi-Res Audio, pin 30 giờ',
    description: 'Sony WH-1000XM5 với công nghệ chống ồn chủ động V1 mới nhất, driver 30mm, hỗ trợ Hi-Res Audio, LDAC codec, pin lên đến 30 giờ, sạc nhanh 3 phút cho 3 giờ nghe nhạc.',
    syllabus: [
      'Kết nối và cài đặt ban đầu',
      'Sử dụng chống ồn chủ động',
      'Tùy chỉnh âm thanh với app',
      'Bảo quản và vệ sinh',
      'Troubleshooting'
    ],
    requirements: ['Bluetooth 5.2', 'Ứng dụng Sony Headphones Connect', 'Smartphone hoặc tablet'],
    thumbnail: {
      name: 'sony-wh1000xm5.jpg',
      key: 'products/sony-wh1000xm5.jpg',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=800&fit=crop',
    rating: 4.7,
    isVerified: true,
    createdAt: '2024-02-01T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '5',
    title: 'iPad Pro 12.9 inch M2 256GB - WiFi + Cellular',
    instructorId: 'seller4',
    instructorName: 'Phạm Thị Dung',
    category: 'Máy tính bảng',
    level: 'Mới',
    tags: ['ipad', 'apple', 'tablet', 'm2', 'pro'],
    price: 28900000,
    isPaid: true,
    about: 'iPad Pro với chip M2, màn hình Liquid Retina XDR 12.9 inch, hỗ trợ 5G',
    description: 'iPad Pro 12.9 inch với chip M2 mạnh mẽ, màn hình Liquid Retina XDR tuyệt đẹp, hỗ trợ Apple Pencil 2 và Magic Keyboard. RAM 8GB, SSD 256GB, camera 12MP với LiDAR, hỗ trợ 5G, WiFi 6E.',
    syllabus: [
      'Thiết lập ban đầu và iCloud',
      'Sử dụng Apple Pencil 2',
      'Ứng dụng chuyên nghiệp cho công việc',
      'Bảo hành Apple Care+',
      'Phụ kiện và nâng cấp'
    ],
    requirements: ['Hệ điều hành: iPadOS 16+', 'Apple ID', 'SIM 5G (nếu có Cellular)'],
    thumbnail: {
      name: 'ipad-pro-12.9.jpg',
      key: 'products/ipad-pro-12.9.jpg',
      url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&h=800&fit=crop',
    rating: 4.9,
    isVerified: true,
    createdAt: '2024-02-05T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '6',
    title: 'MacBook Pro 14 inch M3 Pro - 18GB RAM, 512GB SSD',
    instructorId: 'seller4',
    instructorName: 'Phạm Thị Dung',
    category: 'Laptop',
    level: 'Mới',
    tags: ['macbook', 'apple', 'm3', 'pro', 'laptop'],
    price: 55900000,
    isPaid: true,
    about: 'MacBook Pro với chip M3 Pro, màn hình Liquid Retina XDR, hiệu năng vượt trội',
    description: 'MacBook Pro 14 inch với chip M3 Pro mạnh mẽ, màn hình Liquid Retina XDR 14.2 inch, RAM 18GB unified, SSD 512GB. CPU 12-core, GPU 18-core, pin lên đến 18 giờ, Thunderbolt 4, MagSafe 3.',
    syllabus: [
      'Thiết lập macOS Sonoma',
      'Tối ưu hiệu năng và pin',
      'Ứng dụng chuyên nghiệp',
      'Bảo hành Apple Care+',
      'Phụ kiện và nâng cấp'
    ],
    requirements: ['Hệ điều hành: macOS Sonoma', 'Apple ID', 'Kết nối: WiFi 6E, Bluetooth 5.3'],
    thumbnail: {
      name: 'macbook-pro-14.jpg',
      key: 'products/macbook-pro-14.jpg',
      url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=800&fit=crop',
    rating: 4.8,
    isVerified: true,
    createdAt: '2024-02-10T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '7',
    title: 'AirPods Pro 2 với USB-C - Chống ồn chủ động',
    instructorId: 'seller4',
    instructorName: 'Phạm Thị Dung',
    category: 'Tai nghe',
    level: 'Mới',
    tags: ['airpods', 'apple', 'wireless', 'noise-cancelling', 'usb-c'],
    price: 6990000,
    isPaid: true,
    about: 'Tai nghe không dây với chống ồn chủ động và chất âm Spatial Audio',
    description: 'AirPods Pro 2 với chip H2, chống ồn chủ động cải tiến, chất âm Spatial Audio, Adaptive Audio, pin lên đến 6 giờ (30 giờ với hộp), hộp sạc USB-C, MagSafe charging.',
    syllabus: [
      'Kết nối và cài đặt',
      'Sử dụng chống ồn và Transparency',
      'Tính năng Spatial Audio',
      'Bảo quản và vệ sinh',
      'Troubleshooting'
    ],
    requirements: ['iOS 16+ hoặc macOS 13+', 'iCloud account', 'Bluetooth 5.3'],
    thumbnail: {
      name: 'airpods-pro-2.jpg',
      key: 'products/airpods-pro-2.jpg',
      url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&h=800&fit=crop',
    rating: 4.7,
    isVerified: true,
    createdAt: '2024-02-15T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '8',
    title: 'Camera Canon EOS R6 Mark II - Full Frame',
    instructorId: 'seller3',
    instructorName: 'Lê Minh Cường',
    category: 'Máy ảnh',
    level: 'Mới',
    tags: ['canon', 'camera', 'mirrorless', 'professional', 'full-frame'],
    price: 45900000,
    isPaid: true,
    about: 'Máy ảnh mirrorless full-frame với cảm biến 24.2MP, quay video 4K 60fps',
    description: 'Canon EOS R6 Mark II với cảm biến full-frame 24.2MP, quay video 4K 60fps, chụp liên tiếp 40fps, ổn định hình ảnh 5 trục, màn hình cảm ứng xoay 3.2 inch, viewfinder OLED 3.69M dots.',
    syllabus: [
      'Thiết lập cơ bản và menu',
      'Kỹ thuật chụp ảnh chuyên nghiệp',
      'Quay video 4K và color grading',
      'Bảo quản và bảo dưỡng',
      'Lens và phụ kiện'
    ],
    requirements: ['Thẻ nhớ: CFexpress Type B hoặc SD UHS-II', 'Pin LP-E6NH', 'Lens RF mount'],
    thumbnail: {
      name: 'canon-r6-mark2.jpg',
      key: 'products/canon-r6-mark2.jpg',
      url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=1200&h=800&fit=crop',
    rating: 4.8,
    isVerified: true,
    createdAt: '2024-02-20T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '9',
    title: 'Loa JBL Charge 5 - Bluetooth Portable',
    instructorId: 'seller5',
    instructorName: 'Hoàng Văn Em',
    category: 'Âm thanh',
    level: 'Mới',
    tags: ['jbl', 'speaker', 'bluetooth', 'portable', 'waterproof'],
    price: 3990000,
    isPaid: true,
    about: 'Loa Bluetooth không dây với pin lâu và chống nước IPX7',
    description: 'JBL Charge 5 với công suất 40W, pin 20 giờ, chống nước IPX7, Bluetooth 5.1, có thể sạc thiết bị khác qua USB. Âm thanh mạnh mẽ, bass sâu với JBL Bass Radiator, PartyBoost để kết nối nhiều loa.',
    syllabus: [
      'Kết nối Bluetooth',
      'Sử dụng pin và sạc',
      'Chống nước và bảo quản',
      'Tính năng PartyBoost',
      'Troubleshooting'
    ],
    requirements: ['Bluetooth 5.1+', 'Cáp USB-C', 'Smartphone hoặc tablet'],
    thumbnail: {
      name: 'jbl-charge-5.jpg',
      key: 'products/jbl-charge-5.jpg',
      url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&h=800&fit=crop',
    rating: 4.5,
    isVerified: true,
    createdAt: '2024-02-25T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '10',
    title: 'Bàn phím cơ Keychron K8 Pro - Wireless Mechanical',
    instructorId: 'seller5',
    instructorName: 'Hoàng Văn Em',
    category: 'Phụ kiện',
    level: 'Mới',
    tags: ['keyboard', 'mechanical', 'wireless', 'rgb', 'keychron'],
    price: 3290000,
    isPaid: true,
    about: 'Bàn phím cơ không dây với switch Gateron, đèn LED RGB, layout 87 keys',
    description: 'Keychron K8 Pro với layout 87 keys, switch Gateron G Pro (Brown/Blue/Red), kết nối Bluetooth 5.1 và USB-C, đèn LED RGB, pin 4000mAh, hỗ trợ QMK/VIA. Tương thích Windows, Mac, Linux.',
    syllabus: [
      'Kết nối và cài đặt',
      'Tùy chỉnh đèn LED RGB',
      'Bảo quản và vệ sinh',
      'Thay switch và keycaps',
      'Customization với QMK/VIA'
    ],
    requirements: ['Bluetooth 5.1+ hoặc USB-C', 'Hệ điều hành: Windows/Mac/Linux', 'Ứng dụng Keychron (tùy chọn)'],
    thumbnail: {
      name: 'keychron-k8-pro.jpg',
      key: 'products/keychron-k8-pro.jpg',
      url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&h=800&fit=crop',
    rating: 4.6,
    isVerified: true,
    createdAt: '2024-03-01T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '11',
    title: 'Samsung Galaxy S24 Ultra 512GB - Titanium',
    instructorId: 'seller1',
    instructorName: 'Nguyễn Văn An',
    category: 'Điện thoại',
    level: 'Mới',
    tags: ['samsung', 'galaxy', 'smartphone', 'ultra', 's-pen'],
    price: 29900000,
    isPaid: true,
    about: 'Galaxy S24 Ultra với S Pen, camera 200MP, chip Snapdragon 8 Gen 3',
    description: 'Samsung Galaxy S24 Ultra với màn hình Dynamic AMOLED 6.8 inch, chip Snapdragon 8 Gen 3, RAM 12GB, bộ nhớ 512GB, camera 200MP, S Pen tích hợp, pin 5000mAh, sạc nhanh 45W, hỗ trợ 5G, chống nước IP68.',
    syllabus: [
      'Thiết lập và One UI 6.1',
      'Sử dụng S Pen',
      'Camera Pro và video 8K',
      'Bảo hành Samsung Care+',
      'Phụ kiện chính hãng'
    ],
    requirements: ['SIM: Nano SIM hoặc eSIM', 'Hệ điều hành: Android 14', 'Kết nối: 5G, WiFi 7'],
    thumbnail: {
      name: 'galaxy-s24-ultra.jpg',
      key: 'products/galaxy-s24-ultra.jpg',
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop',
    rating: 4.7,
    isVerified: true,
    createdAt: '2024-03-05T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '12',
    title: 'Xiaomi 14 Pro - Snapdragon 8 Gen 3',
    instructorId: 'seller1',
    instructorName: 'Nguyễn Văn An',
    category: 'Điện thoại',
    level: 'Mới',
    tags: ['xiaomi', 'smartphone', 'snapdragon', 'camera', 'flagship'],
    price: 19900000,
    isPaid: true,
    about: 'Xiaomi 14 Pro với chip Snapdragon 8 Gen 3, camera Leica, sạc nhanh 120W',
    description: 'Xiaomi 14 Pro với màn hình AMOLED 6.73 inch, chip Snapdragon 8 Gen 3, RAM 12GB, bộ nhớ 512GB, camera Leica 50MP, pin 4880mAh, sạc nhanh 120W, sạc không dây 50W, hỗ trợ 5G, chống nước IP68.',
    syllabus: [
      'Thiết lập MIUI 15',
      'Camera Leica và tính năng',
      'Sạc nhanh và tối ưu pin',
      'Bảo hành và hỗ trợ',
      'Phụ kiện Xiaomi'
    ],
    requirements: ['SIM: Nano SIM', 'Hệ điều hành: Android 14', 'Kết nối: 5G, WiFi 7'],
    thumbnail: {
      name: 'xiaomi-14-pro.jpg',
      key: 'products/xiaomi-14-pro.jpg',
      url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&h=800&fit=crop',
    rating: 4.6,
    isVerified: true,
    createdAt: '2024-03-10T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '13',
    title: 'ASUS ROG Zephyrus G16 - RTX 4060',
    instructorId: 'seller5',
    instructorName: 'Hoàng Văn Em',
    category: 'Laptop',
    level: 'Mới',
    tags: ['asus', 'rog', 'gaming', 'laptop', 'rtx'],
    price: 42900000,
    isPaid: true,
    about: 'Laptop gaming ASUS ROG với RTX 4060, màn hình 16 inch, hiệu năng gaming mạnh mẽ',
    description: 'ASUS ROG Zephyrus G16 với màn hình 16 inch 165Hz, CPU Intel Core i9-13900H, GPU NVIDIA RTX 4060, RAM 16GB DDR5, SSD 1TB NVMe. Thiết kế mỏng nhẹ, hệ thống tản nhiệt ROG, bàn phím RGB, pin lên đến 8 giờ.',
    syllabus: [
      'Thiết lập và cài đặt',
      'Tối ưu hiệu năng gaming',
      'Armoury Crate và RGB',
      'Bảo hành và hỗ trợ',
      'Nâng cấp và phụ kiện'
    ],
    requirements: ['Điện áp: 100-240V AC', 'Hệ điều hành: Windows 11', 'Kết nối: WiFi 6E, Bluetooth 5.2'],
    thumbnail: {
      name: 'asus-rog-zephyrus.jpg',
      key: 'products/asus-rog-zephyrus.jpg',
      url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&h=800&fit=crop',
    rating: 4.7,
    isVerified: true,
    createdAt: '2024-03-15T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '14',
    title: 'Bose QuietComfort 45 - Chống ồn',
    instructorId: 'seller2',
    instructorName: 'Trần Thị Bình',
    category: 'Tai nghe',
    level: 'Mới',
    tags: ['bose', 'headphone', 'noise-cancelling', 'comfort', 'wireless'],
    price: 6990000,
    isPaid: true,
    about: 'Tai nghe chống ồn Bose với công nghệ Acoustic Noise Cancelling',
    description: 'Bose QuietComfort 45 với công nghệ chống ồn Acoustic Noise Cancelling, pin 24 giờ, sạc nhanh 15 phút cho 3 giờ, Bluetooth 5.1, hỗ trợ Google Assistant và Amazon Alexa, thiết kế thoải mái cho cả ngày.',
    syllabus: [
      'Kết nối và cài đặt',
      'Sử dụng chống ồn',
      'Bose Music app',
      'Bảo quản và vệ sinh',
      'Troubleshooting'
    ],
    requirements: ['Bluetooth 5.1', 'Ứng dụng Bose Music', 'Smartphone hoặc tablet'],
    thumbnail: {
      name: 'bose-qc45.jpg',
      key: 'products/bose-qc45.jpg',
      url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&h=800&fit=crop',
    rating: 4.6,
    isVerified: true,
    createdAt: '2024-03-20T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  },
  {
    _id: '15',
    title: 'Apple Watch Series 9 - GPS + Cellular 45mm',
    instructorId: 'seller4',
    instructorName: 'Phạm Thị Dung',
    category: 'Đồng hồ thông minh',
    level: 'Mới',
    tags: ['apple', 'watch', 'smartwatch', 'fitness', 'cellular'],
    price: 12900000,
    isPaid: true,
    about: 'Apple Watch Series 9 với chip S9, màn hình Always-On, hỗ trợ Cellular',
    description: 'Apple Watch Series 9 với chip S9 mới, màn hình Always-On Retina, theo dõi sức khỏe toàn diện, pin lên đến 18 giờ, hỗ trợ Cellular độc lập, chống nước 50m, tính năng Double Tap, Siri on-device.',
    syllabus: [
      'Thiết lập và kết nối iPhone',
      'Theo dõi sức khỏe và fitness',
      'Ứng dụng và tính năng',
      'Bảo hành Apple Care+',
      'Dây đeo và phụ kiện'
    ],
    requirements: ['iPhone 8+ với iOS 17+', 'Apple ID', 'SIM eSIM (nếu có Cellular)'],
    thumbnail: {
      name: 'apple-watch-series9.jpg',
      key: 'products/apple-watch-series9.jpg',
      url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&h=800&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&h=800&fit=crop',
    rating: 4.8,
    isVerified: true,
    createdAt: '2024-03-25T10:00:00Z',
    coursesEnrolled: [],
    completionStatus: 0
  }
];

// Helper functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Laptop': '💻',
    'Điện thoại': '📱',
    'Máy tính bảng': '📱',
    'Tai nghe': '🎧',
    'Đồng hồ thông minh': '⌚',
    'Máy ảnh': '📷',
    'Âm thanh': '🔊',
    'Phụ kiện': '⌨️'
  };
  return icons[category] || '📦';
};
