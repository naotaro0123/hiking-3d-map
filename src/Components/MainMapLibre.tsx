import maplibregl, { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
import { useEffect, useRef, useState } from "react";
import { initViewSetting } from "../Controls/controls-common";
import { addAwsShadeStyle } from "../map-styles/aws-shade-style";
import { addHillShadeStyle } from "../map-styles/hill-shade-style";
import { setMapSkyStyle } from "../map-styles/map-sky-style";
import { addMyPositionStyle } from "../map-styles/my-position-style";
import { setUiStyle } from "../map-styles/ui-style";
import { PositionState } from "../types/position-state";

const isDebug = true;
const isVectorTile = true; // true: ベクタタイル, false: ラスタタイル
const vectorTileStyle =
  "https://tile2.openstreetmap.jp/styles/osm-bright/style.json";

const rasterTileStyle: StyleSpecification = {
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
};

export const MainMapLibre = () => {
  const protocol = new pmtiles.Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  const mapRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<PositionState | undefined>(
    undefined
  );

  useEffect(() => {
    const container = mapRef.current;
    if (container === null) return;

    const map = new maplibregl.Map({
      container,
      ...initViewSetting,
      attributionControl: false, // 地図の著作権表示を非表示にする
    });
    map.setStyle(isVectorTile ? vectorTileStyle : rasterTileStyle);

    map.on("load", () => {
      setMapSkyStyle(map);
      addAwsShadeStyle(map);
      addHillShadeStyle(map);
      setUiStyle(map, setPosition);
      if (isDebug) {
        // ダブルクリックした位置にマーカーを表示する（デバッグ用）
        addMyPositionStyle(map, setPosition);
      }
    });

    // cleanup for StrictMode
    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ height: "100vh" }}></div>
      <div className="description">
        <div className="title">使い方</div>
        <ol>
          <li>目的地を入力して選択する</li>
          <li>現在地を取得する</li>
          <li>目的地と現在地の距離が表示される</li>
        </ol>
      </div>
      {isDebug && (
        <div className="debug">
          <div>
            destination: {Object.values(position?.destination ?? {}).join(", ")}
          </div>
          <div>
            myPosition: {Object.values(position?.myPosition ?? {}).join(", ")}
          </div>
        </div>
      )}
    </>
  );
};
