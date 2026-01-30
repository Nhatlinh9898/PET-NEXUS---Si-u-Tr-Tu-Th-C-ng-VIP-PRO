
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Terminal, Zap, CheckCircle2, AlertTriangle, 
  Dog, Cat, Stethoscope, Store, Bone, Scissors, 
  Fish, Camera, Heart, Globe, Play, Mail, FileText,
  ListOrdered, BarChart2, CalendarDays, MousePointer2,
  MessageSquareQuote, Layers, Mic2, Star
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Domain, DomainCategory, Tone, Format, GenerationParams } from './types';
import { VoiceStudio } from './components/VoiceStudio';

// --- Constants & Configuration ---

const CATEGORY_MAP: Record<DomainCategory, Domain[]> = {
  [DomainCategory.DOGS]: [Domain.PUPPY_CARE, Domain.SENIOR_DOG, Domain.DOG_BREEDS, Domain.DOG_PREGNANCY],
  [DomainCategory.CATS]: [Domain.KITTEN_CARE, Domain.CAT_BEHAVIOR, Domain.CAT_BREEDS, Domain.INDOOR_CAT],
  [DomainCategory.BUSINESS]: [Domain.PET_SHOP_STARTUP, Domain.SPA_OPERATIONS, Domain.PET_HOTEL, Domain.PET_PRODUCT_SALES],
  [DomainCategory.VET]: [Domain.COMMON_DISEASES, Domain.VACCINATION, Domain.FIRST_AID_PET, Domain.POST_SURGERY],
  [DomainCategory.TRAINING]: [Domain.POTTY_TRAINING, Domain.OBEDIENCE, Domain.TRICKS, Domain.BEHAVIOR_MOD],
  [DomainCategory.NUTRITION]: [Domain.RAW_FOOD, Domain.HOMEMADE_FOOD, Domain.SUPPLEMENTS, Domain.DIET_PLAN],
  [DomainCategory.GROOMING]: [Domain.BASIC_GROOMING, Domain.PROFESSIONAL_CUT, Domain.SKIN_COAT_CARE, Domain.SPA_TREATMENT],
  [DomainCategory.EXOTIC]: [Domain.FRESHWATER_FISH, Domain.MARINE_FISH, Domain.HAMSTER_RABBIT, Domain.REPTILES],
  [DomainCategory.CONTENT]: [Domain.PET_INFLUENCER, Domain.VIRAL_PET_VIDEOS, Domain.PET_PHOTOGRAPHY, Domain.AFFILIATE_PET],
  [DomainCategory.LIFESTYLE]: [Domain.TRAVEL_WITH_PET, Domain.PET_FASHION, Domain.PET_FRIENDLY_HOME, Domain.PET_EVENTS]
};

const DOMAIN_ICONS: Record<Domain, React.ReactNode> = {
  // DOGS
  [Domain.PUPPY_CARE]: <Dog size={18} />,
  [Domain.SENIOR_DOG]: <Heart size={18} />,
  [Domain.DOG_BREEDS]: <Globe size={18} />,
  [Domain.DOG_PREGNANCY]: <Zap size={18} />,
  // CATS
  [Domain.KITTEN_CARE]: <Cat size={18} />,
  [Domain.CAT_BEHAVIOR]: <Zap size={18} />,
  [Domain.CAT_BREEDS]: <Globe size={18} />,
  [Domain.INDOOR_CAT]: <Store size={18} />,
  // BUSINESS
  [Domain.PET_SHOP_STARTUP]: <Store size={18} />,
  [Domain.SPA_OPERATIONS]: <Scissors size={18} />,
  [Domain.PET_HOTEL]: <Store size={18} />,
  [Domain.PET_PRODUCT_SALES]: <BarChart2 size={18} />,
  // VET
  [Domain.COMMON_DISEASES]: <Stethoscope size={18} />,
  [Domain.VACCINATION]: <CheckCircle2 size={18} />,
  [Domain.FIRST_AID_PET]: <AlertTriangle size={18} />,
  [Domain.POST_SURGERY]: <Stethoscope size={18} />,
  // TRAINING
  [Domain.POTTY_TRAINING]: <Zap size={18} />,
  [Domain.OBEDIENCE]: <CheckCircle2 size={18} />,
  [Domain.TRICKS]: <Star size={18} />,
  [Domain.BEHAVIOR_MOD]: <Zap size={18} />,
  // NUTRITION
  [Domain.RAW_FOOD]: <Bone size={18} />,
  [Domain.HOMEMADE_FOOD]: <Bone size={18} />,
  [Domain.SUPPLEMENTS]: <Zap size={18} />,
  [Domain.DIET_PLAN]: <ListOrdered size={18} />,
  // GROOMING
  [Domain.BASIC_GROOMING]: <Scissors size={18} />,
  [Domain.PROFESSIONAL_CUT]: <Scissors size={18} />,
  [Domain.SKIN_COAT_CARE]: <Heart size={18} />,
  [Domain.SPA_TREATMENT]: <Zap size={18} />,
  // EXOTIC
  [Domain.FRESHWATER_FISH]: <Fish size={18} />,
  [Domain.MARINE_FISH]: <Fish size={18} />,
  [Domain.HAMSTER_RABBIT]: <Zap size={18} />,
  [Domain.REPTILES]: <Globe size={18} />,
  // CONTENT
  [Domain.PET_INFLUENCER]: <Camera size={18} />,
  [Domain.VIRAL_PET_VIDEOS]: <Play size={18} />,
  [Domain.PET_PHOTOGRAPHY]: <Camera size={18} />,
  [Domain.AFFILIATE_PET]: <BarChart2 size={18} />,
  // LIFESTYLE
  [Domain.TRAVEL_WITH_PET]: <Globe size={18} />,
  [Domain.PET_FASHION]: <Star size={18} />,
  [Domain.PET_FRIENDLY_HOME]: <Store size={18} />,
  [Domain.PET_EVENTS]: <CalendarDays size={18} />
};

const PLACEHOLDERS: Record<Domain, { topic: string, details: string, keywords: string }> = {
  // DOGS
  [Domain.PUPPY_CARE]: { topic: 'Lịch trình chăm sóc chó Poodle 2 tháng tuổi', details: 'Vừa đón về nhà, chưa tiêm đủ mũi, hay kêu đêm.', keywords: 'Vaccine, Dinh dưỡng, Giấc ngủ' },
  [Domain.SENIOR_DOG]: { topic: 'Chế độ dinh dưỡng cho chó già bị suy thận', details: 'Chó 12 tuổi, ăn kém, cần thực đơn dễ tiêu hóa.', keywords: 'Thận, Protein thấp, Nước' },
  [Domain.DOG_BREEDS]: { topic: 'Đặc điểm tính cách giống chó Border Collie', details: 'Dành cho người mới nuôi, cần biết mức độ vận động.', keywords: 'Thông minh, Vận động cao, Chăn cừu' },
  [Domain.DOG_PREGNANCY]: { topic: 'Dấu hiệu chó sắp sinh và cách đỡ đẻ tại nhà', details: 'Chó mẹ mang thai 60 ngày, có hiện tượng cào ổ.', keywords: 'Chuyển dạ, Cắt rốn, Sưởi ấm' },
  // CATS
  [Domain.KITTEN_CARE]: { topic: 'Cách tập cho mèo con dùng cát vệ sinh', details: 'Mèo con 1 tháng tuổi, hay đi bậy ra gầm giường.', keywords: 'Litter box, Mùi, Kiên nhẫn' },
  [Domain.CAT_BEHAVIOR]: { topic: 'Tại sao mèo hay cào sofa và cách khắc phục', details: 'Mèo Anh Lông Ngắn, đã mua bàn cào nhưng không dùng.', keywords: 'Scratching post, Catnip, Pheromone' },
  [Domain.CAT_BREEDS]: { topic: 'Phân biệt Mèo Anh Lông Ngắn và Mèo Nga', details: 'Đặc điểm ngoại hình, màu mắt, cấu trúc xương.', keywords: 'British Shorthair, Russian Blue, Coat' },
  [Domain.INDOOR_CAT]: { topic: 'Thiết kế không gian cho mèo nuôi trong chung cư', details: 'Nhà 50m2, cần Cat tree và đường chạy trên tường.', keywords: 'Vertical space, Enrichment, Safety' },
  // BUSINESS
  [Domain.PET_SHOP_STARTUP]: { topic: 'Kế hoạch mở Pet Shop vốn 300 triệu', details: 'Mặt bằng 30m2, tập trung bán thức ăn và phụ kiện chó mèo.', keywords: 'Vốn, Nguồn hàng, Địa điểm' },
  [Domain.SPA_OPERATIONS]: { topic: 'Quy trình đón khách tại Spa Thú Cưng', details: 'Tránh lây nhiễm chéo bệnh, check tình trạng da lông trước khi nhận.', keywords: 'Check-in, Khử trùng, Tư vấn' },
  [Domain.PET_HOTEL]: { topic: 'Tiêu chuẩn chuồng trại cho Khách sạn Chó Mèo', details: 'Đảm bảo thông thoáng, vệ sinh, không gian vui chơi.', keywords: 'Kích thước, Vật liệu, Camera' },
  [Domain.PET_PRODUCT_SALES]: { topic: 'Chiến lược bán pate tươi cho mèo kén ăn', details: 'Sản phẩm handmade, không chất bảo quản, giá cao hơn thị trường.', keywords: 'Palatability, Fresh, Storytelling' },
  // VET
  [Domain.COMMON_DISEASES]: { topic: 'Dấu hiệu nhận biết bệnh Parvo ở chó con', details: 'Chó nôn, đi ngoài ra máu, bỏ ăn. Cần xử lý gấp.', keywords: 'Parvovirus, Cấp cứu, Bù nước' },
  [Domain.VACCINATION]: { topic: 'Lịch tiêm phòng đầy đủ cho mèo từ A-Z', details: 'Các mũi 4 bệnh, dại, thời gian nhắc lại.', keywords: 'Vaccine 4 bệnh, Dại, Tẩy giun' },
  [Domain.FIRST_AID_PET]: { topic: 'Sơ cứu khi chó bị sốc nhiệt mùa hè', details: 'Chó thở dốc, nướu đỏ, thân nhiệt cao. Cần hạ nhiệt an toàn.', keywords: 'Heatstroke, Hạ nhiệt, Nước mát' },
  [Domain.POST_SURGERY]: { topic: 'Chăm sóc mèo sau triệt sản (Mèo cái)', details: 'Vệ sinh vết mổ, kiêng ăn uống, đeo loa chống liếm.', keywords: 'Hậu phẫu, Kháng sinh, Vết thương' },
  // TRAINING
  [Domain.POTTY_TRAINING]: { topic: 'Huấn luyện chó Corgi đi vệ sinh đúng chỗ', details: 'Chó 3 tháng tuổi, hay đi bậy trong nhà khi chủ vắng mặt.', keywords: 'Crate training, Khen thưởng, Kiên trì' },
  [Domain.OBEDIENCE]: { topic: 'Dạy lệnh "Ngồi" và "Yên" trong 5 phút', details: 'Phương pháp Lure & Reward dùng bánh thưởng.', keywords: 'Positive Reinforcement, Clicker, Treat' },
  [Domain.TRICKS]: { topic: 'Dạy chó giả chết (Play Dead)', details: 'Chó đã biết lệnh nằm, muốn dạy thêm trò vui.', keywords: 'Trick dog, Shaping, Fun' },
  [Domain.BEHAVIOR_MOD]: { topic: 'Chữa tật sủa dai của chó Phốc sóc', details: 'Sủa khi có người lạ hoặc tiếng động nhỏ.', keywords: 'Desensitization, Barking, Quiet' },
  // NUTRITION
  [Domain.RAW_FOOD]: { topic: 'Công thức Raw Food cho mèo tăng cân', details: 'Tỉ lệ thịt/xương/nội tạng chuẩn 80/10/10.', keywords: 'B.A.R.F, Taurine, Calcium' },
  [Domain.HOMEMADE_FOOD]: { topic: 'Nấu súp gà bí đỏ cho chó biếng ăn', details: 'Chó vừa ốm dậy, cần thức ăn mềm, thơm.', keywords: 'Dễ tiêu hóa, Vitamin, Protein' },
  [Domain.SUPPLEMENTS]: { topic: 'Cách bổ sung Canxi và Dầu cá cho chó con', details: 'Chó đang giai đoạn phát triển khung xương, lông xơ.', keywords: 'Calcium, Omega-3, Growth' },
  [Domain.DIET_PLAN]: { topic: 'Thực đơn giảm cân cho mèo béo phì', details: 'Mèo 8kg, lười vận động, nguy cơ tiểu đường.', keywords: 'Calories, High Protein, Low Carb' },
  // GROOMING
  [Domain.BASIC_GROOMING]: { topic: 'Cách tắm cho mèo sợ nước tại nhà', details: 'Mèo hoảng loạn khi thấy nước, hay cào cấu.', keywords: 'An toàn, Nước ấm, Nhẹ nhàng' },
  [Domain.PROFESSIONAL_CUT]: { topic: 'Hướng dẫn cắt tỉa kiểu gấu Teddy cho Poodle', details: 'Kỹ thuật dùng kéo cong, tạo form tròn.', keywords: 'Scissoring, Grooming, Style' },
  [Domain.SKIN_COAT_CARE]: { topic: 'Trị nấm da cho chó bằng thảo dược', details: 'Chó bị rụng lông thành mảng, ngứa ngáy.', keywords: 'Nấm, Viêm da, Thảo dược' },
  [Domain.SPA_TREATMENT]: { topic: 'Quy trình tắm trắng và ủ dưỡng lông tơ', details: 'Dành cho các dòng chó lông trắng như Samoyed, Bichon.', keywords: 'Whitening, Conditioner, Spa' },
  // EXOTIC
  [Domain.FRESHWATER_FISH]: { topic: 'Setup bể cá thủy sinh cho người mới (Nano tank)', details: 'Bể 30cm, trồng cây cắt cắm, nuôi cá Neon.', keywords: 'Aquascaping, CO2, Lọc' },
  [Domain.MARINE_FISH]: { topic: 'Quy trình cycle bể cá biển', details: 'Tạo hệ vi sinh, đo nồng độ NO2, NO3.', keywords: 'Nitrogen Cycle, Live Rock, Salinity' },
  [Domain.HAMSTER_RABBIT]: { topic: 'Chế độ ăn cho thỏ kiểng tránh bệnh đường ruột', details: 'Tỉ lệ cỏ Timothy và cám nén.', keywords: 'Fiber, Hay, Digestion' },
  [Domain.REPTILES]: { topic: 'Setup chuồng nuôi Rồng Úc (Bearded Dragon)', details: 'Đèn UVA/UVB, nhiệt độ điểm sưởi, nền lót.', keywords: 'Terrarium, Heat lamp, Substrate' },
  // CONTENT
  [Domain.PET_INFLUENCER]: { topic: 'Xây kênh TikTok cho mèo "Chảnh"', details: 'Quay các khoảnh khắc mèo "khinh thường" chủ, nhạc trend.', keywords: 'Viral, Humor, Editing' },
  [Domain.VIRAL_PET_VIDEOS]: { topic: 'Kịch bản video ngắn: "Một ngày của Boss"', details: 'Góc nhìn thứ nhất từ camera gắn trên cổ chó.', keywords: 'POV, GoPro, Fun' },
  [Domain.PET_PHOTOGRAPHY]: { topic: 'Mẹo chụp ảnh chó chạy nhảy (Action Shot)', details: 'Cài đặt tốc độ màn trập, lấy nét liên tục.', keywords: 'Shutter speed, Focus, Lighting' },
  [Domain.AFFILIATE_PET]: { topic: 'Review máy dọn phân mèo tự động để gắn link', details: 'Nhấn mạnh tính tiện lợi, khử mùi, tiết kiệm cát.', keywords: 'Affiliate, Review, Tech' },
  // LIFESTYLE
  [Domain.TRAVEL_WITH_PET]: { topic: 'Chuẩn bị thủ tục đưa chó đi máy bay (Vietnam Airlines)', details: 'Lồng vận chuyển chuẩn IATA, giấy kiểm dịch, vé.', keywords: 'Aviation, Documents, Crate' },
  [Domain.PET_FASHION]: { topic: 'Phối đồ Tết cho Corgi du xuân', details: 'Áo dài cách tân, màu đỏ may mắn, phụ kiện kính râm.', keywords: 'Fashion, Tet Holiday, Cute' },
  [Domain.PET_FRIENDLY_HOME]: { topic: 'Chọn sàn nhà chống trơn trượt cho chó già', details: 'Gạch men quá trơn gây yếu chân, cần giải pháp thay thế.', keywords: 'Flooring, Anti-slip, Safety' },
  [Domain.PET_EVENTS]: { topic: 'Tổ chức sinh nhật cho cún cưng tại công viên', details: 'Bánh kem cho chó, trò chơi vận động, quà tặng cho khách mời.', keywords: 'Party, Cake, Social' }
};

export default function App() {
  const [params, setParams] = useState<GenerationParams>({
    category: DomainCategory.DOGS,
    domain: Domain.PUPPY_CARE,
    topic: '',
    audience: 'Chủ nuôi thú cưng (Pet Owners)',
    tone: Tone.EXPERT,
    format: Format.PROCESS,
    keywords: '',
    details: '',
    goal: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!process.env.API_KEY) {
      setError("CẢNH BÁO: Chưa cấu hình API KEY.");
      return;
    }
    
    if (!params.topic.trim()) {
      setError("Vui lòng nhập Chủ đề chính (Topic).");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemPrompt = `
        Bạn là Thien Master AI - Chuyên gia Thú cưng Toàn năng & Kiến trúc sư Nội dung Pet Industry số 1 Thế giới.
        
        KÍCH HOẠT: Neural System Architecture + Hyper-Context Reasoning + Deep Intent Mapping.

        NHIỆM VỤ: Tạo nội dung chuyên sâu về lĩnh vực THÚ CƯNG (PETS) theo cấu trúc: ${params.format}.
        
        THÔNG SỐ ĐẦU VÀO (INPUT STREAM):
        - Lĩnh vực (Domain): ${params.domain}
        - Chủ đề (Topic): ${params.topic}
        - Mục tiêu (Goal): ${params.goal || 'Tối ưu hóa quy trình chăm sóc và kinh doanh'}
        - Bối cảnh (Context): ${params.details}
        - Từ khóa (Keywords): ${params.keywords}
        - Đối tượng (Audience): ${params.audience}
        - Tone giọng: ${params.tone}
        
        YÊU CẦU ĐẦU RA (OUTPUT BLUEPRINT):
        1. NGÔN NGỮ: Tiếng Việt 100%. Văn phong Chuyên gia, Thực chiến, Giàu cảm xúc.
        2. CẤU TRÚC: Markdown chuẩn (H1, H2, H3, Bullet points).
        
        CHIẾN LƯỢC NỘI DUNG THEO FORMAT:
        
        A. NẾU LÀ "QUY TRÌNH CHUẨN" (Process):
           - Chia thành các Bước (Step-by-step) rõ ràng.
           - Mỗi bước phải có: Hành động cụ thể (Action), Lý do (Why), Lưu ý quan trọng (Note).
           - Checklist kiểm tra cuối quy trình.
           
        B. NẾU LÀ "CHIẾN LƯỢC NGÁCH" (Niche Strategy):
           - Phân tích thị trường ngách (SWOT).
           - Định vị thương hiệu (Positioning).
           - Chiến thuật triển khai (Tactics).
           - Dự phóng tài chính/kết quả (Projection).
           
        C. NẾU LÀ "KẾ HOẠCH 30 NGÀY" (30-Day Plan):
           - Chia làm 4 tuần (Week 1-4).
           - Mỗi ngày/tuần có nhiệm vụ cụ thể.
           - KPI đo lường cho từng giai đoạn.
           
        D. NẾU LÀ "BÀI VIẾT CHUYÊN SÂU" (Deep Dive):
           - Đi sâu vào nguyên lý khoa học/tâm lý (Scientific Basis).
           - Phân tích Case Study thực tế.
           - Giải quyết các hiểu lầm phổ biến (Myths vs Facts).
           
        E. NẾU LÀ "EMAIL MARKETING":
           - Tiêu đề (Subject Line) gây tò mò/khẩn cấp.
           - Hook mở đầu đánh vào nỗi đau (Pain Point).
           - Thân bài kể chuyện (Storytelling).
           - CTA rõ ràng, duy nhất.
           
        F. NẾU LÀ "KỊCH BẢN VIDEO" (Video Script):
           - Chia cột: Hình ảnh (Visual) | Âm thanh (Audio/Voice).
           - Hook 3 giây đầu tiên cực mạnh.
           - Nội dung chính gãy gọn.
           - Kết thúc bằng câu hỏi hoặc kêu gọi hành động.
           
        G. NẾU LÀ "PHÂN TÍCH XU HƯỚNG" (Trend Analysis):
           - Dữ liệu thị trường (Data).
           - Nguyên nhân bùng nổ xu hướng.
           - Cơ hội và Thách thức.
           - Dự đoán tương lai.

        H. NẾU LÀ "HƯỚNG DẪN TỪNG BƯỚC" (Step-by-Step):
           - Cực kỳ chi tiết, cầm tay chỉ việc.
           - Có phần "Chuẩn bị dụng cụ".
           - Hình minh họa (mô tả bằng lời).
           - Mẹo vặt (Pro Tips) từ chuyên gia.

        I. NẾU LÀ "REVIEW CHI TIẾT" (Detailed Review):
           - Thông số kỹ thuật/Thành phần.
           - Trải nghiệm thực tế (Ưu/Nhược điểm).
           - So sánh với đối thủ.
           - Kết luận: Nên mua hay không?

        J. NẾU LÀ "QUẢNG CÁO CHUYỂN ĐỔI CAO" (Ads Copy):
           - Công thức AIDA hoặc PAS.
           - Nhấn mạnh Lợi ích (Benefit) hơn Tính năng (Feature).
           - Ưu đãi khan hiếm (Scarcity).
           - Cam kết bảo hành/Hoàn tiền (Guarantee).

        TUYỆT ĐỐI TUÂN THỦ:
        - Kiến thức Thú y/Dinh dưỡng phải chuẩn xác, an toàn.
        - Thể hiện tình yêu thương động vật sâu sắc.
        - Không đưa lời khuyên gây hại hoặc phản khoa học.
        
        HÃY BẮT ĐẦU NGAY.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        config: {
            temperature: 0.75,
            topK: 40,
            topP: 0.95,
        }
      });

      const text = response.text || '';
      setResult(text);
    } catch (err: any) {
      setError(`LỖI KẾT NỐI NEURAL CORE: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#e0e0e0] font-sans selection:bg-cyber-primary selection:text-black pb-20 overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header className="relative py-16 text-center border-b border-cyber-panel/50 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat group overflow-hidden">
         <div className="absolute inset-0 bg-[#050507]/85 group-hover:bg-[#050507]/75 transition-all duration-1000"></div>
         {/* Animated Grid Overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
         
         <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
            <div className="inline-block mb-4 px-4 py-1 border border-cyber-primary/30 rounded-full bg-cyber-primary/10 backdrop-blur-md animate-pulse-slow">
              <span className="text-cyber-primary text-xs font-bold tracking-[0.3em] uppercase">Imperium Pet System Online</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-cyber-primary to-cyber-secondary mb-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)] uppercase tracking-tight">
              PET NEXUS
            </h1>
            <p className="max-w-6xl text-cyber-text/80 font-sans text-lg md:text-xl font-light tracking-widest uppercase border-t border-b border-cyber-dim/20 py-4 flex flex-wrap justify-center gap-x-4">
              <span className="text-cyber-secondary font-bold">Chăm Sóc</span> • 
              <span className="text-cyber-primary font-bold">Huấn Luyện</span> • 
              <span className="text-cyber-gold font-bold">Dinh Dưỡng</span> • 
              <span className="text-green-400 font-bold">Thú Y</span> •
              <span className="text-pink-500 font-bold">Kinh Doanh</span> •
              <span className="text-red-500 font-bold">Spa & Grooming</span> •
              <span className="text-purple-400 font-bold">Content</span> •
              <span className="text-orange-400 font-bold">Exotic Pets</span>
            </p>
         </div>
      </header>

      <main className="container mx-auto px-4 max-w-7xl mt-12">
        
        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* LEFT PANEL: CONFIGURATION (4 Cols) */}
            <div className="xl:col-span-4 space-y-6">
                
                {/* 1. Category Switcher */}
                <div className="cyber-border p-1 rounded-xl bg-cyber-panel grid grid-cols-2 gap-1">
                    {Object.values(DomainCategory).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setParams({ 
                                    ...params, 
                                    category: cat,
                                    domain: CATEGORY_MAP[cat][0] // Reset domain to first of new category
                                });
                            }}
                            className={`py-3 px-2 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center text-center h-12 ${
                                params.category === cat
                                ? 'bg-gradient-to-r from-cyber-secondary to-cyber-primary text-black shadow-[0_0_15px_rgba(112,0,255,0.4)]'
                                : 'text-cyber-dim hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {cat.split('(')[1]?.replace(')', '') || cat}
                        </button>
                    ))}
                </div>

                {/* 2. Domain Selector */}
                <div className="cyber-border p-6 rounded-xl shadow-2xl bg-[#0e0e14]">
                    <div className="flex items-center space-x-2 mb-4">
                        <Layers className="text-cyber-primary" size={18} />
                        <label className="text-cyber-primary text-xs font-bold uppercase tracking-widest truncate">
                            {params.category.split('(')[1]?.replace(')', '') || params.category}
                        </label>
                    </div>
                    
                    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {CATEGORY_MAP[params.category].map((domain) => (
                            <button
                                key={domain}
                                onClick={() => setParams({ ...params, domain })}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left group ${
                                    params.domain === domain 
                                    ? 'bg-cyber-primary/10 border-cyber-primary text-white shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]' 
                                    : 'bg-transparent border-transparent text-cyber-dim hover:bg-cyber-dim/5 hover:text-gray-300'
                                }`}
                            >
                                <span className={`transition-colors ${params.domain === domain ? 'text-cyber-primary' : 'text-cyber-dim group-hover:text-cyber-primary'}`}>
                                    {DOMAIN_ICONS[domain]}
                                </span>
                                <span className="font-medium text-sm truncate">{domain}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Style & Format */}
                <div className="cyber-border p-6 rounded-xl shadow-lg space-y-5 bg-[#0e0e14]">
                    <div>
                        <label className="flex justify-between text-cyber-secondary text-xs font-bold uppercase tracking-widest mb-2">
                            <span>Tone (Giọng văn)</span>
                            <Mic2 size={14}/>
                        </label>
                        <select 
                            value={params.tone}
                            onChange={(e) => setParams({ ...params, tone: e.target.value as Tone })}
                            className="w-full bg-cyber-black border border-cyber-dim/30 rounded-lg px-4 py-3 text-sm focus:border-cyber-secondary focus:ring-1 focus:ring-cyber-secondary focus:outline-none text-gray-300"
                        >
                            {Object.values(Tone).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="flex justify-between text-cyber-secondary text-xs font-bold uppercase tracking-widest mb-2">
                            <span>Format (Cấu trúc)</span>
                            <Terminal size={14}/>
                        </label>
                        <select 
                            value={params.format}
                            onChange={(e) => setParams({ ...params, format: e.target.value as Format })}
                            className="w-full bg-cyber-black border border-cyber-dim/30 rounded-lg px-4 py-3 text-sm focus:border-cyber-secondary focus:ring-1 focus:ring-cyber-secondary focus:outline-none text-gray-300"
                        >
                            {Object.values(Format).map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: INPUTS & GENERATION (8 Cols) */}
            <div className="xl:col-span-8 space-y-6">
                
                {/* Dynamic Input Form */}
                <div className="cyber-border p-8 rounded-xl bg-cyber-panel shadow-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-cyber-primary/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-display font-bold text-white flex items-center">
                            <span className="text-cyber-primary mr-3">INPUT</span> CORE DATA
                        </h2>
                        <div className="px-3 py-1 rounded bg-cyber-black border border-cyber-dim/30 text-[10px] text-cyber-dim font-mono">
                            AI MODEL: GEMINI 2.5 FLASH
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="col-span-2">
                            <label className="block text-cyber-primary text-xs font-bold uppercase tracking-widest mb-2">
                                Chủ đề chính (Topic) <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                value={params.topic}
                                onChange={(e) => setParams({ ...params, topic: e.target.value })}
                                placeholder={PLACEHOLDERS[params.domain]?.topic || 'Nhập chủ đề...'}
                                className="w-full bg-cyber-black border border-cyber-dim/40 rounded-lg px-4 py-4 text-white placeholder-gray-600 focus:border-cyber-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] focus:outline-none transition-all text-base"
                            />
                        </div>

                         <div className="col-span-2">
                            <label className="block text-cyber-dim text-xs font-bold uppercase tracking-widest mb-2">
                                Mục tiêu (Goal/Outcome)
                            </label>
                            <input 
                                type="text"
                                value={params.goal}
                                onChange={(e) => setParams({ ...params, goal: e.target.value })}
                                placeholder="VD: Giúp chó hết biếng ăn, Tăng doanh số Spa 20%, Chữa dứt điểm nấm..."
                                className="w-full bg-cyber-black border border-cyber-dim/40 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyber-primary focus:outline-none transition-all"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-cyber-dim text-xs font-bold uppercase tracking-widest mb-2">
                                Bối cảnh & Chi tiết (Context)
                            </label>
                            <textarea 
                                value={params.details}
                                onChange={(e) => setParams({ ...params, details: e.target.value })}
                                placeholder={PLACEHOLDERS[params.domain]?.details || 'Nhập chi tiết bối cảnh...'}
                                rows={4}
                                className="w-full bg-cyber-black border border-cyber-dim/40 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyber-primary focus:outline-none transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-cyber-dim text-xs font-bold uppercase tracking-widest mb-2">Từ khóa (Keywords)</label>
                            <input 
                                type="text"
                                value={params.keywords}
                                onChange={(e) => setParams({ ...params, keywords: e.target.value })}
                                placeholder={PLACEHOLDERS[params.domain]?.keywords || 'Nhập từ khóa...'}
                                className="w-full bg-cyber-black border border-cyber-dim/40 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyber-primary focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-cyber-dim text-xs font-bold uppercase tracking-widest mb-2">Đối tượng (Audience)</label>
                            <input 
                                type="text"
                                value={params.audience}
                                onChange={(e) => setParams({ ...params, audience: e.target.value })}
                                placeholder="VD: Người mới nuôi, Bác sĩ thú y, Khách hàng VIP..."
                                className="w-full bg-cyber-black border border-cyber-dim/40 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyber-primary focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-cyber-dim/10">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className={`w-full group relative overflow-hidden rounded-lg p-5 font-display font-bold text-xl tracking-widest transition-all shadow-lg
                                ${isLoading ? 'bg-gray-800 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-cyber-secondary via-cyber-primary to-cyber-secondary bg-[length:200%_auto] animate-gradient text-black hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] hover:scale-[1.01]'}
                            `}
                            style={{ backgroundSize: '200% auto' }}
                        >
                             <span className="relative z-10 flex items-center justify-center space-x-3">
                                {isLoading ? (
                                    <>
                                        <div className="w-6 h-6 border-2 border-gray-600 border-t-black rounded-full animate-spin"></div>
                                        <span>DOGGOS LOADING...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap size={24} className="animate-pulse" />
                                        <span>KÍCH HOẠT HỆ THỐNG</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg flex items-start space-x-3 text-red-400 animate-pulse">
                        <AlertTriangle className="shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold uppercase tracking-wider">Cảnh báo hệ thống</h3>
                            <p className="text-sm opacity-90">{error}</p>
                        </div>
                    </div>
                )}

                {/* RESULT DISPLAY */}
                {result && (
                    <div className="space-y-6 animate-fade-in-up pb-10">
                         {/* Content Area */}
                        <div className="cyber-border p-8 rounded-xl bg-[#0e0e14] shadow-2xl relative">
                             <div className="flex justify-between items-center mb-8 border-b border-cyber-dim/20 pb-4">
                                <h3 className="text-2xl font-display text-cyber-primary flex items-center">
                                    <Terminal className="mr-3" /> PET EXPERT CONSOLE
                                </h3>
                                <div className="flex items-center space-x-2 text-xs font-mono text-cyber-dim bg-cyber-black px-2 py-1 rounded border border-cyber-dim/20">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span>STATUS: PAWSOME</span>
                                </div>
                             </div>
                             
                             <div className="prose prose-invert prose-headings:font-display prose-headings:text-cyber-primary prose-h1:text-3xl prose-h2:text-2xl prose-a:text-cyber-secondary prose-strong:text-white prose-blockquote:border-l-cyber-secondary prose-blockquote:bg-cyber-secondary/10 prose-blockquote:py-1 prose-blockquote:px-4 prose-code:text-cyber-accent prose-code:bg-cyber-dark/50 prose-code:px-1 prose-code:rounded max-w-none">
                                <ReactMarkdown>{result}</ReactMarkdown>
                             </div>
                        </div>

                        {/* Voice Studio Pro Integration */}
                        <VoiceStudio text={result} />
                    </div>
                )}
            </div>
        </div>
      </main>

      <footer className="mt-20 py-8 text-center text-cyber-dim text-sm border-t border-cyber-dim/10 bg-[#050507]">
        <p className="tracking-widest uppercase opacity-50">PET NEXUS SYSTEM v1.0 | ARCHITECTED BY THIEN MASTER AI</p>
      </footer>
    </div>
  );
}
