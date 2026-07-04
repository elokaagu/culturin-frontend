"use client";

import * as React from "react";

import { DottedMap, type Marker } from "@/components/ui/dotted-map";

type CityMarker = Marker & { label: string };

const CITIES: CityMarker[] = [
  { lat: 43.5528, lng: 7.0174, size: 3, label: "Cannes" },
  { lat: 40.7128, lng: -74.006, size: 3, label: "New York" },
  { lat: 25.7617, lng: -80.1918, size: 3, label: "Miami" },
  { lat: 51.5072, lng: -0.1276, size: 3, label: "London" },
];

export default function AttendeeOriginMap() {
  return (
    <div className="relative mx-auto aspect-[2/1] w-full max-w-4xl">
      <DottedMap<CityMarker>
        markers={CITIES}
        dotColor="rgba(241,233,220,0.35)"
        markerColor="#e08a5b"
        pulse
        renderMarkerOverlay={({ marker, x, y }) => (
          <g style={{ pointerEvents: "none" }}>
            <text
              x={x}
              y={y - 4}
              textAnchor="middle"
              fontSize={2.6}
              fontWeight={600}
              fill="#f1e9dc"
              style={{ fontFamily: "var(--font-sans), ui-sans-serif, system-ui" }}
            >
              {marker.label}
            </text>
          </g>
        )}
      />
    </div>
  );
}
