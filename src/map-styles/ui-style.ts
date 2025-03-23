import maplibregl from "maplibre-gl";
import { ChangeViewControl } from "../Controls/ChangeViewControl";
import { ResetViewControl } from "../Controls/resetViewControl";

export const setUiStyle = (map: maplibregl.Map) => {
  // 視点リセットボタンを追加
  map.addControl(new ResetViewControl(), "top-right");

  // 2D視点ボタン/3D視点ボタンを追加
  map.addControl(new ChangeViewControl(), "top-right");

  // コントロール関係表示
  map.addControl(new maplibregl.NavigationControl());
  // ユーザーの現在地を取得するコントロールを追加
  // ref: https://zenn.dev/yama_kawa/articles/245eca6cc20879
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: {
        // より精度の高い位置情報を取得する
        enableHighAccuracy: true,
      },
      // ユーザーが移動するたびに位置を自動的に更新
      trackUserLocation: true,
    })
  );
};
