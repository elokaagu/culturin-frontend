"use client";

import * as React from "react";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const longlat: {
  [key: string]: { longitude: number; latitude: number; zoom: number };
} = {
  africa: {
    longitude: 7.512711225323216,
    latitude: 6.514176575360224,
    zoom: 1.5,
  },
  europe: {
    longitude: 0.23172922399763252,
    latitude: 51.304353074077454,
    zoom: 1.5,
  },
  asia: {
    longitude: 103.21620984864364,
    latitude: 33.85208636968606,
    zoom: 1.5,
  },
  southAmerica: {
    longitude: -43.25828393510122,
    latitude: -22.88609069522174,
    zoom: 1.5,
  },
  northAmerica: {
    longitude: -119.03313261981654,
    latitude: 36.957286702036356,
    zoom: 2,
  },
};

export default function MapGL({ continent }: { continent: string }) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const view = longlat[continent];

  if (!mapboxToken) {
    return (
      <div className="flex h-[min(24rem,50vh)] w-full items-center justify-center rounded-xl border border-amber-500/30 bg-neutral-900 px-4 text-center text-sm text-white/70">
        Map is unavailable: set{" "}
        <code className="rounded bg-black/40 px-1 text-amber-200/90">
          NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        </code>{" "}
        in your environment.
      </div>
    );
  }

  if (!view) {
    return (
      <div className="flex h-[min(24rem,50vh)] w-full items-center justify-center rounded-xl border border-white/10 bg-neutral-900 text-sm text-white/60">
        Unknown region: {continent}
      </div>
    );
  }

  return (
    <div className="h-[min(28rem,55vh)] w-full min-h-[280px] sm:h-[min(32rem,60vh)] lg:min-h-[420px]">
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: view.longitude,
          latitude: view.latitude,
          zoom: view.zoom,
        }}
        style={{ width: "100%", height: "100%", borderRadius: 12 }}
        attributionControl={false}
        mapStyle="mapbox://styles/elokaagu/clr82swh9001o01p431j70659"
      />
    </div>
  );
}
