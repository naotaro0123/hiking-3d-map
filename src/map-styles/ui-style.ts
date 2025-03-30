import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import maplibregl from "maplibre-gl";
import { ChangeViewControl } from "../Controls/changeViewControl";
import { getMapLibreGeocoder } from "../Controls/maplibreGeocoder";
import { ResetViewControl } from "../Controls/resetViewControl";
import { addMyPositionStyle } from "./my-position-style";

export const setUiStyle = (map: maplibregl.Map) => {
  // 目的地入力のジオコーダーを追加
  map.addControl(getMapLibreGeocoder(), "top-left");

  // 視点リセットボタンを追加
  map.addControl(new ResetViewControl(), "top-right");

  // 2D視点ボタン/3D視点ボタンを追加
  map.addControl(new ChangeViewControl(), "top-right");

  // コントロール関係表示
  map.addControl(new maplibregl.NavigationControl());
  // ユーザーの現在地を取得するコントロールを追加
  // ref: https://zenn.dev/yama_kawa/articles/245eca6cc20879
  const geolocateControl = new maplibregl.GeolocateControl({
    positionOptions: {
      // より精度の高い位置情報を取得する
      enableHighAccuracy: true,
    },
  });
  map.addControl(geolocateControl);

  geolocateControl.on("geolocate", (e) => {
    const coords = e.coords as GeolocationCoordinates;
    // TODO: 緯度・軽度・高度から目的地までの距離を計算する（stateを使う）
    new maplibregl.Popup()
      .setLngLat([coords.longitude, coords.latitude])
      .setHTML(
        `<div>
           <h4>現在地</h4>
           <div>緯度: ${coords.latitude}</div>
           <div>経度: ${coords.longitude}</div>
           <div>高度: ${coords.altitude}</div>
         </div>`
      )
      .addTo(map);
  });

  // ダブルクリックした位置にマーカーを表示する（デバッグ用）
  addMyPositionStyle(map);
};
