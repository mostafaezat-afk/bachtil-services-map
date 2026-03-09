import { useCallback, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CONFIG, type ServiceProvider } from '@/lib/constants';

// Fix default icon paths
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });

interface MainMapProps {
  onMapReady?: (map: L.Map) => void;
}

function MapEvents({ onMapReady }: { onMapReady?: (map: L.Map) => void }) {
  const map = useMap();
  const called = useRef(false);
  if (!called.current && onMapReady) {
    onMapReady(map);
    called.current = true;
  }
  return null;
}

export function MainMap({ onMapReady }: MainMapProps) {
  return (
    <div className="absolute inset-0">
      <MapContainer
        center={CONFIG.CENTER}
        zoom={CONFIG.ZOOM}
        zoomControl={false}
        maxBounds={CONFIG.MAX_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={14}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          maxZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        <MapEvents onMapReady={onMapReady} />
      </MapContainer>
    </div>
  );
}

// Hook for managing markers on the map
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
