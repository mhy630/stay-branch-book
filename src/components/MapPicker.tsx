import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
  showCoordinates?: boolean;
}

const MapPicker: React.FC<MapPickerProps> = ({
  latitude = 28.6139,
  longitude = 77.2090,
  onLocationChange,
  readOnly = false,
  showCoordinates = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const coordinates = useRef({ lat: latitude, lng: longitude });

  useEffect(() => {
    // Use Mapbox token from environment variable
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

    if (!mapContainer.current || !mapboxgl.accessToken) {
      console.error('Mapbox token is missing or container is not ready');
      return;
    }

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [coordinates.current.lng, coordinates.current.lat],
      zoom: 13,
    });

    // Add navigation controls only in interactive mode
    if (!readOnly) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Create marker (draggable only in interactive mode)
    marker.current = new mapboxgl.Marker({ draggable: !readOnly })
      .setLngLat([coordinates.current.lng, coordinates.current.lat])
      .addTo(map.current);

    // Handle marker drag in interactive mode
    if (!readOnly && onLocationChange) {
      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          coordinates.current = { lat: lngLat.lat, lng: lngLat.lng };
          onLocationChange(lngLat.lat, lngLat.lng);
        }
      });

      // Handle map click in interactive mode
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        coordinates.current = { lat, lng };
        onLocationChange(lat, lng);
        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [readOnly, onLocationChange]);

  // Update map center and marker when coordinates change
  useEffect(() => {
    coordinates.current = { lat: latitude, lng: longitude };
    if (map.current && marker.current) {
      map.current.setCenter([longitude, latitude]);
      marker.current.setLngLat([longitude, latitude]);
    }
  }, [latitude, longitude]);

  // Handle manual coordinate input (only in interactive mode)
  const handleManualCoordinateChange = (type: 'lat' | 'lng', value: string) => {
    if (readOnly || !onLocationChange) return;

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newCoords =
        type === 'lat'
          ? { ...coordinates.current, lat: numValue }
          : { ...coordinates.current, lng: numValue };
      coordinates.current = newCoords;
      onLocationChange(newCoords.lat, newCoords.lng);
      if (map.current && marker.current) {
        map.current.setCenter([newCoords.lng, newCoords.lat]);
        marker.current.setLngLat([newCoords.lng, newCoords.lat]);
      }
    }
  };

  return (
    <div className="space-y-4">
      {showCoordinates && !readOnly && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={coordinates.current.lat}
              onChange={(e) => handleManualCoordinateChange('lat', e.target.value)}
              disabled={readOnly}
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={coordinates.current.lng}
              onChange={(e) => handleManualCoordinateChange('lng', e.target.value)}
              disabled={readOnly}
            />
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-64 rounded-lg border" />

      {!readOnly && (
        <p className="text-xs text-muted-foreground">
          Click on the map or drag the marker to set the exact location
        </p>
      )}
    </div>
  );
};

export default MapPicker;