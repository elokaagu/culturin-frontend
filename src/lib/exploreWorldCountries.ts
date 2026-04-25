export type ExploreWorldCountry = {
  /** Stable id for keys */
  id: string;
  /** Display name */
  name: string;
  /** Passed to `/search?country=` — should match words in article titles/summaries */
  searchLabel: string;
  imageUrl: string;
  imageAlt: string;
};

/**
 * Home “Explore the World” picks — each card opens search scoped by country/place.
 * Keep `searchLabel` aligned with showcase article copy so fallback search finds matches.
 */
export const exploreWorldCountries: ExploreWorldCountry[] = [
  {
    id: "japan",
    name: "Japan",
    searchLabel: "Japan",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c3e825a901?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Mount Fuji above clouds at sunrise",
  },
  {
    id: "portugal",
    name: "Portugal",
    searchLabel: "Portugal",
    imageUrl: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Yellow historic tram in Lisbon",
  },
  {
    id: "morocco",
    name: "Morocco",
    searchLabel: "Morocco",
    imageUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Marrakech medina alley at dusk",
  },
  {
    id: "argentina",
    name: "Argentina",
    searchLabel: "Argentina",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Patagonian peaks and turquoise water",
  },
  {
    id: "iceland",
    name: "Iceland",
    searchLabel: "Iceland",
    imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Northern lights over snowy landscape",
  },
  {
    id: "italy",
    name: "Italy",
    searchLabel: "Italy",
    imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Canal and historic buildings in Venice",
  },
  {
    id: "mexico",
    name: "Mexico",
    searchLabel: "Mexico",
    imageUrl: "https://images.unsplash.com/photo-1518659526055-ea1c4933a934?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Colourful colonial architecture in Mexico",
  },
  {
    id: "south-africa",
    name: "South Africa",
    searchLabel: "South Africa",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a51eda4105?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Table Mountain above Cape Town coastline",
  },
  {
    id: "vietnam",
    name: "Vietnam",
    searchLabel: "Vietnam",
    imageUrl: "https://images.unsplash.com/photo-1559592419-2d97adc4792d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Busy street scene with scooters in Hanoi",
  },
];
