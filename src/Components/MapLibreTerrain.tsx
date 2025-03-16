import mlcontour from "maplibre-contour";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
import { useEffect, useRef } from "react";

const demSource = new mlcontour.DemSource({
  url: "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png",
  encoding: "mapbox",
  maxzoom: 12,
  // offload contour line computation to a web worker
  worker: true,
});
demSource.setupMaplibre(maplibregl);

export const MapLibreTerrain = () => {
  const protocol = new pmtiles.Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mapRef.current;
    if (container === null) return;

    new maplibregl.Map({
      container,
      center: [138.4339, 35.2139], // 富士山
      maxPitch: 80,
      zoom: 10,
      style: {
        version: 8,
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        sources: {
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
          "aws-terriain": {
            type: "raster-dem",
            minzoom: 1,
            maxzoom: 15,
            encoding: "terrarium",
            tiles: [
              "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
            ],
            attribution:
              // see 'https://github.com/tilezen/joerd/blob/master/docs/attribution.md'
              "\
            ArcticDEM terrain data DEM(s) were created from DigitalGlobe, Inc., imagery and funded under National Science Foundation awards 1043681, 1559691, and 1542736; \
            Australia terrain data © Commonwealth of Australia (Geoscience Australia) 2017;\
            Austria terrain data © offene Daten Österreichs – Digitales Geländemodell (DGM) Österreich;\
            Canada terrain data contains information licensed under the Open Government Licence – Canada;\
            Europe terrain data produced using Copernicus data and information funded by the European Union - EU-DEM layers;\
            Global ETOPO1 terrain data U.S. National Oceanic and Atmospheric Administration\
            Mexico terrain data source: INEGI, Continental relief, 2016;\
            New Zealand terrain data Copyright 2011 Crown copyright (c) Land Information New Zealand and the New Zealand Government (All rights reserved);\
            Norway terrain data © Kartverket;\
            United Kingdom terrain data © Environment Agency copyright and/or database right 2015. All rights reserved;\
            United States 3DEP (formerly NED) and global GMTED2010 and SRTM terrain data courtesy of the U.S. Geological Survey.",
          },
          // 標高タイルで等高線を描画する
          hillshadeSource: {
            type: "raster-dem",
            // share cached raster-dem tiles with the contour source
            tiles: [demSource.sharedDemProtocolUrl],
            tileSize: 512,
            maxzoom: 12,
          },
          // 等高線
          contourSourceFeet: {
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
          // 陰影起伏
          {
            id: "hills",
            type: "hillshade",
            source: "aws-terriain",
          },
          // 等高線
          {
            id: "hillshadeSource",
            type: "hillshade",
            source: "hillshadeSource",
            layout: { visibility: "visible" },
            paint: { "hillshade-exaggeration": 0.25 },
          },
          {
            id: "contours",
            type: "line",
            source: "contourSourceFeet",
            "source-layer": "contours",
            paint: {
              "line-opacity": 0.5,
              // "major" contours have level=1, "minor" have level=0
              "line-width": ["match", ["get", "level"], 1, 1, 0.5],
            },
          },
        ],
        terrain: {
          source: "aws-terriain",
          exaggeration: 1,
        },
        sky: {
          // 空のベースカラー
          "sky-color": "#199EF3",
          // 空の色と水平線の色の混ぜ合わせ。1は空の真ん中の色を、0は空の色を使用する
          "sky-horizon-blend": 0.5,
          // 地平線のベースカラー
          "horizon-color": "#ffffff",
          // 霧の色と水平線の色の混ぜ合わせ。0は水平線の色、1は霧の色を使用する
          "horizon-fog-blend": 0.5,
          // 霧のベースカラー。 3D地形が必要
          "fog-color": "#0000ff",
          // 3D地形に霧を混ぜ合わせる。 0はマップの中心、1は地平線
          "fog-ground-blend": 0.5,
          // 大気の混ぜ合わせ。 1が可視大気、0が非表示大気
          "atmosphere-blend": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            10,
            1,
            12,
            0,
          ],
        },
      },
    });
  }, []);

  return (
    <>
      <div>
        <div ref={mapRef} style={{ height: "100vh" }}></div>
      </div>
    </>
  );
};
