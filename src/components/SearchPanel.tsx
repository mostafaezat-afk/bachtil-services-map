import { useState, useRef, useCallback } from 'react';
import { ACTIVITIES, type ServiceProvider } from '@/lib/constants';
import { CategoryGrid } from './CategoryGrid';
import { ResultsList } from './ResultsList';

interface SearchPanelProps {
  isOpen: boolean;
  results: ServiceProvider[];
  searchTitle: string;
  isLoading: boolean;
  onSearch: (activity: string) => void;
  onFlyTo: (lat: number, lng: number) => void;
  onClose: () => void;
}

export function SearchPanel({ isOpen, results, searchTitle, isLoading, onSearch, onFlyTo, onClose }: SearchPanelProps) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activities = selectedCat !== 'all' ? ACTIVITIES[selectedCat] ?? [] : [];

  // Filter activities by search query
  const filteredActivities = searchQuery.length >= 2
    ? Object.values(ACTIVITIES).flat().filter((a) => a.includes(searchQuery))
    : activities;

  const handleCategorySelect = (id: string) => {
    setSelectedCat(id);
    if (id !== 'all') setExpanded(true);
  };

  const handleActivityClick = (activity: string) => {
    onSearch(activity);
    setExpanded(true);
  };

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
            results={results}
            title={searchTitle}
            activities={searchQuery.length >= 2 ? filteredActivities : activities}
            onActivityClick={handleActivityClick}
            onFlyTo={(lat, lng) => {
              onFlyTo(lat, lng);
              if (window.innerWidth < 768) setExpanded(false);
            }}
          />
        )}
      </div>
    </>
  );
}
