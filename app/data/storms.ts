export type Basin = "all" | "WP" | "EP" | "NA";

export type TrackPoint = {
  time: string;
  lng: number;
  lat: number;
  wind: number | null;
  pressure: number | null;
  kind?: "observed" | "forecast";
  radiusKm?: number;
  radiusCenter?: [number, number];
  radiusType?: "wind" | "probability";
};

export type Storm = {
  id: string;
  year: number;
  basin: Exclude<Basin, "all">;
  regionalName: string;
  number: string;
  name: string;
  status: "archived" | "provisional" | "active";
  issuedAt?: string;
  peakWind: number | null;
  peakPressure: number | null;
  dates: string;
  track: TrackPoint[];
};

export type StormYear = { year: number; storms: Storm[] };

export const basinLabels: Record<Basin, string> = {
  all: "전체 해역",
  WP: "서태평양 · 태풍",
  EP: "동태평양 · 허리케인",
  NA: "북대서양 · 허리케인",
};
