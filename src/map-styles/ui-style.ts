import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import maplibregl from "maplibre-gl";
import { ChangeViewControl } from "../Controls/changeViewControl";
import { getMapLibreGeocoder } from "../Controls/maplibreGeocoder";
import { getMaplibreGeolocateControl } from "../Controls/maplibreGeolocateControl";
import { ResetViewControl } from "../Controls/resetViewControl";
import { addMyPositionStyle } from "./my-position-style";

export const setUiStyle = (map: maplibregl.Map) => {
  // 目的地入力のジオコーダーを追加
  map.addControl(getMapLibreGeocoder(map), "top-left");

  // 視点リセットボタンを追加
  map.addControl(new ResetViewControl(), "top-right");

  // 2D視点ボタン/3D視点ボタンを追加
  map.addControl(new ChangeViewControl(), "top-right");

  // コントロール関係表示
  map.addControl(new maplibregl.NavigationControl());

  // ユーザーの現在地を取得するコントロールを追加
  map.addControl(getMaplibreGeolocateControl(map));

  // ダブルクリックした位置にマーカーを表示する（デバッグ用）
  addMyPositionStyle(map);
};
