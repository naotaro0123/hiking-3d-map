import { mdiClose, mdiMapSearch } from "@mdi/js";
import { getSvgIcon } from "./controls-common";

export class DestinationControl implements maplibregl.IControl {
  onAdd(_map: maplibregl.Map): HTMLDivElement {
    const container = document.createElement("div");
    container.className =
      "maplibregl-ctrl maplibregl-ctrl-group destination-control";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "目的地の山名を入力してください";
    input.className = "destination-input";
    input.addEventListener("contextmenu", (e) => e.preventDefault());
    input.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const clearButton = document.querySelector(".destination-clear-button");
      clearButton?.classList.toggle("hidden", target.value.length === 0);
    });
    container.appendChild(input);

    // クリアボタン
    const clearButton = document.createElement("button");
    clearButton.className = "destination-clear-button hidden";
    clearButton.innerHTML = getSvgIcon("クリア", mdiClose);
    clearButton.addEventListener("contextmenu", (e) => e.preventDefault());
    clearButton.addEventListener("click", () => {
      input.value = "";
    });
    container.appendChild(clearButton);

    // 検索ボタン
    const searchButton = document.createElement("button");
    searchButton.className = "destination-search-button";
    searchButton.innerHTML = getSvgIcon("検索", mdiMapSearch);
    searchButton.addEventListener("contextmenu", (e) => e.preventDefault());
    container.appendChild(searchButton);

    return container;
  }

  onRemove(): void {}
}
