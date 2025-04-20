import maplibregl from "maplibre-gl";
import { PositionState } from "../types/position-state";

export const getMaplibreGeolocateControl = (
  map: maplibregl.Map,
  setPosition: React.Dispatch<React.SetStateAction<PositionState | undefined>>
): maplibregl.GeolocateControl => {
  // ref: https://zenn.dev/yama_kawa/articles/245eca6cc20879
  const geolocateControl = new maplibregl.GeolocateControl({
    positionOptions: {
      // より精度の高い位置情報を取得する
      enableHighAccuracy: true,
    },
  });
  let popup: maplibregl.Popup | null = null;

  geolocateControl.on("geolocate", (e) => {
    const coords = e.coords as GeolocationCoordinates;

    setPosition((prev) => ({
      ...prev,
      myPosition: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude ?? undefined,
      },
    }));

    if (popup) {
      popup.remove();
    }
    popup = new maplibregl.Popup({ closeOnClick: false })
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
