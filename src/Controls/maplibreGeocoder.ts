import MaplibreGeocoder, {
  CarmenGeojsonFeature,
  MaplibreGeocoderApi,
  MaplibreGeocoderApiConfig,
  MaplibreGeocoderFeatureResults,
} from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import maplibregl from "maplibre-gl";
import { PositionState } from "../types/position-state";

// ref1: https://maplibre.org/maplibre-gl-js/docs/examples/geocoder/
// ref2: https://github.com/maplibre/maplibre-gl-geocoder
const geocoderApi: MaplibreGeocoderApi = {
  forwardGeocode: async (config: MaplibreGeocoderApiConfig) => {
    const features: CarmenGeojsonFeature[] = [];
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
      const response = await fetch(request);
      const geojson = (await response.json()) as MaplibreGeocoderFeatureResults;
      for (const feature of geojson.features) {
        const center =
          feature.bbox !== undefined
            ? [
                feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
                feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
              ]
            : [];
        const point: CarmenGeojsonFeature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center,
          },
          place_name: feature.properties?.display_name ?? "",
          properties: feature.properties,
          id: feature.properties?.place_id ?? "",
          text: feature.properties?.display_name ?? "",
          place_type: ["place"],
          bbox: feature.bbox,
        };
        features.push(point);
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }

    return {
      type: "FeatureCollection",
      features,
    };
  },
};

export const getMapLibreGeocoder = (
  map: maplibregl.Map,
  setPosition: React.Dispatch<React.SetStateAction<PositionState | undefined>>
): MaplibreGeocoder => {
  const geocoder = new MaplibreGeocoder(geocoderApi, {
    maplibregl,
    placeholder: "目的地を入力",
    flyTo: false, // 決定時に地図を移動させない
  });
  let popup: maplibregl.Popup | null = null;

  geocoder.on("result", (e) => {
    const result = e.result as CarmenGeojsonFeature;
    if (result.geometry.type !== "Point") return;
    const coords = result.geometry.coordinates as [number, number];

    const latitude = coords[1];
    const longitude = coords[0];
    const elevation = map.queryTerrainElevation([longitude, latitude]);

    setPosition((prev) => ({
      ...prev,
      destination: {
        latitude,
        longitude,
        altitude: elevation ?? undefined,
      },
    }));

    if (popup) {
      popup.remove();
    }
    popup = new maplibregl.Popup({ closeOnClick: false })
      .setLngLat(coords)
      .setHTML(
        `<div>
           <div class="popup-title">${result.properties?.["name"] ?? ""}</div>
           <div>緯度: ${latitude}</div>
           <div>経度: ${longitude}</div>
            <div>高度: ${elevation}</div>
         </div>`
      )
      .addTo(map);
  });

  const resetButton = document.querySelector("button.reset");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      if (popup) {
        popup.remove();
        popup = null;
      }
      geocoder.clear();
    });
  }

  return geocoder;
};
