import "./ui-style.css";

type InitViewSetting = {
  center: [number, number];
  maxPitch: number;
  zoom: number;
};

export const initViewSetting: InitViewSetting = {
  center: [138.4339, 35.2139], // 富士山
  maxPitch: 80,
  zoom: 10,
};

const createControl = () => {
  const controls = document.createElement("div");
  controls.className = "mapboxgl-ctrl";
  return controls;
};

const createButton = (text: string, onClick: () => void) => {
  const button = document.createElement("button");
  button.className = "mapboxgl-ctrl-button";
  button.textContent = text;
  button.onclick = onClick;
  return button;
};

export const setUiStyle = (map: maplibregl.Map) => {
  const controls = createControl();
  map._container.appendChild(controls);

  const zoomResetButton = createButton("視点リセット", () => {
    map.easeTo({ ...initViewSetting });
  });
  controls.appendChild(zoomResetButton);

  const zoomInButton = createButton("視点拡大", () => {
    map.zoomIn();
  });
  controls.appendChild(zoomInButton);

  const zoomOutButton = createButton("視点縮小", () => {
    map.zoomOut();
  });
  controls.appendChild(zoomOutButton);

  const parallelViewButton = createButton("2D視点（平行投影）", () => {
    map.easeTo({ pitch: 0 });
  });
  controls.appendChild(parallelViewButton);

  const perspectiveViewButton = createButton("3D視点（透視投影）", () => {
    map.easeTo({ pitch: 60 });
  });
  controls.appendChild(perspectiveViewButton);
};
