export const setMapSkyStyle = (map: maplibregl.Map) => {
  map.style.setSky({
    // 空のベースカラー
    "sky-color": "#199EF3",
    // 空の色と水平線の色の混ぜ合わせ。1は空の真ん中の色を、0は空の色を使用する
    "sky-horizon-blend": 0.5,
    // 地平線のベースカラー
    "horizon-color": "#ffffff",
    // 霧の色と水平線の色の混ぜ合わせ。0は水平線の色、1は霧の色を使用する
    "horizon-fog-blend": 0.5,
    // 霧のベースカラー。 3D地形が必要
    "fog-color": "#0000ff",
    // 3D地形に霧を混ぜ合わせる。 0はマップの中心、1は地平線
    "fog-ground-blend": 0.5,
    // 大気の混ぜ合わせ。 1が可視大気、0が非表示大気
    "atmosphere-blend": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      1,
      10,
      1,
      12,
      0,
    ],
  });
};
