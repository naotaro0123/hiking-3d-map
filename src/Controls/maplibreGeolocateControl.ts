import maplibregl from "maplibre-gl";

export const getMaplibreGeolocateControl = (
  map: maplibregl.Map
): maplibregl.GeolocateControl => {
  // ref: https://zenn.dev/yama_kawa/articles/245eca6cc20879
  const geolocateControl = new maplibregl.GeolocateControl({
    positionOptions: {
      // より精度の高い位置情報を取得する
      enableHighAccuracy: true,
    },
  });
  geolocateControl.on("geolocate", (e) => {
    const coords = e.coords as GeolocationCoordinates;
    // TODO: 緯度・軽度・高度から目的地までの距離を計算する（stateを使う）
    new maplibregl.Popup()
      .setLngLat([coords.longitude, coords.latitude])
      .setHTML(
        `<div>
             <div class="popup-title">現在地</div>
             <div>緯度: ${coords.latitude}</div>
             <div>経度: ${coords.longitude}</div>
             <div>高度: ${coords.altitude}</div>
           </div>`
      )
      .addTo(map);
  });

  return geolocateControl;
};
