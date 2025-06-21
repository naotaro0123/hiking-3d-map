import { mdiVideo2d, mdiVideo3d } from "@mdi/js";
import maplibregl from "maplibre-gl";
import { getButtonWithSvgIcon } from "./controls-common";

export class ChangeViewControl implements maplibregl.IControl {
  onAdd(map: maplibregl.Map) {
    const container = document.createElement("div");
    container.className = "maplibregl-ctrl maplibregl-ctrl-group";

    const parallelView = document.createElement("div");
    parallelView.innerHTML = getButtonWithSvgIcon(
      "2D視点（平行投影）",
      mdiVideo2d
    );
    parallelView.addEventListener("contextmenu", (e) => e.preventDefault());
    parallelView.addEventListener("click", () => map.easeTo({ pitch: 0 }));
    container.appendChild(parallelView);
    parallelView.classList.add("disabled");

    map.on("pitchend", () => {
      if (map.getPitch() === 0) {
        parallelView.classList.add("disabled");
      } else {
        parallelView.classList.remove("disabled");
      }
    });

    const perspectiveView = document.createElement("div");
    perspectiveView.innerHTML = getButtonWithSvgIcon(
      "3D視点（透視投影）",
      mdiVideo3d
    );
    perspectiveView.addEventListener("contextmenu", (e) => e.preventDefault());
    perspectiveView.addEventListener("click", () => map.easeTo({ pitch: 60 }));
    container.appendChild(perspectiveView);

    return container;
  }
  onRemove(): void {}
}
