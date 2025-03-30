import maplibregl from "maplibre-gl";

const myPositionSourceName = "my-position";

export const addMyPositionStyle = (map: maplibregl.Map) => {
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

  map.on("dblclick", (e) => {
    const coords = e.lngLat;
    new maplibregl.Popup()
      .setLngLat([coords.lng, coords.lat])
      .setHTML(
        `<div>
             <div>緯度: ${coords.lat}</div>
             <div>経度: ${coords.lng}</div>
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
