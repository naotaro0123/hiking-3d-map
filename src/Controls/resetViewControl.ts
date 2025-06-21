import { mdiHome } from "@mdi/js";
import maplibregl from "maplibre-gl";
import { getButtonWithSvgIcon, initViewSetting } from "./controls-common";

export class ResetViewControl implements maplibregl.IControl {
  onAdd(map: maplibregl.Map) {
    const div = document.createElement("div");
    div.className = "maplibregl-ctrl maplibregl-ctrl-group";
    div.innerHTML = getButtonWithSvgIcon("視点リセット", mdiHome);
    div.addEventListener("contextmenu", (e) => e.preventDefault());
    div.addEventListener("click", () => map.flyTo({ ...initViewSetting }));

    return div;
  }
  onRemove(): void {}
}
