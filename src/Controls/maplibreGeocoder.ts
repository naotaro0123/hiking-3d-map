import MaplibreGeocoder, {
  CarmenGeojsonFeature,
  MaplibreGeocoderApi,
  MaplibreGeocoderApiConfig,
  MaplibreGeocoderFeatureResults,
} from "@maplibre/maplibre-gl-geocoder";
import maplibregl from "maplibre-gl";

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

export const getMapLibreGeocoder = (): MaplibreGeocoder => {
  return new MaplibreGeocoder(geocoderApi, { maplibregl });
};
