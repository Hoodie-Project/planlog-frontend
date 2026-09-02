"use client";

import { useEffect, useRef, useState } from "react";
import { loadNaverMapScript } from "@/lib/naver-map";

type Coordinate = {
  lat: number;
  lng: number;
};

type MarkerItem = Coordinate & {
  id: number;
  html?: string;
};

type NaverMapProps = {
  center: Coordinate;
  path?: Coordinate[];
  markers: MarkerItem[];
  className?: string;
  onMarkerClick?: (markerId: number) => void;
};

function createMarkerContent(id: number) {
  return `
    <div style="
      width: 36px;
      height: 36px;
      border-radius: 999px;
      background: #ff1f4c;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 20px;
      line-height: 1;
      box-shadow: 0 8px 20px rgba(255, 31, 76, 0.28);
    ">${id}</div>
  `;
}

export function NaverMap({ center, path = [], markers, className, onMarkerClick }: NaverMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void loadNaverMapScript()
      .then(() => {
        if (cancelled || !mapElementRef.current || !window.naver?.maps) {
          return;
        }

        const { maps } = window.naver;

        mapInstanceRef.current = new (maps as any).Map(mapElementRef.current, {
          center: new (maps as any).LatLng(center.lat, center.lng),
          zoom: 14,
          minZoom: 11,
          zoomControl: false,
          mapDataControl: false,
          scaleControl: false,
          logoControl: false,
          mapTypeControl: false,
        });

        setErrorMessage(null);
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setErrorMessage(error.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [center.lat, center.lng]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver?.maps) {
      return;
    }

    const { maps } = window.naver;
    const map = mapInstanceRef.current;

    overlaysRef.current.forEach((overlay) => {
      if (overlay?.setMap) {
        overlay.setMap(null);
      }
    });
    overlaysRef.current = [];

    const polyline =
      path.length > 1
        ? new (maps as any).Polyline({
            map,
            path: path.map((point) => new (maps as any).LatLng(point.lat, point.lng)),
            strokeColor: "#6b7b8d",
            strokeOpacity: 0.95,
            strokeWeight: 3,
            strokeLineCap: "round",
            strokeLineJoin: "round",
            strokeStyle: "shortdash",
          })
        : null;

    const mapMarkers = markers.map((marker) => {
      const instance = new (maps as any).Marker({
        map,
        position: new (maps as any).LatLng(marker.lat, marker.lng),
        icon: {
          content: marker.html ?? createMarkerContent(marker.id),
          anchor: new (maps as any).Point(18, 18),
        },
      });

      if (onMarkerClick) {
        (maps as any).Event.addListener(instance, "click", () => onMarkerClick(marker.id));
      }

      return instance;
    });

    overlaysRef.current = [...(polyline ? [polyline] : []), ...mapMarkers];
  }, [markers, onMarkerClick, path]);

  return (
    <div className={className}>
      <div className="h-full w-full" ref={mapElementRef} />
      {errorMessage ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/80 px-6 text-center text-[15px] font-semibold text-[#f30031] backdrop-blur-sm">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
