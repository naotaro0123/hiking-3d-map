type Position = {
  latitude: number; // 緯度
  longitude: number; // 経度
  altitude?: number; // 高度（オプション）
};

export type PositionState = {
  destination?: Position;
  myPosition?: Position;
};
