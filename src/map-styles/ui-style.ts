import { mdiHome, mdiVideo2d, mdiVideo3d } from "@mdi/js";
import maplibregl from "maplibre-gl";

type InitViewSetting = {
  center: [number, number];
  maxPitch: number;
  pitch: number;
  bearing: number;
  zoom: number;
};

export const initViewSetting: InitViewSetting = {
  center: [138.4339, 35.2139], // 富士山
  maxPitch: 80,
  pitch: 0,
  bearing: 0,
  zoom: 10,
};

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

const getSvgIcon = (title: string, path: string) =>
  `<button><svg viewBox="0 0 24 24"><title>${title}</title><path d="${path}"></path></svg></button>`;

// ref: https://stackoverflow.com/questions/40162662/mapbox-gl-how-to-create-custom-control
class ResetViewControl implements maplibregl.IControl {
  onAdd(map: maplibregl.Map) {
    const div = document.createElement("div");
    div.className = "maplibregl-ctrl maplibregl-ctrl-group";
    div.innerHTML = getSvgIcon("視点リセット", mdiHome);
    div.addEventListener("contextmenu", (e) => e.preventDefault());
    div.addEventListener("click", () => map.flyTo({ ...initViewSetting }));

    return div;
  }
  onRemove(): void {}
}

class ChangeViewControl implements maplibregl.IControl {
  onAdd(map: maplibregl.Map) {
    const container = document.createElement("div");
    container.className = "maplibregl-ctrl maplibregl-ctrl-group";

    const parallelView = document.createElement("div");
    parallelView.innerHTML = getSvgIcon("2D視点（平行投影）", mdiVideo2d);
    parallelView.addEventListener("contextmenu", (e) => e.preventDefault());
    parallelView.addEventListener("click", () => map.easeTo({ pitch: 0 }));
    container.appendChild(parallelView);

    const perspectiveView = document.createElement("div");
    perspectiveView.innerHTML = getSvgIcon("3D視点（透視投影）", mdiVideo3d);
    perspectiveView.addEventListener("contextmenu", (e) => e.preventDefault());
    perspectiveView.addEventListener("click", () => map.easeTo({ pitch: 60 }));
    container.appendChild(perspectiveView);

    return container;
  }
  onRemove(): void {}
}
