import { distance, point } from "@turf/turf";
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
  // 距離計測結果
  const [result, setResult] = useState<string | undefined>(undefined);

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

  const disabledCalcDistance =
    position?.destination === undefined || position?.myPosition === undefined;

  return (
    <>
      <div ref={mapRef} style={{ height: "100vh" }}></div>
      <button
        className="calc-distance"
        disabled={disabledCalcDistance}
        onClick={() => {
          if (position?.destination === undefined) return;
          if (position?.myPosition === undefined) return;

          const result = distance(
            point([
              position.destination.longitude,
              position.destination.latitude,
            ]),
            point([
              position.myPosition.longitude,
              position.myPosition.latitude,
            ]),
            { units: "kilometers" }
          ).toFixed(2);
          setResult(`距離: ${result}km`);
        }}
        title={
          disabledCalcDistance
            ? "目的地と現在地を選択してください"
            : "距離を計測できます"
        }
      >
        計測
      </button>
      <div className="description">
        <div className="title">使い方</div>
        <ol>
          <li>
            <span>目的地を入力して選択</span>
            {position?.destination === undefined ? (
              <span></span>
            ) : (
              <span className="set-position">
                <span>緯度: {position.destination.latitude.toFixed(4)}</span>
                <span>経度: {position.destination.longitude.toFixed(4)}</span>
                <span>
                  高度: {(position.destination.altitude ?? 0).toFixed(4)}
                </span>
              </span>
            )}
          </li>
          <li>
            <span>現在地を取得</span>
            {position?.myPosition === undefined ? (
              <span></span>
            ) : (
              <span className="set-position">
                <span>緯度: {position.myPosition.latitude.toFixed(4)}</span>
                <span>経度: {position.myPosition.longitude.toFixed(4)}</span>
                <span>
                  高度: {(position.myPosition.altitude ?? 0).toFixed(4)}
                </span>
              </span>
            )}
          </li>
          <li>
            <span>計測ボタン押下で距離を表示</span>
            {result === undefined ? (
              <span></span>
            ) : (
              <span className="set-position">{result}</span>
            )}
          </li>
        </ol>
      </div>
    </>
  );
};
