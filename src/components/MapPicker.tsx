import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ 
  latitude = 28.6139, 
  longitude = 77.2090, 
  onLocationChange 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: latitude, lng: longitude });

  const initializeMap = () => {
    if (!mapContainer.current || !apiKey) return;

    mapboxgl.accessToken = apiKey;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create draggable marker
    marker.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);

    // Handle marker drag
    marker.current.on('dragend', () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        setCoordinates({ lat: lngLat.lat, lng: lngLat.lng });
        onLocationChange(lngLat.lat, lngLat.lng);
      }
    });

    // Handle map click
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setCoordinates({ lat, lng });
      onLocationChange(lat, lng);
      
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      }
    });

    setMapInitialized(true);
  };

  useEffect(() => {
    if (apiKey) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (map.current && marker.current && mapInitialized) {
      map.current.setCenter([coordinates.lng, coordinates.lat]);
      marker.current.setLngLat([coordinates.lng, coordinates.lat]);
    }
  }, [coordinates, mapInitialized]);

  const handleManualCoordinateChange = (type: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newCoords = type === 'lat' 
        ? { ...coordinates, lat: numValue }
        : { ...coordinates, lng: numValue };
      
      setCoordinates(newCoords);
      onLocationChange(newCoords.lat, newCoords.lng);
      
      if (map.current && marker.current && mapInitialized) {
        map.current.setCenter([newCoords.lng, newCoords.lat]);
        marker.current.setLngLat([newCoords.lng, newCoords.lat]);
      }
    }
  };

  if (!apiKey) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <div>
          <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
          <Input
            id="mapbox-token"
            type="password"
            placeholder="Enter your Mapbox public token"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Get your token from{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              mapbox.com
            </a>
          </p>
        </div>
        <Button onClick={initializeMap} disabled={!apiKey}>
          Initialize Map
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={coordinates.lat}
            onChange={(e) => handleManualCoordinateChange('lat', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={coordinates.lng}
            onChange={(e) => handleManualCoordinateChange('lng', e.target.value)}
          />
        </div>
      </div>
      
      <div ref={mapContainer} className="w-full h-64 rounded-lg border" />
      
      <p className="text-xs text-muted-foreground">
        Click on the map or drag the marker to set the exact location
      </p>
    </div>
  );
};

export default MapPicker;