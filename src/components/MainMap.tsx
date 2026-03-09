import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CONFIG, type ServiceProvider } from '@/lib/constants';

// Fix default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const defaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = defaultIcon;

interface MainMapProps {
  onMapReady?: (map: L.Map) => void;
}

export function MainMap({ onMapReady }: MainMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      maxBounds: CONFIG.MAX_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 14,
    }).setView(CONFIG.CENTER, CONFIG.ZOOM);

    L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapRef.current = map;
    onMapReady?.(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}

// Hook for managing markers
export function useMapMarkers(map: L.Map | null) {
  const markersRef = useRef<L.Marker[]>([]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => map?.removeLayer(m));
    markersRef.current = [];
  }, [map]);

  const addProviderMarkers = useCallback(
    (providers: ServiceProvider[]) => {
      if (!map) return;
      clearMarkers();
      const bounds = L.latLngBounds([]);

      providers.forEach((item) => {
        const markerIcon = L.divIcon({
          className: 'custom-marker-icon',
          html: '<div class="custom-marker-dot">📍</div>',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([item.lat, item.lng], { icon: markerIcon }).addTo(map);
        marker.bindPopup(`<b>${item.name}</b><br/>${item.phone}`);
        markersRef.current.push(marker);
        bounds.extend([item.lat, item.lng]);
      });

      if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50] });
    },
    [map, clearMarkers]
  );

  const flyTo = useCallback(
    (lat: number, lng: number) => {
      map?.flyTo([lat, lng], 18);
    },
    [map]
  );

  return { clearMarkers, addProviderMarkers, flyTo };
}
