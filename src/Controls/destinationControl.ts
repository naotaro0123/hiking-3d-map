import { mdiClose, mdiMapSearch } from "@mdi/js";
import { getSvgIcon } from "./controls-common";

export class DestinationControl implements maplibregl.IControl {
  onAdd(_map: maplibregl.Map): HTMLDivElement {
    const container = document.createElement("div");
    container.className =
      "maplibregl-ctrl maplibregl-ctrl-group destination-control";

    const inputMountainName = document.createElement("input");
    inputMountainName.type = "text";
    inputMountainName.placeholder = "目的地の山名を入力してください";
    inputMountainName.className = "destination-input";
    inputMountainName.addEventListener("contextmenu", (e) =>
      e.preventDefault()
    );
    inputMountainName.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;

      const clearButton = document.querySelector(".destination-clear-button");
      clearButton?.classList.toggle("hidden", target.value.length === 0);

      const searchButton = document.querySelector(".destination-search-button");
      searchButton?.classList.toggle("disabled", target.value.length === 0);
    });
    container.appendChild(inputMountainName);

    // クリアボタン
    const clearButton = document.createElement("button");
    clearButton.className = "destination-clear-button hidden";
    clearButton.innerHTML = getSvgIcon("クリア", mdiClose);
    clearButton.addEventListener("contextmenu", (e) => e.preventDefault());
    clearButton.addEventListener("click", () => {
      inputMountainName.value = "";
    });
    container.appendChild(clearButton);

    // 検索ボタン
    const searchButton = document.createElement("button");
    searchButton.className = "destination-search-button disabled";
    searchButton.innerHTML = getSvgIcon("検索", mdiMapSearch);
    searchButton.addEventListener("contextmenu", (e) => e.preventDefault());
    container.appendChild(searchButton);

    return container;
  }

  onRemove(): void {}
}
