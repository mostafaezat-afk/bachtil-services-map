import type { ServiceProvider } from '@/lib/constants';

interface ResultsListProps {
  results: ServiceProvider[];
  title: string;
  activities?: string[];
  onActivityClick?: (activity: string) => void;
  onFlyTo: (lat: number, lng: number) => void;
  emptyMessage?: string;
}

export function ResultsList({ results, title, activities, onActivityClick, onFlyTo, emptyMessage }: ResultsListProps) {
  // Show activity list when no results yet
  if (activities && activities.length > 0 && results.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h3 className="mb-3 text-primary font-bold">اختر نشاطاً</h3>
        {activities.map((act) => (
          <button
            key={act}
            onClick={() => onActivityClick?.(act)}
            className="w-full flex items-center justify-between bg-secondary rounded-xl p-4 mb-2.5 border-r-4 border-primary text-foreground font-bold hover:bg-secondary/80 transition-colors"
          >
            <span>{act}</span>
            <i className="fa-solid fa-chevron-left text-muted-foreground" />
          </button>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        <p className="text-muted-foreground text-center">{emptyMessage ?? 'اختر قسماً أو ابحث عن خدمة لظهور النتائج'}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <h3 className="mb-3 text-success font-bold">
        نتائج البحث: {title} ({results.length})
      </h3>
      {results.map((item, i) => (
        <div key={i} className="bg-secondary rounded-xl p-4 mb-2.5 border-r-4 border-primary">
          <div className="font-bold text-lg mb-1">{item.name}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
            <i className="fa-solid fa-phone" /> {item.phone}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
            <i className="fa-solid fa-location-dot" /> {item.address}
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => onFlyTo(item.lat, item.lng)}
              className="flex-1 py-2 rounded-lg border border-border bg-transparent text-foreground font-main hover:bg-primary/10 transition-colors"
            >
              <i className="fa-solid fa-map ml-1" /> الخريطة
            </button>
            <a
              href={`tel:${item.phone}`}
              className="flex-1 py-2 rounded-lg border border-border bg-transparent text-foreground font-main text-center hover:bg-success/10 transition-colors"
            >
              <i className="fa-solid fa-phone ml-1" /> اتصال
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

