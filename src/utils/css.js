export const generatedBackgroundCss = (background, listColor) => {
  return background || listColor[Math.floor(Math.random() * listColor.length)];
};
