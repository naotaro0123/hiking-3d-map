import maplibregl from "maplibre-gl";
import { ChangeViewControl } from "../Controls/changeViewControl";
import { DestinationControl } from "../Controls/destinationControl";
import { getMaplibreGeolocateControl } from "../Controls/maplibreGeolocateControl";
import { ResetViewControl } from "../Controls/resetViewControl";
import { PositionState } from "../types/position-state";

export const setUiStyle = (
  map: maplibregl.Map,
  setPosition: React.Dispatch<React.SetStateAction<PositionState | undefined>>
) => {
  // 目的地入力のジオコーダーを追加
  // map.addControl(getMapLibreGeocoder(map, setPosition), "top-left");

  // 目的地入力のコントロールを追加
  map.addControl(new DestinationControl(), "top-left");

  // ユーザーの現在地を取得するコントロールを追加
  map.addControl(getMaplibreGeolocateControl(map, setPosition), "top-left");

  // 視点リセットボタンを追加
  map.addControl(new ResetViewControl(), "top-right");
  // 2D視点ボタン/3D視点ボタンを追加
  map.addControl(new ChangeViewControl(), "top-right");
  // コントロール関係表示
  map.addControl(new maplibregl.NavigationControl());
};
