import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
import { useEffect, useRef } from "react";
import { addAwsShadeStyle } from "../map-styles/aws-shade-style";
import { addHillShadeStyle } from "../map-styles/hill-shade-style";
import { setMapSkyStyle } from "../map-styles/map-sky-style";
import { initViewSetting, setUiStyle } from "../map-styles/ui-style";

export const MainMapLibre = () => {
  const protocol = new pmtiles.Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mapRef.current;
    if (container === null) return;

    const map = new maplibregl.Map({
      container,
      ...initViewSetting,
      style: {
        version: 8,
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        sources: {
          // 以下のマップは別途addSourceで追加だとStyle is not done loadingエラーが出る。また、map.on("load")が走らない
          "background-osm-raster": {
            // ソースの種類。vector、raster、raster-dem、geojson、image、video のいずれか
            type: "raster",
            // タイルソースのURL
            tiles: [
              "https://tile.openstreetmap.jp/styles/osm-bright-ja/{z}/{x}/{y}.png",
            ],
            // タイルの解像度。単位はピクセル、デフォルトは512
            tileSize: 256,
            // データの帰属
            attribution:
              "<a href='https://www.openstreetmap.org/copyright' target='_blank'>© OpenStreetMap contributors</a>",
          },
        },
        layers: [
          // 背景地図としてOpenStreetMapのラスタタイルを追加
          {
            // 一意のレイヤID
            id: "background-osm-raster",
            // レイヤの種類。background、fill、line、symbol、raster、circle、fill-extrusion、heatmap、hillshade のいずれか
            type: "raster",
            // データソースの指定
            source: "background-osm-raster",
          },
        ],
      },
    });

    map.on("load", () => {
      setMapSkyStyle(map);
      addAwsShadeStyle(map);
      addHillShadeStyle(map);
      setUiStyle(map);
    });

    // cleanup for StrictMode
    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <div>
        <div ref={mapRef} style={{ height: "100vh" }}></div>
      </div>
    </>
  );
};
