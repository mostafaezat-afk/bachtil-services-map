import { useState } from 'react';
import { ACTIVITIES, type ServiceProvider } from '@/lib/constants';
import { CategoryGrid } from './CategoryGrid';
import { ResultsList } from './ResultsList';
import { Slider } from './ui/slider';

interface SearchPanelProps {
  isOpen: boolean;
  results: ServiceProvider[];
  searchTitle: string;
  isLoading: boolean;
  onSearch: (activity: string) => void;
  onFlyTo: (lat: number, lng: number) => void;
  onClose: () => void;
  onClearResults: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

const calcDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export function SearchPanel({ isOpen, results, searchTitle, isLoading, onSearch, onFlyTo, onClose, userLocation }: SearchPanelProps) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceKm, setDistanceKm] = useState(5);

  const activities = selectedCat !== 'all' ? ACTIVITIES[selectedCat] ?? [] : [];

  // Filter activities by search query
  const filteredActivities = searchQuery.length >= 2
    ? Object.values(ACTIVITIES).flat().filter((a) => a.includes(searchQuery))
    : activities;

  const filteredResults = userLocation
    ? results.filter((provider) => calcDistanceKm(userLocation.lat, userLocation.lng, provider.lat, provider.lng) <= distanceKm)
    : results;

  const handleCategorySelect = (id: string) => {
    setSelectedCat(id);
    setSearchQuery('');
    onClearResults();
    if (id !== 'all') setExpanded(true);
  };

  const handleActivityClick = (activity: string) => {
    onSearch(activity);
    setExpanded(true);
  };

  const isDistanceEmpty = Boolean(userLocation && results.length > 0 && filteredResults.length === 0);

  // Mobile: bottom sheet behavior
  // Desktop: side panel
  return (
    <>
      {/* Mobile bottom panel */}
      <div
        className={`
          fixed bottom-0 left-0 w-full bg-card rounded-t-3xl z-[900] shadow-2xl flex flex-col transition-transform duration-300
          md:top-20 md:right-5 md:left-auto md:bottom-5 md:w-[400px] md:rounded-2xl md:max-h-[calc(100%-100px)]
          ${expanded ? 'max-h-[85%] translate-y-0 md:translate-x-0' : 'translate-y-[calc(100%-200px)] md:translate-y-0'}
          ${isOpen ? 'md:translate-x-0' : 'md:translate-x-[110%]'}
        `}
        style={{ maxHeight: expanded ? '85%' : undefined }}
      >
        {/* Handle (mobile) */}
        <div
          className="w-12 h-1.5 bg-border rounded-full mx-auto mt-3 cursor-pointer md:hidden"
          onClick={() => setExpanded(!expanded)}
        />

        {/* Search input */}
        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="ابحث عن خدمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pr-4 pl-10 rounded-xl bg-secondary border border-border text-foreground font-main text-base focus:outline-none focus:border-primary"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* Categories */}
          <CategoryGrid selected={selectedCat} onSelect={handleCategorySelect} />

          {results.length > 0 && userLocation && (
            <div className="mt-3 rounded-xl border border-border bg-secondary/50 p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-bold text-foreground">فلتر المسافة</span>
                <span className="text-primary font-bold">{distanceKm} كم</span>
              </div>
              <Slider
                min={1}
                max={20}
                step={1}
                value={[distanceKm]}
                onValueChange={(value) => setDistanceKm(value[0])}
                aria-label="فلتر المسافة"
              />
            </div>
          )}

          {results.length > 0 && !userLocation && (
            <p className="mt-3 text-xs text-muted-foreground">فعّل زر "موقعي" بالأعلى لتصفية النتائج حسب المسافة.</p>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <ResultsList
            results={filteredResults}
            title={searchTitle}
            activities={searchQuery.length >= 2 ? filteredActivities : activities}
            onActivityClick={handleActivityClick}
            onFlyTo={(lat, lng) => {
              onFlyTo(lat, lng);
              if (window.innerWidth < 768) setExpanded(false);
            }}
            emptyMessage={isDistanceEmpty ? `لا توجد نتائج ضمن ${distanceKm} كم من موقعك الحالي` : undefined}
          />
        )}
      </div>
    </>
  );
}

