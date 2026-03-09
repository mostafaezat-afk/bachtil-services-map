import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CATEGORIES, ACTIVITIES, CONFIG } from '@/lib/constants';
import { registerProvider } from '@/lib/api';
import { toast } from 'sonner';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddServiceModal({ isOpen, onClose }: AddServiceModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [activity, setActivity] = useState('');
  const [lat, setLat] = useState(CONFIG.CENTER[0]);
  const [lng, setLng] = useState(CONFIG.CENTER[1]);
  const [saving, setSaving] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const pickerMapRef = useRef<L.Map | null>(null);

  const activityOptions = category ? ACTIVITIES[category] ?? [] : [];

  // Initialize picker map when modal opens
  useEffect(() => {
    if (!isOpen || !pickerRef.current || pickerMapRef.current) return;

    const timer = setTimeout(() => {
      if (!pickerRef.current) return;
      const map = L.map(pickerRef.current, {
        zoomControl: false,
        maxBounds: CONFIG.MAX_BOUNDS,
        maxBoundsViscosity: 1.0,
        minZoom: 15,
      }).setView(CONFIG.CENTER, 17);

      L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(map);

      map.on('move', () => {
        const c = map.getCenter();
        setLat(c.lat);
        setLng(c.lng);
      });

      pickerMapRef.current = map;
    }, 300);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Cleanup picker map when modal closes
  useEffect(() => {
    if (!isOpen && pickerMapRef.current) {
      pickerMapRef.current.remove();
      pickerMapRef.current = null;
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name || !phone || !activity) {
      toast.error('يرجى ملء جميع الحقول وتحديد الموقع');
      return;
    }
    setSaving(true);
    try {
      await registerProvider({ name, phone, address, activity, lat, lng });
      toast.success('تم إرسال الطلب بنجاح!');
      onClose();
      setName(''); setPhone(''); setAddress(''); setCategory(''); setActivity('');
    } catch {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/85 z-[2000] flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-card w-[90%] max-w-[500px] rounded-2xl max-h-[90vh] flex flex-col shadow-2xl border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <span className="text-lg font-bold">إضافة خدمة جديدة</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto flex-1 space-y-4">
          <FormField label="اسم النشاط" value={name} onChange={setName} placeholder="مثال: مطعم الشبراوي" />
          <FormField label="رقم الهاتف" value={phone} onChange={setPhone} placeholder="01xxxxxxxxx" type="tel" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 font-bold text-sm text-muted-foreground">القسم</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); setActivity(''); }}
                className="w-full p-3 bg-background border border-border rounded-xl text-foreground font-main focus:outline-none focus:border-primary">
                <option value="">اختر القسم</option>
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-bold text-sm text-muted-foreground">النشاط</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-xl text-foreground font-main focus:outline-none focus:border-primary">
                <option value="">اختر النشاط</option>
                {activityOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <FormField label="العنوان" value={address} onChange={setAddress} placeholder="الشارع - المنطقة" />

          <div>
            <label className="block mb-2 font-bold text-sm text-muted-foreground">الموقع على الخريطة (حرك الخريطة)</label>
            <div className="h-[200px] rounded-xl overflow-hidden border border-border relative">
              <div ref={pickerRef} className="w-full h-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[500] text-3xl pointer-events-none drop-shadow-lg">📍</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">الموقع: {lat.toFixed(5)}, {lng.toFixed(5)}</p>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-secondary text-muted-foreground font-bold hover:bg-secondary/80 transition-colors">إلغاء</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {saving ? 'جاري الحفظ...' : 'حفظ الخدمة'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div>
      <label className="block mb-2 font-bold text-sm text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full p-3 bg-background border border-border rounded-xl text-foreground font-main focus:outline-none focus:border-primary" />
    </div>
  );
}
