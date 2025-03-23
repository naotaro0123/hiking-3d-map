import MaplibreGeocoder, {
  CarmenGeojsonFeature,
  MaplibreGeocoderApi,
  MaplibreGeocoderApiConfig,
} from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import maplibregl from "maplibre-gl";
import { ChangeViewControl } from "../Controls/ChangeViewControl";
import { ResetViewControl } from "../Controls/resetViewControl";

// ref1: https://maplibre.org/maplibre-gl-js/docs/examples/geocoder/
// ref2: https://github.com/maplibre/maplibre-gl-geocoder

const geocoderApi: MaplibreGeocoderApi = {
  forwardGeocode: async (config: MaplibreGeocoderApiConfig) => {
    const features: CarmenGeojsonFeature[] = [];
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
      const response = await fetch(request);
      const geojson = await response.json();
      for (const feature of geojson.features) {
        const center = [
          feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
          feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
        ];
        const point: CarmenGeojsonFeature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center,
          },
          place_name: feature.properties.display_name,
          properties: feature.properties,
          id: feature.properties.place_id, // FIXME:?
          text: feature.properties.display_name,
          place_type: ["place"],
          bbox: [
            // FIXME:?
            Math.min(feature.bbox[0], feature.bbox[2]),
            Math.min(feature.bbox[1], feature.bbox[3]),
            Math.max(feature.bbox[0], feature.bbox[2]),
            Math.max(feature.bbox[1], feature.bbox[3]),
          ],
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

export const setUiStyle = (map: maplibregl.Map) => {
  // 目的地入力のジオコーダーを追加
  map.addControl(new MaplibreGeocoder(geocoderApi, { maplibregl }));

  // 視点リセットボタンを追加
  map.addControl(new ResetViewControl(), "top-right");

  // 2D視点ボタン/3D視点ボタンを追加
  map.addControl(new ChangeViewControl(), "top-right");

  // コントロール関係表示
  map.addControl(new maplibregl.NavigationControl());
  // ユーザーの現在地を取得するコントロールを追加
  // ref: https://zenn.dev/yama_kawa/articles/245eca6cc20879
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: {
        // より精度の高い位置情報を取得する
        enableHighAccuracy: true,
      },
      // ユーザーが移動するたびに位置を自動的に更新
      trackUserLocation: true,
    })
  );
};
