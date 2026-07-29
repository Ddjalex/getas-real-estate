import React, { useEffect, useRef } from "react";

interface MapPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  readonly?: boolean;
}

// Default center: Addis Ababa
const DEFAULT_LAT = 9.0054;
const DEFAULT_LNG = 38.7636;
const DEFAULT_ZOOM = 13;

export function MapPicker({ lat, lng, onChange, readonly = false }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    import("leaflet").then((L) => {
      // Inject Leaflet CSS if not already present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Fix default icon paths (broken with bundlers)
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center: [number, number] = lat !== null && lng !== null ? [lat, lng] : [DEFAULT_LAT, DEFAULT_LNG];

      if (!mapRef.current) {
        const map = L.map(containerRef.current!, { zoomControl: true }).setView(center, DEFAULT_ZOOM);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        if (lat !== null && lng !== null) {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }

        if (!readonly) {
          map.on("click", (e) => {
            const { lat: clickLat, lng: clickLng } = e.latlng;
            if (markerRef.current) {
              markerRef.current.setLatLng([clickLat, clickLng]);
            } else {
              markerRef.current = L.marker([clickLat, clickLng]).addTo(map);
            }
            onChange(clickLat, clickLng);
          });
        }

        mapRef.current = map;
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker when props change externally
  useEffect(() => {
    if (!mapRef.current || lat === null || lng === null) return;
    import("leaflet").then((L) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else if (mapRef.current) {
        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
      }
      mapRef.current?.setView([lat, lng], DEFAULT_ZOOM);
    });
  }, [lat, lng]);

  return (
    <div>
      <div ref={containerRef} style={{ height: 280, width: "100%", borderRadius: 4, border: "1px solid #d1d5db" }} />
      {!readonly && (
        <p className="text-xs text-gray-500 mt-1">
          {lat !== null && lng !== null
            ? `📍 ${lat.toFixed(5)}, ${lng.toFixed(5)} — click to move pin`
            : "Click on the map to set the property location"}
        </p>
      )}
    </div>
  );
}
