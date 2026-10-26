// Paste the deployed Google Apps Script Web App URL ending in /exec here.
const GAS_WEB_APP_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
const TEAM_SESSION_KEY = "mysteryStoryGachaTeam_v1";
const TEAM_RESULT_KEY = "mysteryStoryGachaResult_v1";
let teamSession = null;
let teamAlreadyPlayed = false;


const CARD_DATA = {
  Theme: [
    "Honesty is important even when telling the truth has serious consequences.",
    "True friendship requires loyalty, trust, and sacrifice.",
    "Courage means facing fear rather than allowing it to control our decisions.",
    "Greed can destroy the very things people value most.",
    "Forgiveness can help people overcome the mistakes of the past.",
    "Appearances can be misleading, and the truth is not always what it seems.",
    "Every choice has consequences that may affect more people than we realize.",
    "Family bonds can survive misunderstandings and difficult circumstances.",
    "Ambition becomes dangerous when success matters more than morality.",
    "Kindness toward strangers can create unexpected changes in people's lives.",
    "Accepting differences can help people overcome prejudice and fear.",
    "The past may shape our lives, but it does not have to determine our future.",
    "Teamwork and cooperation can achieve what individuals cannot accomplish alone.",
    "Curiosity can lead to discovery, but reckless curiosity can bring danger.",
    "Hope can survive even in the darkest and most uncertain circumstances."
  ],

  Title: [
    "The Letter That Arrived Too Late",
    "The Secret Beneath the Floor",
    "A Stranger in the Rain",
    "The Last Train Home",
    "The Photograph with No Face",
    "One Night to Tell the Truth",
    "The Promise We Almost Broke",
    "The Door That Should Never Open",
    "A Map to Nowhere",
    "The Day Everything Disappeared",
    "The Unexpected Inheritance",
    "The Voice from the Attic",
    "The Price of a Perfect Lie",
    "When the Clock Stopped",
    "The Beginning of the End"
  ],

  Characters: [
    ["A curious teenager who loves solving mysteries.", "A cautious best friend who prefers to avoid trouble."],
    ["An elderly storyteller who remembers a forgotten event.", "A young visitor searching for answers about the past."],
    ["A talented student who secretly fears failure.", "A strict mentor who notices more than they reveal."],
    ["A dishonest merchant who wants to protect a valuable secret.", "A determined customer who suspects something is wrong."],
    ["Two siblings with very different personalities.", "A family friend who knows the reason behind their disagreement."],
    ["A shy newcomer who struggles to fit in.", "A popular student whose friendly appearance hides insecurity."],
    ["A lonely traveler who trusts very few people.", "A helpful stranger with an unusual request."],
    ["An ambitious young inventor who takes unnecessary risks.", "A practical assistant who worries about the consequences."],
    ["A village leader determined to protect the community.", "A rebellious villager who questions the leader's decisions."],
    ["A talented artist who discovers a mysterious clue.", "A skeptical investigator who refuses to believe in coincidences."],
    ["A former athlete trying to rebuild their confidence.", "A younger teammate who looks up to them."],
    ["A caretaker responsible for an old building.", "A visitor who recognizes something hidden inside it."],
    ["A resourceful student who keeps an important secret.", "A loyal friend who feels betrayed by the secrecy."],
    ["A scientist whose experiment produces an unexpected result.", "A journalist determined to uncover what happened."],
    ["A courageous rescue volunteer who fears losing someone.", "A survivor who knows a crucial piece of information."]
  ],

  Setting: [
    "Place: An abandoned railway station. Time: A foggy night in late autumn.",
    "Place: A remote village surrounded by mountains. Time: The final week of the dry season.",
    "Place: An old mansion on the edge of town. Time: Midnight during a thunderstorm.",
    "Place: A crowded metropolitan city. Time: The evening of a citywide blackout.",
    "Place: A small seaside town. Time: The morning after an unexpected storm.",
    "Place: A school library with a restricted archive. Time: The final day before the school holidays.",
    "Place: A research laboratory in a remote facility. Time: Several hours before a scheduled experiment.",
    "Place: A forest campsite far from the nearest road. Time: Just before sunrise.",
    "Place: A traditional marketplace. Time: The busiest day of an annual festival.",
    "Place: A hospital waiting room. Time: A long and uncertain night.",
    "Place: A deserted island with an abandoned shelter. Time: The third day after a shipwreck.",
    "Place: A historic museum with a hidden basement. Time: The night before a major exhibition.",
    "Place: A small neighborhood café. Time: A rainy afternoon in the middle of the week.",
    "Place: A futuristic city controlled by advanced technology. Time: The day the central system fails.",
    "Place: A remote mountain village with a single road leading out. Time: The first night of winter."
  ],

  Conflict: [
    "The protagonist discovers a hidden message suggesting that someone close to them has been lying. They must decide whether to investigate or protect the relationship.",
    "A valuable object disappears just before an important event. The protagonist becomes a suspect, even though they insist they are innocent.",
    "Two characters discover that they have been given completely different explanations about the same event. Their disagreement threatens to separate them.",
    "The protagonist makes a promise that becomes increasingly difficult to keep. Breaking it could hurt someone, but keeping it could create an even bigger problem.",
    "An unexpected visitor arrives with information that challenges everything the protagonist believes about their past.",
    "A small mistake causes a chain of misunderstandings. Before the protagonist can explain what happened, the situation becomes much worse.",
    "The protagonist finds something that does not belong to them. Returning it seems simple until they discover why its owner wants it back.",
    "A group must complete an urgent task, but its members disagree about the safest way forward. Their lack of cooperation puts everyone at risk.",
    "The protagonist learns that an apparently generous offer comes with an uncomfortable condition. Accepting it could solve one problem while creating another.",
    "A strange event occurs, and everyone blames someone different. The protagonist begins investigating but discovers evidence that contradicts the popular explanation.",
    "The protagonist must choose between revealing a painful truth and allowing a harmful misunderstanding to continue.",
    "A sudden emergency separates the protagonist from someone who depends on them. They must find a way to reunite before time runs out.",
    "The protagonist discovers that a trusted person has been hiding an important mistake. The revelation threatens the future of something they built together.",
    "An unusual discovery attracts unwanted attention. The protagonist realizes that keeping it may be dangerous, but giving it away may also have consequences.",
    "A long-awaited opportunity appears, but accepting it requires the protagonist to leave someone or something important behind."
  ],

  Climax: [
    "The protagonist finally confronts the person they suspect. Just as the truth is about to emerge, an unexpected revelation changes the situation.",
    "The protagonist must make a difficult decision before time runs out. Every available choice carries a serious consequence.",
    "Evidence suddenly reveals that the person everyone blamed may have been protecting someone else. The protagonist must reconsider everything they believed.",
    "A dangerous situation forces the protagonist to act despite being terrified. Their decision determines whether the others can escape.",
    "The protagonist discovers the final missing clue, but revealing it could expose a secret that someone has risked everything to protect.",
    "Two characters finally face each other after a long misunderstanding. Their argument reaches a breaking point when one of them reveals the real reason behind their actions.",
    "The protagonist is given one final opportunity to tell the truth. Before they can speak, someone else reveals a shocking piece of information.",
    "A carefully planned solution suddenly fails. With no time to prepare another plan, the protagonist must improvise.",
    "The protagonist discovers that the apparent threat is not what it seemed. They must decide whether to trust someone they once feared.",
    "The protagonist reaches the place where the mystery began. There, they find the person or evidence that can finally explain everything.",
    "A critical object is about to be lost or destroyed. The protagonist must choose between saving it and helping someone in immediate danger.",
    "The group faces its greatest challenge when its members disagree at the worst possible moment. One unexpected act of cooperation changes their chances of success.",
    "A hidden truth becomes public, and the protagonist must face the consequences of earlier choices. Their response determines whether the situation can be repaired.",
    "The protagonist realizes that the only way to stop the problem is to admit their own mistake. They must do so before someone else suffers the consequences.",
    "Just when the characters believe they have solved the problem, a final discovery challenges their understanding of what happened."
  ],

  Resolution: [
    "The truth is finally revealed, allowing the characters to understand what really happened. However, rebuilding trust takes longer than solving the mystery.",
    "The protagonist admits their mistake and accepts the consequences. Although the outcome is not perfect, the decision creates an opportunity to make things right.",
    "The missing object is returned to its rightful owner. Its unexpected significance changes the way the characters understand their shared history.",
    "The characters work together to overcome the danger. Their cooperation helps them succeed and changes the way they see one another.",
    "A long-standing disagreement is finally resolved. The characters learn that understanding another person's perspective matters more than winning an argument.",
    "The protagonist chooses to forgive someone who has caused them pain. Forgiveness does not erase the past, but it allows both characters to move forward.",
    "The mystery is solved, but the answer is different from what anyone expected. The protagonist must reconsider an important belief.",
    "The protagonist gives up a personal advantage to protect someone else. Their sacrifice brings an unexpected reward that cannot be measured in money or status.",
    "The emergency ends, and the characters return to safety. They realize that their experience has changed their priorities and strengthened their relationships.",
    "The protagonist decides to reveal the truth publicly. Some people are disappointed, but the honesty prevents a greater injustice.",
    "The characters discover that the apparent enemy was trying to prevent a different danger. They reach an understanding, although their relationship remains complicated.",
    "The protagonist leaves the place where the story began. A final message or discovery gives new meaning to the events that occurred.",
    "The opportunity the protagonist wanted is lost, but another possibility appears. They accept the outcome and begin a different journey.",
    "The community comes together to repair the damage caused by the conflict. The protagonist learns that lasting change requires continued effort.",
    "The main problem appears to be solved, and the characters begin to move on. One small unexplained detail hints that the story may not be entirely over."
  ]
};

// Automatically assign IDs to all 105 cards.
const PREFIX = {
  Theme: "TH",
  Title: "TI",
  Characters: "CH",
  Setting: "SE",
  Conflict: "CO",
  Climax: "CL",
  Resolution: "RE"
};

for (const category of Object.keys(CARD_DATA)) {
  CARD_DATA[category] = CARD_DATA[category].map(
    (content, index) => [
      `${PREFIX[category]}${String(index + 1).padStart(2, "0")}`,
      content
    ]
  );
}

const META = {
  Theme: { color: "violet", icon: "✦", hint: "The central message" },
  Title: { color: "pink", icon: "✎", hint: "The name of your story" },
  Characters: { color: "teal", icon: "♟", hint: "Who brings the story to life?" },
  Setting: { color: "amber", icon: "⌖", hint: "Where and when it happens" },
  Conflict: { color: "coral", icon: "⚡", hint: "The main problem" },
  Climax: { color: "purple", icon: "↗", hint: "The turning point" },
  Resolution: { color: "green", icon: "✧", hint: "How the story ends" }
};

const categories = Object.keys(META);
const drawn = {};
let busy = false;
let revealResolver = null;
let pendingReveal = null;

const $ = selector => document.querySelector(selector);

const safe = text =>
  String(text).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);


function jsonpRequest(params) {
  return new Promise((resolve, reject) => {
    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes("PASTE_YOUR")) {
      reject(new Error("The Google Apps Script URL has not been connected by the teacher yet."));
      return;
    }
    const callbackName = "gachaCallback_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
    const script = document.createElement("script");
    const timeout = setTimeout(() => finish(new Error("Server timeout. Please try again.")), 15000);
    function finish(error, value) {
      clearTimeout(timeout); delete window[callbackName]; script.remove();
      if (error) reject(error); else resolve(value);
    }
    window[callbackName] = data => finish(null, data);
    script.onerror = () => finish(new Error("Could not reach Apps Script. Check its deployment URL and access settings."));
    const query = new URLSearchParams({...params, callback: callbackName});
    script.src = GAS_WEB_APP_URL + (GAS_WEB_APP_URL.includes("?") ? "&" : "?") + query.toString();
    document.body.appendChild(script);
  });
}
function setTeamStatus(message, type="") {
  const el=$("#teamStatus"); if (!el) return;
  el.textContent=message; el.className="team-status "+type;
}
function applyTeamLock() {
  const form=$("#teamForm");
  if (form) form.querySelectorAll("input,textarea,button").forEach(el => el.disabled=Boolean(teamSession));
  if (teamSession) setTeamStatus(teamAlreadyPlayed
    ? "This team has already used its one gacha session. The result is locked."
    : "Team registered: "+teamSession.teamName+". Your team can open the seven-card set once.",
    teamAlreadyPlayed ? "locked" : "success");
  $("#drawAll").disabled=!teamSession || teamAlreadyPlayed || busy;
  $("#drawAll").textContent=teamAlreadyPlayed ? "✓ Story Set Already Used" : "🎁 Open Story Set";
  $("#reset").disabled=!teamSession || teamAlreadyPlayed || busy;
  document.querySelectorAll(".draw-one").forEach(button => button.disabled=!teamSession || teamAlreadyPlayed || busy);
}
async function registerTeam(event) {
  event.preventDefault(); if (teamSession) return;
  const teamName=$("#teamName").value.trim(), leaderName=$("#leaderName").value.trim();
  const members=$("#memberNames").value.split(/[\\n,;]+/).map(x=>x.trim()).filter(Boolean);
  if (!teamName || !leaderName || !members.length) { setTeamStatus("Please enter the team name, leader, and all team members.","error"); return; }
  if (!members.some(x=>x.toLowerCase()===leaderName.toLowerCase())) {
    setTeamStatus("Please include the team leader in the team members list.","error"); return;
  }
  const submit=$("#registerTeam"); submit.disabled=true; submit.textContent="Registering...";
  try {
    const response=await jsonpRequest({action:"register",teamName,leaderName,members:members.join("\\n")});
    if (!response || !response.ok) throw new Error(response?.message || "Registration failed.");
    if (response.alreadyPlayed) {
      teamAlreadyPlayed=true;
      setTeamStatus(response.message || "This team has already played.","locked");
      return;
    }
    if (!response.teamKey) throw new Error(response.message || "This team name may already be registered. Contact your teacher.");
    teamSession={teamName,leaderName,members,teamKey:response.teamKey};
    localStorage.setItem(TEAM_SESSION_KEY,JSON.stringify(teamSession));
    applyTeamLock();
  } catch(error) {
    setTeamStatus(error.message || "Could not register. Please try again.","error");
  } finally {
    submit.disabled=Boolean(teamSession) || teamAlreadyPlayed;
    submit.textContent=teamSession ? "Team Registered ✓" : "Register Team & Continue ✨";
  }
}
async function restoreTeamSession() {
  try {
    const stored=JSON.parse(localStorage.getItem(TEAM_SESSION_KEY)||"null");
    if (!stored?.teamKey) return;
    const response=await jsonpRequest({action:"status",teamKey:stored.teamKey});
    if (!response?.ok || !response.registered) { localStorage.removeItem(TEAM_SESSION_KEY); return; }
    teamSession=stored; teamAlreadyPlayed=Boolean(response.alreadyPlayed);
    if (response.result?.cards) {
      categories.forEach(category => { const card=response.result.cards[category]; if(card) drawn[category]=[card.id,card.content]; });
      renderCards(); renderPack();
    }
    applyTeamLock();
  } catch(error) {
    setTeamStatus("Could not verify this team's status with the server. Please refresh or contact your teacher.","error");
  }
}
async function saveCompletedStorySet() {
  const cards={};
  categories.forEach(category=>{if(drawn[category]) cards[category]={id:drawn[category][0],content:drawn[category][1]};});
  const response=await jsonpRequest({action:"save",teamKey:teamSession.teamKey,cards:JSON.stringify(cards)});
  if(!response?.ok) throw new Error(response?.message || "The story set could not be saved.");
  teamAlreadyPlayed=true; localStorage.setItem(TEAM_RESULT_KEY,JSON.stringify(cards)); applyTeamLock();
}

function contentHTML(category, content) {
  if (Array.isArray(content)) {
    return `<ul>${content.map(item => `<li>${safe(item)}</li>`).join("")}</ul>`;
  }
  return `<p>${safe(content)}</p>`;
}

function renderCards() {
  $("#cardGrid").innerHTML = categories.map(category => {
    const meta = META[category];
    const card = drawn[category];

    return `
      <article class="draw-card ${meta.color}" data-category="${category}">
        <div class="card-topline">
          <span class="card-icon">${meta.icon}</span>
          <span class="card-count">${card ? "CARD UNLOCKED" : "15 CARDS IN DECK"}</span>
        </div>
        <div class="card-category">${category.toUpperCase()}</div>
        <p class="card-hint">${meta.hint}</p>
        <div class="card-reveal ${card ? "revealed" : ""}">
          ${card
            ? `<span class="card-id">${safe(card[0])}</span>${contentHTML(category, card[1])}`
            : `<div class="card-back"><span class="question-mark">?</span>YOUR STORY AWAITS</div>`
          }
        </div>
        <button class="draw-one" data-draw="${category}" ${busy ? "disabled" : ""}>
          ${card ? "Draw Again ↻" : `Draw ${category} →`}
        </button>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-draw]").forEach(button => {
    button.onclick = () => drawOne(button.dataset.draw);
  });

  updateProgress();
}

function updateProgress() {
  const count = categories.filter(category => drawn[category]).length;

  $("#progressLabel").textContent = `${count}/7 Cards Drawn`;
  $("#progressFill").style.width = `${count / 7 * 100}%`;
  $("#drawAll").disabled = busy || count === 7;
  $("#copyCards").disabled = count === 0;
  $("#startWriting").disabled = count !== 7;
  $("#packEmpty").hidden = count > 0;

  renderPack();
}

function renderPack() {
  $("#storyPack").innerHTML = categories
    .filter(category => drawn[category])
    .map(category => {
      const meta = META[category];
      const [id, content] = drawn[category];

      return `
        <article class="pack-item ${meta.color}">
          <div class="pack-item-head">
            <span>${meta.icon} ${category.toUpperCase()}</span>
            <code>${safe(id)}</code>
          </div>
          ${contentHTML(category, content)}
        </article>
      `;
    }).join("");
}

function randomCard(category) {
  const deck = CARD_DATA[category];
  return deck[Math.floor(Math.random() * deck.length)];
}

function makeSparks() {
  $("#sparkleBurst").innerHTML = Array.from({ length: 28 }, (_, index) => `
    <span class="spark"
      style="--angle:${index * 360 / 28}deg;
      --distance:${65 + Math.random() * 100}px;
      animation-delay:${Math.random() * 180}ms">✦</span>
  `).join("");
}

function revealGacha(category, card) {
  pendingReveal = { category, card };

  const meta = META[category];

  $("#machineStage").hidden = false;
  $("#gachaMachine").classList.remove("machine-spinning");
  $("#machinePrompt").textContent =
    `A mystery ${category.toLowerCase()} card is waiting inside...`;

  $("#gachaOpen").hidden = false;
  $("#gachaOpen").disabled = false;
  $("#prizeCard").hidden = true;
  $("#gachaCongrats").hidden = true;
  $("#gachaContinue").hidden = true;

  $("#prizeCard").className = `prize-card ${meta.color}`;
  $("#prizeIcon").textContent = meta.icon;
  $("#prizeCategory").textContent = category.toUpperCase();
  $("#prizeId").textContent = card[0];
  $("#prizeContent").innerHTML = contentHTML(category, card[1]);

  $("#gachaOverlay").hidden = false;
}

async function openMysteryBox() {
  if (!pendingReveal || $("#gachaOpen").disabled) return;

  $("#gachaOpen").disabled = true;
  $("#gachaMachine").classList.add("machine-spinning");
  $("#machinePrompt").textContent =
    "Shaking, shaking... your story is on its way!";

  await sleep(1350);

  const { category } = pendingReveal;
  const meta = META[category];

  $("#machineStage").hidden = true;
  $("#prizeCard").hidden = false;
  $("#gachaCongrats").hidden = false;
  $("#gachaContinue").hidden = false;

  $("#prizeCard").className = `prize-card ${meta.color}`;
  makeSparks();
}

function closeGacha() {
  $("#gachaOverlay").hidden = true;

  if (revealResolver) {
    const done = revealResolver;
    revealResolver = null;
    done();
  }

  pendingReveal = null;
}

function waitForContinue() {
  return new Promise(resolve => {
    revealResolver = resolve;
    $("#gachaContinue").onclick = closeGacha;
  });
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function drawOne(category) {
  if (busy || !teamSession || teamAlreadyPlayed) return;
  setTeamStatus('Use “Open Story Set” to draw all seven cards in one session.', 'notice');
  return;

  busy = true;
  renderCards();

  document.querySelector(`[data-category="${category}"]`)
    ?.classList.add("is-spinning");

  await sleep(250);

  drawn[category] = randomCard(category);
  busy = false;

  renderCards();
  revealGacha(category, drawn[category]);
}

async function drawAll() {
  if (busy || !teamSession || teamAlreadyPlayed) return;

  busy = true;

  for (const category of categories) {
    renderCards();

    document.querySelector(`[data-category="${category}"]`)
      ?.classList.add("is-spinning");

    await sleep(380);

    drawn[category] = randomCard(category);
    renderCards();
    revealGacha(category, drawn[category]);

    await waitForContinue();
    await sleep(120);
  }

  busy = false;
  renderCards();
  try {
    await saveCompletedStorySet();
    setTeamStatus("All seven cards have been saved. This team cannot spin again.", "success");
  } catch (error) {
    setTeamStatus("The cards were drawn, but saving failed: " + error.message + " Please contact your teacher before leaving this page.", "error");
    $("#drawAll").disabled = true;
  }

  $("#storyPack").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function resetAll() {
  if (busy || !teamSession || teamAlreadyPlayed) return;

  categories.forEach(category => delete drawn[category]);

  $("#writingArea").hidden = true;
  $("#storyDraft").value = "";
  $("#copyFeedback").textContent = "";
  $("#draftFeedback").textContent = "";

  document.querySelectorAll(".checklist input").forEach(input => {
    input.checked = false;
  });

  updateChecklist();
  updateWordCount();
  renderCards();
}

function packText() {
  return categories
    .filter(category => drawn[category])
    .map(category => {
      const [id, content] = drawn[category];
      const body = Array.isArray(content)
        ? content.map(item => "- " + item).join("\n")
        : content;

      return `${category.toUpperCase()} (${id})\n${body}`;
    }).join("\n\n");
}

async function copyText(text, feedback) {
  try {
    await navigator.clipboard.writeText(text);
    feedback.textContent = "Copied successfully! ✨";
  } catch {
    feedback.textContent = "Clipboard unavailable. Please copy manually.";
  }

  setTimeout(() => {
    feedback.textContent = "";
  }, 2500);
}

function startWriting() {
  if (categories.some(category => !drawn[category])) return;

  $("#writingArea").hidden = false;
  $("#writingPrompt").textContent =
    `Use "${drawn.Title[1]}" as your title. Connect all seven cards into a coherent narrative. Aim for 400–600 words.`;

  $("#writingArea").scrollIntoView({ behavior: "smooth" });
}

function updateWordCount() {
  const text = $("#storyDraft").value.trim();
  const count = text ? text.split(/\s+/).length : 0;

  $("#wordCount").textContent = `${count} words`;
  $("#wordCount").style.color =
    count >= 400 && count <= 600 ? "#238455" : "";
}

function updateChecklist() {
  const inputs = [...document.querySelectorAll(".checklist input")];
  const count = inputs.filter(input => input.checked).length;

  $("#checkProgress").textContent = `${count}/4 checks complete`;
}

$("#drawAll").onclick = drawAll;
$("#gachaOpen").onclick = openMysteryBox;
$("#reset").onclick = resetAll;
$("#copyCards").onclick = () =>
  copyText(packText(), $("#copyFeedback"));
$("#startWriting").onclick = startWriting;

$("#storyDraft").addEventListener("input", updateWordCount);
$("#copyDraft").onclick = () =>
  copyText($("#storyDraft").value, $("#draftFeedback"));

document.querySelectorAll(".checklist input").forEach(input => {
  input.addEventListener("change", updateChecklist);
});

$("#gachaOverlay").addEventListener("click", event => {
  if (event.target.classList.contains("gacha-backdrop")) {
    closeGacha();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !$("#gachaOverlay").hidden) {
    closeGacha();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const requiredIds = [
    "#cardGrid",
    "#progressLabel",
    "#progressFill",
    "#drawAll",
    "#copyCards",
    "#startWriting",
    "#packEmpty",
    "#storyPack",
    "#gachaOverlay",
    "#machineStage",
    "#gachaMachine",
    "#machinePrompt",
    "#gachaOpen",
    "#prizeCard",
    "#prizeIcon",
    "#prizeCategory",
    "#prizeId",
    "#prizeContent",
    "#gachaCongrats",
    "#gachaContinue",
    "#sparkleBurst",
    "#writingArea",
    "#writingPrompt",
    "#storyDraft",
    "#wordCount",
    "#copyDraft",
    "#copyFeedback",
    "#draftFeedback",
    "#reset",
    "#checkProgress"
  ];

  const missing = requiredIds.filter(
    selector => !document.querySelector(selector)
  );

  if (missing.length) {
    console.error("Missing HTML elements:", missing);
    alert("Some HTML elements are missing. Check the browser console.");
    return;
  }

  renderCards();
  const teamForm = $("#teamForm");
  if (teamForm) teamForm.addEventListener("submit", registerTeam);
  $("#drawAll").disabled = true;
  $("#reset").disabled = true;
  restoreTeamSession();
});

