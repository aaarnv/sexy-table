export const layoutAnimationId = "grouped-table-glide";
export const glideOptions = {
  id: layoutAnimationId,
  duration: 460,
  easing: "cubic-bezier(0.32, 0.72, 0, 1)",
  fill: "backwards",
} satisfies KeyframeAnimationOptions;

export const layoutMotion = {
  breakpointsRem: [39.5, 47.5],
  immediateResizeThreshold: 24,
  rowStagger: 18,
  maximumStaggeredRow: 8,
  pieceStagger: 30,
  hiddenAvatarDuration: 260,
  avatarHiddenScale: 0.75,
  enterDuration: 320,
  enterDelay: 60,
  enterStagger: 24,
  exitDuration: 280,
  exitStagger: 14,
  maximumAppearanceIndex: 16,
};
