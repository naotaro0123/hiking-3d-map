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

  let popup: maplibregl.Popup | null = null;
  let source: maplibregl.GeoJSONSource | null = null;

  map.on("dblclick", async (e) => {
    const { lat: latitude, lng: longitude } = e.lngLat;
    const elevation = map.queryTerrainElevation([longitude, latitude]);

    setPosition((prev) => ({
      ...prev,
      myPosition: {
        latitude,
        longitude,
        altitude: elevation ?? undefined,
      },
    }));

    if (popup) {
      popup.remove();
    }
    popup = new maplibregl.Popup({ closeOnClick: false })
      .setLngLat([longitude, latitude])
      .setHTML(
        `<div>
            <div class="popup-title">現在地（デバッグ）</div>
            <div>緯度: ${latitude}</div>
            <div>経度: ${longitude}</div>
            <div>高度: ${elevation}</div>
         </div>`
      )
      .addTo(map);

    source = map.getSource(myPositionSourceName) as maplibregl.GeoJSONSource;
    data.geometry.coordinates = [longitude, latitude];
    source.setData(data);
  });

  const resetButton = document.querySelector("button.reset");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      if (popup) {
        popup.remove();
        popup = null;
      }
      if (source) {
        source.setData({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [] as number[],
          },
          properties: {
            name: myPositionSourceName,
            description: "自身の位置点",
          },
        });
      }
    });
  }
};
