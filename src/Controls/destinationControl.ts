import { mdiClose, mdiMapSearch } from "@mdi/js";
import { getSvgIcon } from "./controls-common";

type MountainRoadRelation = {
  id: number;
  type: "relation";
  name: string;
  local_name: string;
  group: string;
  linear: "yes" | "no";
  itinerary?: string[];
  symbol_id: string;
};
type MountainRoadResponse = {
  query: string;
  page: number;
  results: MountainRoadRelation[];
};
const searchMountainRoads = async (mountainName: string) => {
  const url = `https://hiking.waymarkedtrails.org/api/v1/list/search?query=${mountainName}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch mountain data: ${response.statusText}`);
  }
  const data = (await response.json()) as MountainRoadResponse;
  if (data.page === 0) {
    throw new Error("No mountain found with the given name.");
  }
  return data.results;
};

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

      const searchButton = document.querySelector(".destination-search-button");
      searchButton?.classList.toggle("disabled", target.value.length === 0);
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
    searchButton.className = "destination-search-button disabled";
    searchButton.innerHTML = getSvgIcon("検索", mdiMapSearch);
    searchButton.addEventListener("contextmenu", (e) => e.preventDefault());
    searchButton.addEventListener("click", async () => {
      const mountainName = input.value.trim();
      if (mountainName.length === 0) return;

      const results = await searchMountainRoads(mountainName);
      console.log("検索結果:", results);
      // TODO: 検索処理を実装する
    });
    container.appendChild(searchButton);

    return container;
  }

  onRemove(): void {}
}
