import { Feature, FeatureCollection, Option } from '../types/map-point';

const prepareMarkers = (map: FeatureCollection, popupContent = false) => {
  return map.features.map((feature) => {
    const { coordinates } = feature.geometry;
    const { balloonContent } = feature.properties;
    const { id, ...options } = feature.options;

    if (!popupContent) {
      return {
        position: coordinates,
        id,
        ...options,
      };
    }

    return {
      position: coordinates,
      popupContent: balloonContent,
      id,
      ...options,
    };
  });
};

const filterFeaturesByOption = (
  collection: FeatureCollection,
  optionKey: string,
): Record<string, Feature[]> => {
  const filteredOptions: Record<string, Feature[]> = {};

  collection.features.forEach((feature) => {
    const value = feature.options[optionKey as Option];
    if (value) {
      if (!(optionKey in filteredOptions)) {
        filteredOptions[optionKey] = [];
      }
      filteredOptions[optionKey].push(feature);
    }
  });

  return filteredOptions;
};

export { prepareMarkers, filterFeaturesByOption };
