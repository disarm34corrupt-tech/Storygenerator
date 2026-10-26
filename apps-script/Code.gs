/**
 * Mystery Story Gacha — Google Apps Script backend
 * Deploy as a Web app: Execute as Me; Who has access: Anyone.
 * Run setupSheet() once in the Apps Script editor and authorize it.
 */
const SHEET_NAME = "Gacha Results";
const PROP_KEY = "MYSTERY_STORY_GACHA_SPREADSHEET_ID";

function setupSheet() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(PROP_KEY);
  let ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create("Mystery Story Gacha — Team Results");
  if (!id) props.setProperty(PROP_KEY, ss.getId());
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Team Key", "Team Name", "Leader", "Members", "Status", "Cards JSON"]);
    sheet.setFrozenRows(1);
  }
  Logger.log("Spreadsheet URL: " + ss.getUrl());
  return ss.getUrl();
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const callback = String(p.callback || "").replace(/[^a-zA-Z0-9_$]/g, "");
  let result;
  try { result = handleRequest_(p); }
  catch (err) { result = {ok:false, message: err && err.message ? err.message : "Unexpected server error."}; }
  const json = JSON.stringify(result).replace(/</g, "\\u003c");
  if (callback) return ContentService.createTextOutput(callback + "(" + json + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function handleRequest_(p) {
  if (p.action === "register") return registerTeam_(p);
  if (p.action === "status") return getStatus_(String(p.teamKey || ""));
  if (p.action === "save") return saveCards_(p);
  return {ok:false, message:"Unknown action."};
}

function getSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty(PROP_KEY);
  if (!id) throw new Error("The teacher must run setupSheet() in Apps Script first.");
  const ss = SpreadsheetApp.openById(id);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Team Key", "Team Name", "Leader", "Members", "Status", "Cards JSON"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
function norm_(v) { return String(v || "").trim().toLowerCase().replace(/\\s+/g, " "); }

function registerTeam_(p) {
  const teamName = String(p.teamName || "").trim();
  const leader = String(p.leaderName || "").trim();
  const members = String(p.members || "").trim();
  if (!teamName || !leader || !members) return {ok:false, message:"Please complete all team fields."};
  const sheet = getSheet_(), lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const rows = sheet.getDataRange().getValues(), key = norm_(teamName);
    for (let i=1; i<rows.length; i++) {
      if (norm_(rows[i][2]) === key) {
        return {ok:false, registered:true, alreadyPlayed:String(rows[i][5]) === "PLAYED",
          teamKey:String(rows[i][1]), message:String(rows[i][5]) === "PLAYED"
            ? "This team has already used its one gacha session."
            : "This team name is already registered. Please contact your teacher if this is your team."};
      }
    }
    const teamKey = Utilities.getUuid();
    sheet.appendRow([new Date(), teamKey, teamName, leader, members, "REGISTERED", ""]);
    return {ok:true, registered:true, alreadyPlayed:false, teamKey:teamKey};
  } finally { lock.releaseLock(); }
}

function getStatus_(teamKey) {
  if (!teamKey) return {ok:false, message:"Missing team key."};
  const rows = getSheet_().getDataRange().getValues();
  for (let i=1; i<rows.length; i++) {
    if (String(rows[i][1]) === teamKey) {
      let result=null;
      try { result = rows[i][6] ? JSON.parse(String(rows[i][6])) : null; } catch (_) {}
      return {ok:true, registered:true, alreadyPlayed:String(rows[i][5]) === "PLAYED", result:result};
    }
  }
  return {ok:true, registered:false, alreadyPlayed:false};
}

function saveCards_(p) {
  const teamKey=String(p.teamKey || "");
  if (!teamKey) return {ok:false, message:"Missing team key."};
  let cards;
  try { cards=JSON.parse(String(p.cards || "{}")); } catch (_) { return {ok:false, message:"Invalid card data."}; }
  const expected=["Theme","Title","Characters","Setting","Conflict","Climax","Resolution"];
  if (!expected.every(c => cards[c] && cards[c].id && cards[c].content !== undefined))
    return {ok:false, message:"The story set must contain all seven categories."};
  const sheet=getSheet_(), lock=LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const rows=sheet.getDataRange().getValues();
    for (let i=1; i<rows.length; i++) {
      if (String(rows[i][1]) === teamKey) {
        if (String(rows[i][5]) === "PLAYED") return {ok:false, message:"This team has already used its one gacha session."};
        sheet.getRange(i+1, 1).setValue(new Date());
        sheet.getRange(i+1, 6).setValue("PLAYED");
        sheet.getRange(i+1, 7).setValue(JSON.stringify({cards:cards}));
        return {ok:true, alreadyPlayed:true};
      }
    }
    return {ok:false, message:"Team registration was not found."};
  } finally { lock.releaseLock(); }
}
