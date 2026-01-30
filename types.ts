
export enum DomainCategory {
  DOGS = 'DOGS KINGDOM (VƯƠNG QUỐC CHÓ)',
  CATS = 'CATS UNIVERSE (VŨ TRỤ MÈO)',
  BUSINESS = 'PET BUSINESS (KINH DOANH PET)',
  VET = 'VET & HEALTH (THÚ Y & SỨC KHỎE)',
  TRAINING = 'TRAINING & BEHAVIOR (HUẤN LUYỆN)',
  NUTRITION = 'NUTRITION & DIET (DINH DƯỠNG)',
  GROOMING = 'GROOMING & SPA (LÀM ĐẸP)',
  EXOTIC = 'EXOTIC & AQUATIC (THÚ LẠ & THỦY SINH)',
  CONTENT = 'PET CONTENT CREATOR (SÁNG TẠO)',
  LIFESTYLE = 'PET LIFESTYLE (PHONG CÁCH)'
}

export enum Domain {
  // DOGS
  PUPPY_CARE = 'Chăm sóc Chó con (Puppy)',
  SENIOR_DOG = 'Chăm sóc Chó già',
  DOG_BREEDS = 'Kiến thức Giống chó',
  DOG_PREGNANCY = 'Chó sinh sản & Nuôi con',
  
  // CATS
  KITTEN_CARE = 'Chăm sóc Mèo con',
  CAT_BEHAVIOR = 'Tâm lý & Hành vi Mèo',
  CAT_BREEDS = 'Kiến thức Giống mèo',
  INDOOR_CAT = 'Nuôi Mèo trong nhà (Indoor)',
  
  // BUSINESS
  PET_SHOP_STARTUP = 'Khởi nghiệp Pet Shop',
  SPA_OPERATIONS = 'Vận hành Spa Thú cưng',
  PET_HOTEL = 'Kinh doanh Khách sạn Pet',
  PET_PRODUCT_SALES = 'Bán lẻ & Phân phối',
  
  // VET
  COMMON_DISEASES = 'Bệnh thường gặp',
  VACCINATION = 'Lịch tiêm phòng & Tẩy giun',
  FIRST_AID_PET = 'Sơ cấp cứu Thú cưng',
  POST_SURGERY = 'Chăm sóc hậu phẫu',
  
  // TRAINING
  POTTY_TRAINING = 'Huấn luyện đi vệ sinh',
  OBEDIENCE = 'Vâng lời cơ bản (Basic)',
  TRICKS = 'Huấn luyện nâng cao (Tricks)',
  BEHAVIOR_MOD = 'Chỉnh sửa hành vi xấu',
  
  // NUTRITION
  RAW_FOOD = 'Chế độ ăn Raw Food',
  HOMEMADE_FOOD = 'Nấu ăn cho Thú cưng',
  SUPPLEMENTS = 'Thực phẩm chức năng',
  DIET_PLAN = 'Thực đơn giảm cân',
  
  // GROOMING
  BASIC_GROOMING = 'Vệ sinh cơ bản tại nhà',
  PROFESSIONAL_CUT = 'Cắt tỉa tạo kiểu chuyên nghiệp',
  SKIN_COAT_CARE = 'Chăm sóc Da & Lông',
  SPA_TREATMENT = 'Liệu trình Spa trị liệu',
  
  // EXOTIC
  FRESHWATER_FISH = 'Cá cảnh nước ngọt',
  MARINE_FISH = 'Cá cảnh biển',
  HAMSTER_RABBIT = 'Hamster & Thỏ',
  REPTILES = 'Bò sát (Rồng/Rắn/Rùa)',
  
  // CONTENT
  PET_INFLUENCER = 'Xây kênh Pet Influencer',
  VIRAL_PET_VIDEOS = 'Video Thú cưng Viral',
  PET_PHOTOGRAPHY = 'Nhiếp ảnh Thú cưng',
  AFFILIATE_PET = 'Pet Affiliate Marketing',
  
  // LIFESTYLE
  TRAVEL_WITH_PET = 'Du lịch cùng Thú cưng',
  PET_FASHION = 'Thời trang Thú cưng',
  PET_FRIENDLY_HOME = 'Nhà ở thân thiện Thú cưng',
  PET_EVENTS = 'Sự kiện & Offline'
}

export enum Tone {
  EXPERT = 'Chuyên gia & Khoa học (Expert)',
  EMPATHETIC = 'Thấu hiểu & Yêu thương (Empathetic)',
  HUMOROUS = 'Hài hước & Vui nhộn (Humorous)',
  LUXURY = 'Sang trọng & Đẳng cấp (Luxury)',
  URGENT = 'Cảnh báo & Cấp bách (Urgent)',
  INSPIRATIONAL = 'Truyền cảm hứng (Inspirational)',
  SALES = 'Bán hàng & Thuyết phục (Sales)',
  STORYTELLING = 'Kể chuyện & Cảm xúc (Storytelling)',
  EDUCATIONAL = 'Giáo dục & Hướng dẫn (Educational)',
  TRENDY = 'Bắt trend & Gen Z (Trendy)'
}

export enum Format {
  PROCESS = 'Quy trình chuẩn (Standard Process)',
  NICHE_STRATEGY = 'Chiến lược ngách (Niche Strategy)',
  PLAN_30_DAYS = 'Kế hoạch 30 ngày (30-Day Plan)',
  DEEP_DIVE = 'Bài viết chuyên sâu (Deep Dive Article)',
  EMAIL_MKT = 'Email Marketing (Sales/Nurture)',
  VIDEO_SCRIPT = 'Kịch bản Video (Shorts/Long-form)',
  TREND_ANALYSIS = 'Phân tích xu hướng (Trend Analysis)',
  STEP_BY_STEP = 'Hướng dẫn từng bước (Step-by-step)',
  DETAILED_REVIEW = 'Review chi tiết (Product/Service)',
  HIGH_CONV_ADS = 'Quảng cáo chuyển đổi cao (Ads Copy)'
}

export interface GenerationParams {
  category: DomainCategory;
  domain: Domain;
  topic: string;
  audience: string;
  tone: Tone;
  format: Format;
  keywords: string;
  details: string;
  goal: string;
}

export interface VoiceConfig {
  pitch: number;
  rate: number;
  voiceURI: string | null;
}
