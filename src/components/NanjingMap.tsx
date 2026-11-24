import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { StationPoint } from '../types';

interface NanjingMapProps {
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  stations: StationPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const NanjingMap: React.FC<NanjingMapProps> = ({
  centerLat,
  centerLng,
  radiusMeters,
  stations,
  selectedId,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [centerLat, centerLng],
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });

    // 高德地图中文矢量底图（清晰展示南京中文路名与地标，无需 API Key）
    L.tileLayer(
      'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      {
        subdomains: ['1', '2', '3', '4'],
        attribution: '地图数据 &copy; 高德地图',
        maxZoom: 18,
        minZoom: 11,
        referrerPolicy: 'no-referrer',
      }
    ).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const group = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerGroupRef.current = group;

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 当前小区位置蓝点
    const userPin = document.createElement('div');
    userPin.style.cssText = 'width:14px;height:14px;border-radius:999px;background:#2563EB;border:3px solid #FFFFFF;box-shadow:0 2px 6px rgba(37,99,235,0.45)';
    const userIcon = L.divIcon({
      className: 'nj-pin-wrapper',
      html: userPin,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    L.marker([centerLat, centerLng], { icon: userIcon }).addTo(group);

    // 距离圈
    L.circle([centerLat, centerLng], {
      radius: radiusMeters,
      color: '#1D6F5A',
      weight: 1.2,
      opacity: 0.4,
      fillColor: '#1D6F5A',
      fillOpacity: 0.05,
      dashArray: '4 4',
    }).addTo(group);

    // 站点标注
    const boundsCoords: [number, number][] = [[centerLat, centerLng]];

    stations.forEach((st) => {
      boundsCoords.push([st.lat, st.lng]);
      const active = st.id === selectedId;
      const distLabel =
        st.distanceMeters < 1000
          ? `${st.distanceMeters}m`
          : `${(st.distanceMeters / 1000).toFixed(1)}km`;

      const pin = document.createElement('div');
      pin.style.cssText = `
        display:inline-flex;align-items:center;gap:4px;
        padding:3px 7px;border-radius:6px;
        font-size:11px;font-weight:700;white-space:nowrap;
        background:${active ? '#1D6F5A' : '#FFFFFF'};
        color:${active ? '#FFFFFF' : '#18181B'};
        border:1.5px solid ${active ? '#1D6F5A' : '#D4D4D8'};
        box-shadow:0 2px 6px rgba(0,0,0,${active ? '0.25' : '0.12'});
        transform:translate(-50%,-100%);
      `;
      const dot = document.createElement('span');
      dot.style.cssText = `width:5px;height:5px;border-radius:99px;background:${active ? '#A7F3D0' : '#1D6F5A'}`;
      const label = document.createElement('span');
      label.textContent = distLabel;
      pin.append(dot, label);

      const icon = L.divIcon({
        className: 'nj-pin-wrapper',
        html: pin,
        iconSize: [0, 0],
      });

      const marker = L.marker([st.lat, st.lng], {
        icon,
        zIndexOffset: active ? 500 : 100,
      }).addTo(group);
      marker.on('click', () => onSelect(st.id));
    });

    if (boundsCoords.length > 1) {
      map.fitBounds(boundsCoords, { padding: [42, 42], maxZoom: 15, animate: true });
    } else {
      map.setView([centerLat, centerLng], 15, { animate: true });
    }
  }, [centerLat, centerLng, radiusMeters, stations, selectedId, onSelect]);

  return (
    <div className="relative h-72 w-full rounded-xl overflow-hidden border border-[#E2E4E0] bg-[#ECEEEB]">
      <div ref={containerRef} className="w-full h-full z-10" />
    </div>
  );
};
