"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Storm } from "../data/storms";
import { displayStormName } from "../data/typhoon-names-ko";

type Props = { storm: Storm; activePoint: number };
const mapAssetOrigin = "https://tiles.openfreemap.org/";
const useMapProxy = process.env.NODE_ENV === "production";
const mapStyle = useMapProxy ? "/map-assets/styles/fiord" : `${mapAssetOrigin}styles/fiord`;

// Vinext does not automatically copy MapLibre's sibling worker module into
// Cloudflare's static asset bundle. Importing its URL makes Vite emit it.
maplibregl.setWorkerUrl(maplibreWorkerUrl);

export function CycloneMap({ storm, activePoint }: Props) {
  const node = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const observedLine = useRef<SVGPolylineElement>(null);
  const forecastLine = useRef<SVGPolylineElement>(null);
  const pointNodes = useRef<(SVGCircleElement | null)[]>([]);
  const rangeNodes = useRef<(SVGPolygonElement | null)[]>([]);
  const activeNode = useRef<SVGCircleElement>(null);
  const activePointRef = useRef(activePoint);
  activePointRef.current = activePoint;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!node.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: node.current,
      style: mapStyle,
      center: [128, 20],
      zoom: 1.8,
      attributionControl: true,
      renderWorldCopies: false,
      transformRequest: useMapProxy
        ? (url) => ({
            url: url.startsWith(mapAssetOrigin)
              ? `/map-assets/${url.slice(mapAssetOrigin.length)}`
              : url,
          })
        : undefined,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("load", () => {
      map.setProjection({ type: "globe" });
      setIsReady(true);
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady) return;
    const coordinates = storm.track.map(({ lng, lat }) => [lng, lat] as [number, number]);
    const bounds = storm.track.reduce((result, item) => result.extend([item.lng, item.lat]), new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
    const draw = () => {
      const pixels = coordinates.map((coordinate) => map.project(coordinate));
      const firstForecast = storm.track.findIndex((point) => point.kind === "forecast");
      const observedEnd = firstForecast < 0 ? pixels.length : firstForecast;
      observedLine.current?.setAttribute("points", pixels.slice(0, observedEnd).map((point) => `${point.x},${point.y}`).join(" "));
      forecastLine.current?.setAttribute("points", firstForecast < 0 ? "" : pixels.slice(Math.max(0, firstForecast - 1)).map((point) => `${point.x},${point.y}`).join(" "));
      pixels.forEach((point, index) => {
        pointNodes.current[index]?.setAttribute("cx", String(point.x));
        pointNodes.current[index]?.setAttribute("cy", String(point.y));
      });
      storm.track.forEach((point, index) => {
        if (!point.radiusKm) return;
        const center = point.radiusCenter ?? [point.lat, point.lng];
        const ring = circleCoordinates(center[0], center[1], point.radiusKm).map((coordinate) => map.project(coordinate));
        rangeNodes.current[index]?.setAttribute("points", ring.map((pixel) => `${pixel.x},${pixel.y}`).join(" "));
      });
      const active = pixels[activePointRef.current];
      if (active) {
        activeNode.current?.setAttribute("cx", String(active.x));
        activeNode.current?.setAttribute("cy", String(active.y));
      }
    };
    map.fitBounds(bounds, { padding: 90, duration: 0, maxZoom: 5 });
    map.once("idle", draw);
    map.on("render", draw);
    return () => { map.off("render", draw); };
  }, [storm, isReady]);

  useEffect(() => {
    const map = mapRef.current;
    const point = storm.track[activePoint];
    if (!map || !point) return;
    const pixel = map.project([point.lng, point.lat]);
    activeNode.current?.setAttribute("cx", String(pixel.x));
    activeNode.current?.setAttribute("cy", String(pixel.y));
  }, [storm, activePoint]);

  return <div className="map-shell" aria-label={`${displayStormName(storm)} 경로 지도`}>
    <div ref={node} className="map" />
    <svg className="track-overlay" aria-hidden="true">
      {storm.track.map((point, index) => point.radiusKm ? <polygon key={`range-${index}`} ref={(element) => { rangeNodes.current[index] = element; }} className={`storm-range ${point.radiusType}`} /> : null)}
      <polyline ref={observedLine} className="observed-track" />
      <polyline ref={forecastLine} className="forecast-track" />
      {storm.track.map((point, index) => <circle key={`${point.lng}-${point.lat}-${index}`} ref={(element) => { pointNodes.current[index] = element; }} className={`${point.kind === "forecast" ? "forecast-point" : "observed-point"} ${windIntensity(point.wind)}`} r={point.kind === "forecast" ? 4.5 : 5} />)}
      <circle ref={activeNode} className="active-point" r="11" />
    </svg>
  </div>;
}

function windIntensity(wind: number | null) {
  if (wind === null) return "intensity-unknown";
  if (wind < 34) return "intensity-depression";
  if (wind < 48) return "intensity-storm";
  if (wind < 64) return "intensity-severe";
  if (wind < 85) return "intensity-typhoon";
  if (wind < 105) return "intensity-very-strong";
  return "intensity-violent";
}

function circleCoordinates(latitude: number, longitude: number, radiusKm: number): [number, number][] {
  const angularDistance = radiusKm / 6371;
  const lat1 = latitude * Math.PI / 180;
  const lng1 = longitude * Math.PI / 180;
  return Array.from({ length: 49 }, (_, index) => {
    const bearing = index / 48 * Math.PI * 2;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(angularDistance) + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing));
    const lng2 = lng1 + Math.atan2(Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1), Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2));
    return [lng2 * 180 / Math.PI, lat2 * 180 / Math.PI];
  });
}
