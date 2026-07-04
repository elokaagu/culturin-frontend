"use client";

import * as React from "react";

import { DottedMap, type Marker } from "@/components/ui/dotted-map";

/** `labelBelow` nudges a label under its marker to avoid collisions between
 * geographically close cities (Cannes sits just under London on a world map). */
type CityMarker = Marker & { label: string; labelBelow?: boolean };

const CITIES: CityMarker[] = [
  { lat: 43.5528, lng: 7.0174, size: 2.6, label: "Cannes", labelBelow: true },
  { lat: 40.7128, lng: -74.006, size: 2.6, label: "New York" },
  { lat: 25.7617, lng: -80.1918, size: 2.6, label: "Miami", labelBelow: true },
  { lat: 51.5072, lng: -0.1276, size: 2.6, label: "London" },
];

export default function AttendeeOriginMap() {
  return (
    <div className="relative mx-auto aspect-[2/1] w-full max-w-4xl">
      <DottedMap<CityMarker>
        markers={CITIES}
        dotColor="rgba(241,233,220,0.35)"
        markerColor="#e08a5b"
        pulse
        renderMarkerOverlay={({ marker, x, y, r }) => (
          <g style={{ pointerEvents: "none" }}>
            <text
              x={x}
              y={marker.labelBelow ? y + r + 3 : y - r - 1.5}
              textAnchor="middle"
              fontSize={2.4}
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
