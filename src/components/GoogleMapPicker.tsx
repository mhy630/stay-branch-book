import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface GoogleMapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({ 
  latitude = 28.6139, 
  longitude = 77.2090, 
  onLocationChange 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: latitude, lng: longitude });

  const initializeMap = async () => {
    if (!mapContainer.current || !apiKey) return;

    try {
      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
      });

      await loader.load();

      map.current = new google.maps.Map(mapContainer.current, {
        center: { lat: coordinates.lat, lng: coordinates.lng },
        zoom: 13,
      });

      // Create draggable marker
      marker.current = new google.maps.Marker({
        position: { lat: coordinates.lat, lng: coordinates.lng },
        map: map.current,
        draggable: true,
        title: "Drag to set location"
      });

      // Handle marker drag
      marker.current.addListener('dragend', () => {
        if (marker.current) {
          const position = marker.current.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            setCoordinates({ lat, lng });
            onLocationChange(lat, lng);
          }
        }
      });

      // Handle map click
      map.current.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setCoordinates({ lat, lng });
          onLocationChange(lat, lng);
          
          if (marker.current) {
            marker.current.setPosition({ lat, lng });
          }
        }
      });

      setMapInitialized(true);
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  };

  useEffect(() => {
    if (apiKey) {
      initializeMap();
    }
  }, [apiKey]);

  useEffect(() => {
    if (map.current && marker.current && mapInitialized) {
      const position = { lat: coordinates.lat, lng: coordinates.lng };
      map.current.setCenter(position);
      marker.current.setPosition(position);
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
        const position = { lat: newCoords.lat, lng: newCoords.lng };
        map.current.setCenter(position);
        marker.current.setPosition(position);
      }
    }
  };

  if (!apiKey) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <div>
          <Label htmlFor="google-maps-key">Google Maps API Key</Label>
          <Input
            id="google-maps-key"
            type="password"
            placeholder="Enter your Google Maps API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Get your API key from{' '}
            <a 
              href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              Google Cloud Console
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

export default GoogleMapPicker;