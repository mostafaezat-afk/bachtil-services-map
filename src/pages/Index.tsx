import { useState, useCallback, useRef } from 'react';
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
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

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

  const handleLocateMe = useCallback(() => {
    if (!map) return;
    if (!navigator.geolocation) {
      toast.error('المتصفح لا يدعم تحديد الموقع');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Remove old user location markers
        if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
        if (userCircleRef.current) map.removeLayer(userCircleRef.current);

        // Add accuracy circle
        const circle = L.circle([latitude, longitude], {
          radius: accuracy,
          color: '#2196f3',
          fillColor: '#2196f3',
          fillOpacity: 0.1,
          weight: 2,
        }).addTo(map);
        userCircleRef.current = circle;

        // Add user marker with pulsing dot
        const userIcon = L.divIcon({
          className: 'custom-marker-icon',
          html: `<div style="
            width: 20px; height: 20px; 
            background: #2196f3; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 0 0 6px rgba(33,150,243,0.3), 0 2px 8px rgba(0,0,0,0.4);
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([latitude, longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup('📍 موقعك الحالي');
        userMarkerRef.current = marker;

        setUserLocation({ lat: latitude, lng: longitude });
        map.flyTo([latitude, longitude], 17);
        toast.success('تم تحديد موقعك بنجاح');
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('تم رفض إذن تحديد الموقع. يرجى السماح بالوصول من إعدادات المتصفح');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('غير قادر على تحديد الموقع الحالي');
            break;
          case error.TIMEOUT:
            toast.error('انتهت مهلة تحديد الموقع');
            break;
          default:
            toast.error('حدث خطأ في تحديد الموقع');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [map]);

  return (
    <div className="relative w-full h-full">
      <MainMap onMapReady={setMap} />
      <AppHeader
        onToggleSearch={() => setSearchOpen(!searchOpen)}
        onOpenAdd={() => setAddOpen(true)}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
      />
      <SearchPanel
        isOpen={searchOpen}
        results={results}
        searchTitle={searchTitle}
        isLoading={isLoading}
        onSearch={handleSearch}
        onFlyTo={handleFlyTo}
        onClose={() => setSearchOpen(false)}
        userLocation={userLocation}
      />
      <AddServiceModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default Index;

