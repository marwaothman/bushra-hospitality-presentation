import { test } from "node:test";
import assert from "node:assert/strict";
import { syncPresentationHistory } from "../src/navigation.mjs";

function setup() {
  const entries = []; let index = -1;
  const history = {
    get state() { return entries[index]; },
    pushState(state) { entries.splice(++index); entries.push(structuredClone(state)); },
    replaceState(state) { if(index < 0) index = 0; entries[index] = structuredClone(state); },
    back() { index = Math.max(0, index - 1); return this.state.bushraView; },
    forward() { index = Math.min(entries.length - 1, index + 1); return this.state.bushraView; },
    get length() { return entries.length; }
  };
  let view = {lang:"ar",section:"home",selected:null,modal:null,slide:0,activeHospitality:0,nusukIntroStep:"gallery",nusukReportOpen:false,activeNusukPhoto:0};
  const update = (patch, initialize=false) => { view={...view,...patch}; syncPresentationHistory(history,view,"/",initialize); };
  update({},true);
  return {history, update};
}

test("nested achievement and report each return exactly one screen", () => {
  const {history,update}=setup();
  update({section:"hospitality"}); update({modal:"hospitality"});
  update({activeNusukPhoto:3}); assert.equal(history.length,3);
  update({nusukIntroStep:"evidence"}); update({nusukReportOpen:true});
  assert.equal(history.length,5);
  assert.equal(history.back().nusukReportOpen,false);
  assert.equal(history.back().nusukIntroStep,"gallery");
  assert.equal(history.state.bushraView.activeNusukPhoto,3);
  assert.equal(history.back().modal,null);
  assert.equal(history.back().section,"home");
  assert.equal(history.forward().section,"hospitality");
});
test("film back restores introduction and selected photo", () => {
  const {history,update}=setup();
  update({section:"hospitality"}); update({modal:"hospitality",activeNusukPhoto:4});
  update({slide:1}); assert.equal(history.length,4);
  assert.equal(history.back().slide,0);
  assert.equal(history.state.bushraView.activeNusukPhoto,4);
  assert.equal(history.forward().slide,1);
});
test("refresh, selection and language updates replace, not push", () => {
  const {history,update}=setup();
  update({section:"hospitality"}); update({lang:"en",activeHospitalityPhase:2});
  assert.equal(history.length,2);
  update({},true); assert.equal(history.length,2);
  assert.equal(history.state.bushraView.lang,"en");
});
test("restored entry does not create a forward loop", () => {
  const {history,update}=setup();
  update({section:"hospitality"}); update({modal:"hospitality"}); update({slide:1});
  const restored=history.back(); update(restored);
  assert.equal(history.length,4); assert.equal(history.forward().slide,1);
});
