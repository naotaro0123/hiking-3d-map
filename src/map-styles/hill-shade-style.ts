import mlcontour from "maplibre-contour";
import maplibregl from "maplibre-gl";

const awsHillShadeSourceName = "hill-shade";

const demSource = new mlcontour.DemSource({
  url: "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png",
  encoding: "mapbox",
  maxzoom: 12,
  // offload contour line computation to a web worker
  worker: true,
});
demSource.setupMaplibre(maplibregl);

export const addHillShadeStyle = (map: maplibregl.Map) => {
  // 標高タイルで等高線を描画する
  map.addSource(awsHillShadeSourceName, {
    type: "raster-dem",
    // share cached raster-dem tiles with the contour source
    tiles: [demSource.sharedDemProtocolUrl],
    tileSize: 512,
    maxzoom: 12,
  });

  // 等高線
  map.addSource("contourSourceFeet", {
    type: "vector",
    tiles: [
      demSource.contourProtocolUrl({
        // meters to feet
        multiplier: 3.28084,
        overzoom: 1,
        thresholds: {
          // zoom: [minor, major]
          //   major: 標高の値を表示するメジャーな等高線
          //   minor: 標高の値を表示しないマイナーな等高線
          //   zoomはズームレベルで上記値が適用される
          11: [1000, 1000],
          12: [500, 1000],
          13: [500, 1000],
          14: [200, 1000],
          15: [200, 1000],
        },
        elevationKey: "ele",
        levelKey: "level",
        contourLayer: "contours",
      }),
    ],
    maxzoom: 15,
  });

  // 等高線
  map.addLayer({
    id: "hillShadeLayer",
    type: "hillshade",
    source: awsHillShadeSourceName,
    layout: { visibility: "visible" },
    paint: { "hillshade-exaggeration": 0.25 },
  });

  map.addLayer({
    id: "contoursLayer",
    type: "line",
    source: "contourSourceFeet",
    "source-layer": "contours",
    paint: {
      "line-opacity": 0.5,
      // "major" contours have level=1, "minor" have level=0
      "line-width": ["match", ["get", "level"], 1, 1, 0.5],
    },
  });
};
