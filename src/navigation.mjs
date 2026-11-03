// Screen identity excludes selections which should update the current entry.
export function screenKey(view) {
  const key = [view.section, view.selected, view.modal];
  if (view.modal === "meeting") key.push(view.meetingSlide ?? 0);
  if (view.modal === "hospitality") {
    key.push(view.activeHospitality);
    if (view.activeHospitality === 0) {
      key.push(view.slide > 0 ? "film" : "intro");
      if (!view.slide) key.push(view.nusukIntroStep ?? "gallery", !!view.nusukReportOpen);
    }
  }
  if (view.modal === "details") key.push(view.activePackageLocation ?? 0, view.activePackagePillar ?? 0);
  return JSON.stringify(key);
}

export function syncPresentationHistory(history, view, url, initialize = false) {
  const current = history.state ?? {};
  const depth = Number(current.bushraDepth ?? 0);
  const push = !initialize && !!current.bushraView &&
    screenKey(current.bushraView) !== screenKey(view);
  const nextDepth = push ? depth + 1 : depth;
  history[push ? "pushState" : "replaceState"](
    { ...current, bushraView: view, bushraDepth: nextDepth }, "", url
  );
  return nextDepth;
}
