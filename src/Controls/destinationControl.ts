import { mdiClose, mdiMapSearch } from "@mdi/js";
import { getSvgIcon } from "./controls-common";

const dummyMountainRoads: MountainRoadRelation[] = [
  {
    type: "relation",
    id: 2674586,
    name: "Mt Takao to Mt Jinba",
    local_name: "高尾山から陣馬山まで",
    group: "REG",
    linear: "no",
    symbol_id: "ref_REG_9ad85c3e5c71304b3089",
  },
  {
    type: "relation",
    id: 14191203,
    name: "高石縱走",
    group: "LOC",
    linear: "no",
    symbol_id: "ref_LOC_9ad877f37e318d70",
  },
  {
    type: "relation",
    id: 17784848,
    name: "高島縱走",
    group: "LOC",
    linear: "yes",
    symbol_id: "ref_LOC_9ad85cf67e318d70",
  },
  {
    type: "relation",
    id: 10553219,
    name: "高要风车山",
    group: "LOC",
    linear: "no",
    symbol_id: "ref_LOC_9ad8898198ce8f665c71",
  },
  {
    type: "relation",
    id: 2579065,
    name: "高指山・明神山コース",
    group: "LOC",
    linear: "no",
    itinerary: ["交流プラザ", "石割山ハイキングコース入口"],
    symbol_id: "ref_LOC_9ad863075c7130fb660e",
  },
  {
    type: "relation",
    id: 17250866,
    name: "大草街道（高森の道）",
    group: "LOC",
    linear: "no",
    symbol_id: "ref_LOC_5927834988579053ff08",
  },
  {
    type: "relation",
    id: 4234289,
    name: "高松山コース",
    group: "LOC",
    linear: "no",
    symbol_id: "ref_LOC_9ad8677e5c7130b330fc",
  },
  {
    type: "relation",
    id: 16665742,
    name: "Takashima Trail",
    local_name: "高島トレイル",
    group: "LOC",
    linear: "no",
    itinerary: ["Kunizakai Kogen", "Kutsuki Kuwabara-bashi"],
    symbol_id: "ref_LOC_9ad85cf630c830ec30a4",
  },
  {
    type: "relation",
    id: 13468771,
    name: "高士佛山步道",
    group: "LOC",
    linear: "no",
    symbol_id: "ref_LOC_9ad858eb4f5b5c716b65",
  },
  {
    type: "relation",
    id: 3259995,
    name: "高峰山登山路",
    group: "LOC",
    linear: "no",
    symbol_id: "ref_LOC_9ad85cf05c71767b5c71",
  },
];

type MountainRoadRelation = {
  id: number;
  type: "relation";
  name: string;
  local_name?: string;
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
const mountainRoadApiHost = "https://hiking.waymarkedtrails.org";
const mountainRoladSearchApi = `${mountainRoadApiHost}/api/v1/list/search`;

const searchMountainRoads = async (mountainName: string) => {
  const url = `${mountainRoladSearchApi}?query=${mountainName}`;
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
  onAdd(_: maplibregl.Map): HTMLDivElement {
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
    searchButton.addEventListener("click", async () => {
      const mountainName = inputMountainName.value.trim();
      if (mountainName.length === 0) return;

      const results = await searchMountainRoads(mountainName);
      console.log("検索結果:", results);
      // TODO: 検索処理を実装する
    });
    // Enterキーで検索
    inputMountainName.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !searchButton.classList.contains("disabled")) {
        e.preventDefault();
        searchButton.click();
      }
    });
    container.appendChild(searchButton);

    // 検索結果の経路リスト
    const resultContainer = document.createElement("div");
    resultContainer.className = "destination-results-container";
    resultContainer.addEventListener("contextmenu", (e) => e.preventDefault());

    const resultTitle = document.createElement("div");
    resultTitle.className = "destination-results-title";
    resultTitle.textContent = "検索結果";
    resultContainer.appendChild(resultTitle);

    const clearButtonInResults = document.createElement("button");
    clearButtonInResults.className = "destination-results-clear-button";
    clearButtonInResults.innerHTML = getSvgIcon("クリア", mdiClose);
    clearButtonInResults.addEventListener("contextmenu", (e) =>
      e.preventDefault()
    );
    clearButtonInResults.addEventListener("click", () => {
      inputMountainName.value = "";
    });
    resultContainer.appendChild(clearButtonInResults);

    const resultsList = document.createElement("ul");
    resultsList.className = "destination-results-list";
    resultsList.addEventListener("contextmenu", (e) => e.preventDefault());
    // dummy data for testing
    for (const road of dummyMountainRoads) {
      const listItem = document.createElement("li");
      listItem.className = "destination-result-item";
      listItem.textContent = road.local_name || road.name;
      listItem.dataset.id = road.id.toString();
      listItem.addEventListener("click", () => {});
      listItem.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });
      resultsList.appendChild(listItem);
    }
    resultContainer.appendChild(resultsList);
    container.appendChild(resultContainer);

    return container;
  }

  onRemove(): void {}
}
