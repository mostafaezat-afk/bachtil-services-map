export const CONFIG = {
  SEARCH_API:
    'https://script.google.com/macros/s/AKfycbzUWGPZPocJJoTSs-kVXsH-4w_Do5jjUIEDlzAws8U-McyvHd8VjAttHn34mSHDHZnl/exec',
  REGISTER_API:
    'https://script.google.com/macros/s/AKfycbzUWGPZPocJJoTSs-kVXsH-4w_Do5jjUIEDlzAws8U-McyvHd8VjAttHn34mSHDHZnl/exec',
  CENTER: [30.08771, 31.18415] as [number, number],
  ZOOM: 16,
  MAX_BOUNDS: [
    [30.05771, 31.15415],
    [30.11771, 31.21415],
  ] as [[number, number], [number, number]],
};

export interface Category {
  id: string;
  icon: string;
  label: string;
}

export const CATEGORIES: Category[] = [
  { id: 'all', icon: '🌟', label: 'الكل' },
  { id: 'food', icon: '🍽️', label: 'مأكولات' },
  { id: 'grocery', icon: '🛒', label: 'بقالة' },
  { id: 'services', icon: '🔧', label: 'خدمات' },
  { id: 'shops', icon: '🏪', label: 'محلات' },
  { id: 'medical', icon: '⚕️', label: 'طبي' },
  { id: 'general', icon: '📌', label: 'عام' },
];

export const ACTIVITIES: Record<string, string[]> = {
  food: ['كشري', 'كبابجي ومشويات', 'فرارجي', 'محل فول وطعمية', 'محل أسماك', 'بيتزا وكريب', 'حلواني', 'كافتيريا ومشروبات', 'عصير'],
  grocery: ['سوبر ماركت', 'خضروات وفاكهة', 'جزار', 'مخبز عيش', 'فرن إفرنجي', 'عطارة', 'تموين', 'ألبان'],
  services: ['سباك', 'كهربائي', 'صيانة أجهزة كهربائية', 'صيانة سخانات', 'صيانة مواتير مياه', 'صيانة كمبيوتر ومحمول', 'نجار', 'نقاش', 'ميكانيكي سيارات', 'فني دش وستالايت', 'فني تكييفات', 'حداد'],
  shops: ['ملابس', 'محلات محمول', 'مكتبة وأدوات مدرسية', 'حدايد وبويات', 'جواهرجي', 'أدوات منزلية', 'منظفات وورقيات', 'أحذية وشنط', 'مفروشات', 'كوافير حريمي', 'كوافير رجالي', 'مستحضرات تجميل وهدايا', 'لعب أطفال'],
  medical: ['باطنة', 'قلب', 'أطفال', 'عظام', 'أنف وأذن وحنجرة', 'نساء وتوليد', 'عيون', 'جلدية', 'أسنان', 'مخ وأعصاب', 'مسالك بولية', 'علاج طبيعي', 'جراحة عامة', 'نفسية وعصبية', 'صدر', 'تغذية علاجية', 'سكر وغدد صماء', 'ذكورة وعقم', 'سمعيات', 'تخاطب', 'صيدلية', 'معمل تحاليل', 'مركز أشعة', 'عيادة بيطرية'],
  general: ['خدمات توصيل', 'مدرسة', 'مراكز تقوية', 'محامي', 'سمسار', 'عقارات', 'بلاي ستيشن', 'سنترال', 'مؤسسات حكومية', 'مغسلة', 'حضانة أطفال', 'إيجار سيارات', 'جيم', 'سايبر نت'],
};

export interface ServiceProvider {
  name: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
}
