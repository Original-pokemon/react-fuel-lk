import { Feature, FeatureCollection, Option } from '../types/map-point';

const prepareMarkers = (map: any, popupContent = false) => {
  return map.features.map((feature: any) => {
    const { coordinates } = feature.geometry;
    const { balloonContent } = feature.properties;
    const { id, ...options } = feature.options;

    // Create rich popup content with fuel prices
    const fuelPrices = Object.entries(options)
      .filter(([key, value]) => key !== 'shop' && value && value !== '0') // Filter out shop and empty/zero values
      .map(([fuel, price]) => {
        // Map fuel codes to readable names
        const fuelNames: Record<string, string> = {
          ai92: 'АИ-92',
          ai95: 'АИ-95',
          ai95p: 'АИ-95 Премиум',
          ai100p: 'АИ-100 Премиум',
          dt: 'ДТ (Дизель)',
          sug: 'СУГ (Газ)',
        };
        const fuelName = fuelNames[fuel] || fuel.toUpperCase();
        return `${fuelName}: ${price} ₽`;
      })
      .join('<br/>');

    const popupContentRich = `
      <div style="font-family: Arial, sans-serif; max-width: 250px; line-height: 1.4;">
        <div style="font-weight: bold; margin-bottom: 8px; color: #1976d2;">
          ${balloonContent}
        </div>
        ${fuelPrices
        ? `
          <div style="margin-bottom: 8px;">
            <strong style="color: #333;">Цены на топливо:</strong><br/>
            ${fuelPrices}
          </div>
        `
        : ''
      }
        ${options.shop === '1' ? '<div style="color: #4caf50;">🏪 Есть магазин</div>' : ''}
      </div>
    `;

    if (!popupContent) {
      return {
        position: coordinates,
        id,
        ...options,
      };
    }

    return {
      position: coordinates,
      popupContent: popupContentRich,
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
