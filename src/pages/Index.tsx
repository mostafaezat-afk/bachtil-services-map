import { useState, useCallback } from 'react';
import L from 'leaflet';
import { MainMap, useMapMarkers } from '@/components/MainMap';
import { AppHeader } from '@/components/AppHeader';
import { SearchPanel } from '@/components/SearchPanel';
import { AddServiceModal } from '@/components/AddServiceModal';
import { searchProviders } from '@/lib/api';
import { type ServiceProvider } from '@/lib/constants';
import { toast } from 'sonner';

const Index = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [searchOpen, setSearchOpen] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [results, setResults] = useState<ServiceProvider[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { addProviderMarkers, flyTo } = useMapMarkers(map);

  const handleSearch = useCallback(async (activity: string) => {
    setIsLoading(true);
    setSearchTitle(activity);
    try {
      const data = await searchProviders(activity);
      setResults(data);
      addProviderMarkers(data);
    } catch (err: any) {
      toast.error('حدث خطأ في البحث: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [addProviderMarkers]);

  const handleFlyTo = useCallback((lat: number, lng: number) => {
    flyTo(lat, lng);
  }, [flyTo]);

  return (
    <div className="relative w-full h-full">
      <MainMap onMapReady={setMap} />
      <AppHeader
        onToggleSearch={() => setSearchOpen(!searchOpen)}
        onOpenAdd={() => setAddOpen(true)}
      />
      <SearchPanel
        isOpen={searchOpen}
        results={results}
        searchTitle={searchTitle}
        isLoading={isLoading}
        onSearch={handleSearch}
        onFlyTo={handleFlyTo}
        onClose={() => setSearchOpen(false)}
      />
      <AddServiceModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default Index;
