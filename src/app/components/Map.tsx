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
  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoiZWxva2FhZ3UiLCJhIjoiY2xyODJtOWZxMmd6YjJrbXk1MHNrbDdhNyJ9.jScEFqw_a7q7TEX_dOwvgg"
      initialViewState={{
        longitude: longlat[continent].longitude,
        latitude: longlat[continent].latitude,
        zoom: longlat[continent].zoom,
      }}
      style={{ width: 1000, height: 600 }}
      attributionControl={false}
      mapStyle="mapbox://styles/elokaagu/clr82swh9001o01p431j70659"
    />
  );
}
