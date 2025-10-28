/**
 * Map marker geometry information
 */
export type MapMarkerGeometryType = {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
};

/**
 * Map marker properties
 */
export type MapMarkerPropertiesType = {
  balloonContent: string;
};

/**
 * Map marker options (fuel prices and other info)
 */
export type MapMarkerOptionsType = {
  id: string;
  ai92?: string;
  ai95?: string;
  ai95p?: string;
  ai100p?: string;
  dt?: string;
  sug?: string;
  shop: string;
};

/**
 * Individual map marker feature
 */
export type MapMarkerFeatureType = {
  type: 'Feature';
  geometry: MapMarkerGeometryType;
  properties: MapMarkerPropertiesType;
  options: MapMarkerOptionsType;
};

/**
 * Map markers GeoJSON FeatureCollection
 */
export type MapMarkersType = {
  type: 'FeatureCollection';
  features: MapMarkerFeatureType[];
};
