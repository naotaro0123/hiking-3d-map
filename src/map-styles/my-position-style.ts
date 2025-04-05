import maplibregl from "maplibre-gl";
import { PositionState } from "../types/position-state";

const myPositionSourceName = "my-position";

export const addMyPositionStyle = (
  map: maplibregl.Map,
  setPosition: React.Dispatch<React.SetStateAction<PositionState | undefined>>
) => {
  const data = {
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [] as number[],
    },
    properties: {
      name: myPositionSourceName,
      description: "自身の位置点",
    },
  };
  map.addSource(myPositionSourceName, {
    type: "geojson",
    data,
  });
  map.addLayer({
    id: "my-position-layer",
    type: "circle",
    source: myPositionSourceName,
    layout: {},
    paint: {
      "circle-color": "#FF0000",
      "circle-radius": 10,
    },
  });

  map.on("dblclick", async (e) => {
    const coords = e.lngLat;

    setPosition((prev) => ({
      ...prev,
      myPosition: {
        latitude: coords.lat,
        longitude: coords.lng,
      },
    }));

    const elevation = map.queryTerrainElevation([coords.lng, coords.lat]);

    new maplibregl.Popup()
      .setLngLat([coords.lng, coords.lat])
      .setHTML(
        `<div>
            <div class="popup-title">現在地（デバッグ）</div>
            <div>緯度: ${coords.lat}</div>
            <div>経度: ${coords.lng}</div>
            <div>高度: ${elevation}</div>
         </div>`
      )
      .addTo(map);

    const source = map.getSource(
      myPositionSourceName
    ) as maplibregl.GeoJSONSource;
    data.geometry.coordinates = [coords.lng, coords.lat];
    source.setData(data);
  });
};
