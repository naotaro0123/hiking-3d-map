import { distance, point } from "@turf/turf";
import { PositionState } from "../types/position-state";

// 座標間の線を描画するために使用
const linestring = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [] as number[],
  },
};

export const calcDistanceControls = (
  position: PositionState | undefined,
  setResult: (label: string) => void
) => {
  const disabled =
    position?.destination === undefined || position?.myPosition === undefined;
  const button = document.createElement("button");
  button.className = "calc-distance";
  button.innerText = "計測";
  button.title = disabled
    ? "目的地と現在地を選択してください"
    : "距離を計測できます";
  button.disabled = disabled;
  button.addEventListener("click", () => {
    if (position?.destination === undefined) return;
    if (position?.myPosition === undefined) return;

    linestring.geometry.coordinates = [
      position.destination.longitude,
      position.destination.latitude,
      position.myPosition.longitude,
      position.myPosition.latitude,
    ];

    const result = distance(
      point([position.destination.longitude, position.destination.latitude]),
      point([position.myPosition.longitude, position.myPosition.latitude]),
      { units: "kilometers" }
    ).toFixed(2);
    setResult(`距離: ${result}km`);
  });
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "maplibregl-ctrl";
  buttonContainer.appendChild(button);
  document
    .querySelector(".maplibregl-ctrl-top-left")
    ?.appendChild(buttonContainer);
};
