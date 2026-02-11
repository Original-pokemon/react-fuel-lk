import { useEffect, useState, useMemo } from "react";
import { useMapMarkersStore, useAppStore } from "#root/store";
import { Status } from "#root/const";
import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink } from "react-router-dom";
import PageLayout from "#root/components/layouts/PageLayout/PageLayout";
import Filter from "#root/components/Filter/Filter";
import type { SelectedFiltersType } from "#root/components/Filter/types";
import type { MapMarkerFeatureType } from "#root/types/azs-map";
import Map from "../../components/Map/Map";
import ODINTSOVO_COORD from "../../const/map";
import AppRoute from "../../const/app-route";

function AzsMap() {
  const { data: mapMarkers, status, fetchMapMarkers } = useMapMarkersStore();
  const { nomenclature } = useAppStore();
  const isLoading = status === Status.Loading;

  const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersType>(
    {},
  );

  const mapConfig = {
    center: ODINTSOVO_COORD,
    keyboard: true,
    dragging: true,
    attributionControl: false,
    zoomConfig: {
      zoom: 9,
      scrollWheelZoom: false,
    },
    style: { height: "100%" },
  };

  useEffect(() => {
    if (!mapMarkers && !isLoading) {
      fetchMapMarkers();
    }
  }, [mapMarkers, isLoading, fetchMapMarkers]);

  const handleFilterChange = (filters: SelectedFiltersType) => {
    setSelectedFilters(filters);
  };

  const filteredMarkers = useMemo(() => {
    if (!mapMarkers) return [];

    const selectedFuelKeys =
      selectedFilters.fuelType?.options.map(
        (opt: { value: string }) => opt.value,
      ) || [];
    const showShopsOnly =
      selectedFilters.showShops?.options.some(
        (opt: { value: string }) => opt.value === "true",
      ) || false;

    return mapMarkers.features
      .filter((feature: MapMarkerFeatureType) => {
        const { options } = feature;

        // Check fuel filters
        const hasSelectedFuel =
          selectedFuelKeys.length === 0 ||
          selectedFuelKeys.some(
            (fuel: string) => options[fuel] && options[fuel] !== "0",
          );

        // Check shop filter
        const hasShop = !showShopsOnly || options.shop === "1";

        return hasSelectedFuel && hasShop;
      })
      .map((feature: MapMarkerFeatureType) => {
        const { coordinates } = feature.geometry;
        const { balloonContent } = feature.properties;
        const { id, ...options } = feature.options;

        // Create rich popup content with fuel prices
        const fuelPrices = Object.entries(options)
          .filter(([key, value]) => key !== "shop" && value && value !== "0")
          .map(([fuel, price]) => {
            // Map fuel codes to fuel IDs used in FuelChip component
            const fuelIdMap: Record<string, number> = {
              ai92: 14, // АИ-92
              ai95: 15, // АИ-95
              ai95p: 19, // АИ-95 PROFIT
              ai100p: 21, // АИ-100 PROFIT
              dt: 17, // ДТ
              sug: 18, // Газ
            };
            const fuelId = fuelIdMap[fuel] || 0;

            // Get fuel name from nomenclature
            const fuelInfo = nomenclature?.find(
              (item) => item.fuelid === fuelId,
            );
            const fuelName = fuelInfo ? fuelInfo.fuelname : fuel.toUpperCase();

            // Get fuel color from theme (simplified mapping)
            const fuelColorMap: Record<number, string> = {
              14: "#4CAF50", // АИ-92 - green
              15: "#2196F3", // АИ-95 - blue
              17: "#FF9800", // ДТ - orange
              18: "#9C27B0", // Газ - purple
              19: "#F44336", // АИ-95 PROFIT - red
              21: "#607D8B", // АИ-100 PROFIT - blue-grey
            };
            const fuelColor = fuelColorMap[fuelId] || "#CCCCCC";

            return `<div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
              <span style="background-color: ${fuelColor}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">${fuelName}</span>
              <span style="font-weight: bold;">${price} ₽</span>
            </div>`;
          })
          .join("");

        const popupContentRich = `
          <div style="font-family: Arial, sans-serif; max-width: 250px; line-height: 1.4;">
            <div style="font-weight: bold; margin-bottom: 8px; color: #1976d2;">
              ${balloonContent}
            </div>
            ${
              fuelPrices
                ? `
              <div style="margin-bottom: 8px;">
                <strong style="color: #333;">Цены на топливо:</strong><br/>
                ${fuelPrices}
              </div>
            `
                : ""
            }
            ${options.shop === "1" ? '<div style="color: #4caf50;">🏪 Есть магазин</div>' : ""}
          </div>
        `;

        return {
          position: coordinates,
          popupContent: popupContentRich,
          id,
          ...options,
        };
      });
  }, [mapMarkers, selectedFilters, nomenclature]);

  const fuelOptions = useMemo(() => {
    if (!nomenclature) return [];

    // Map fuel codes to fuel IDs and get names from nomenclature
    const fuelCodeToId: Record<string, number> = {
      ai92: 14, // АИ-92
      ai95: 15, // АИ-95
      ai95p: 19, // АИ-95 PROFIT
      ai100p: 21, // АИ-100 PROFIT
      dt: 17, // ДТ
      sug: 18, // Газ
    };

    return Object.entries(fuelCodeToId).map(([key, fuelId]) => {
      const fuelInfo = nomenclature.find((item) => item.fuelid === fuelId);
      return {
        label: fuelInfo ? fuelInfo.fuelname : key.toUpperCase(),
        value: key,
      };
    });
  }, [nomenclature]);

  return (
    <PageLayout>
      <PageLayout.Breadcrumbs>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
          color="primary.light"
        >
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to={AppRoute.Main}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Главная
          </Link>
          <Typography color="text.primary">Карта АЗС</Typography>
        </Breadcrumbs>
      </PageLayout.Breadcrumbs>
      <PageLayout.Title>Карта АЗС</PageLayout.Title>
      <PageLayout.Toolbar>
        <PageLayout.Filters>
          <Filter onChange={handleFilterChange}>
            <Filter.MultipleChoice
              id="fuelType"
              title="Тип топлива"
              options={fuelOptions}
            />
            <Filter.SingleChoice
              id="showShops"
              title="Магазины"
              defaultValue="false"
              options={[
                { label: "С магазинами", value: "true" },
                { label: "Все", value: "false" },
              ]}
            />
          </Filter>
        </PageLayout.Filters>
      </PageLayout.Toolbar>
      <PageLayout.Content>
        <Box sx={{ height: "70vh" }}>
          <Map mapConfig={mapConfig} markers={filteredMarkers} />
        </Box>
      </PageLayout.Content>
    </PageLayout>
  );
}

export default AzsMap;
