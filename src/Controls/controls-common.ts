export const getSvgIcon = (title: string, path: string) =>
  `<button><svg viewBox="0 0 24 24"><title>${title}</title><path d="${path}"></path></svg></button>`;

export type InitViewSetting = {
  center: [number, number];
  maxPitch: number;
  pitch: number;
  bearing: number;
  zoom: number;
};

export const initViewSetting: InitViewSetting = {
  center: [138.4339, 35.2139], // 富士山
  maxPitch: 80,
  pitch: 0,
  bearing: 0,
  zoom: 10,
};
