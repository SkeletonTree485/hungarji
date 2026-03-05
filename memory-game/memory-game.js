
const GRID_COLS = 4;   // columns  
const GRID_ROWS = 4;   // rows     

// Accent colours cycled for the name cards (one per pair)
const NAME_CARD_COLORS = [
  "rgba(218,253,21,0.18)",
  "rgba(21,210,253,0.18)",
  "rgba(253,100,21,0.18)",
  "rgba(180,21,253,0.18)",
  "rgba(21,253,120,0.18)",
  "rgba(253,21,100,0.18)",
  "rgba(253,200,21,0.18)",
  "rgba(21,80,253,0.18)",
];

// ============================================================
//  Internal state
// ============================================================
let deck          = [];
let flipped       = [];
let matched       = new Set();
let moves         = 0;
let lockBoard     = false;
let timerInterval = null;
let secondsElapsed = 0;

// ============================================================
//  Helpers
// ============================================================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(s) {
  const m   = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

// ============================================================
//  Build deck
//  Each tile produces TWO cards: one "name" card, one "image" card.
// ============================================================
function buildDeck() {
  const totalCards  = GRID_COLS * GRID_ROWS;
  const pairsNeeded = totalCards / 2;

  if (pairsNeeded > TILES.length) {
    console.error(
      `Not enough tiles! Need ${pairsNeeded} pairs but only ${TILES.length} defined in tiles.js`
    );
    return [];
  }

  const chosen = shuffle(TILES).slice(0, pairsNeeded);
  const cards  = [];

  chosen.forEach((tile, idx) => {
    const accentColor = NAME_CARD_COLORS[idx % NAME_CARD_COLORS.length];

    // Name card
    cards.push({
      uid:        `${tile.id}-name`,
      pairId:     tile.id,
      type:       "name",
      name:       tile.name,
      image:      tile.image,
      accent:     accentColor,
    });

    // Image card
    cards.push({
      uid:        `${tile.id}-img`,
      pairId:     tile.id,
      type:       "image",
      name:       tile.name,
      image:      tile.image,
      accent:     accentColor,
    });
  });

  return shuffle(cards);
}

// ============================================================
//  Timer
// ============================================================
function startTimer() {
  stopTimer();
  secondsElapsed = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateTimerDisplay() {
  const el = document.getElementById("mg-timer");
  if (el) el.textContent = formatTime(secondsElapsed);
}

// ============================================================
//  Card HTML builders
// ============================================================
function nameCardFront(card) {
  return `
    <div class="mg-card-front mg-card-front--name"
         style="background:${card.accent};">
      <span class="mg-name-label">${card.name}</span>
    </div>`;
}

function imageCardFront(card) {
  if (card.image) {
    return `
      <div class="mg-card-front mg-card-front--image">
        <img class="mg-card-img"
             src="${card.image}"
             alt="${card.name}"
             loading="lazy"
             onerror="this.parentElement.classList.add('mg-img-error');this.remove()">
      </div>`;
  }
  // fallback when no image provided
  return `
    <div class="mg-card-front mg-card-front--image mg-img-error"
         style="background:${card.accent};">
      <span class="mg-name-label">${card.name[0]}</span>
    </div>`;
}

// ============================================================
//  Render
// ============================================================
function render() {
  const container = document.getElementById("quiz-container");
  if (!container) {
    console.error("No element with id='quiz-container' found.");
    return;
  }

  container.innerHTML = `
    <div class="mg-wrapper">

      <!-- HUD -->
      <div class="mg-hud nice-container">
        <div class="mg-hud-item">
          <span class="mg-hud-label">Moves</span>
          <span class="mg-hud-value" id="mg-moves">0</span>
        </div>
        <div class="mg-hud-item">
          <span class="mg-hud-label">Pairs</span>
          <span class="mg-hud-value" id="mg-pairs">0 / ${deck.length / 2}</span>
        </div>
        <div class="mg-hud-item">
          <span class="mg-hud-label">Time</span>
          <span class="mg-hud-value" id="mg-timer">00:00</span>
        </div>
        <button class="button small mg-restart-btn" id="mg-restart">↺ Restart</button>
        <button class="button small mg-reveal-btn" id="mg-reveal" title="Reveal all cards for 3 seconds">👁 Reveal</button>
      </div>
    <!-- Win banner -->
      <div class="mg-win-banner nice-container" id="mg-win-banner" style="display:none;">
        <div class="mg-win-content">
          <span class="mg-win-trophy">🏆</span>
          <h2 class="mg-win-title">You matched them all!</h2>
          <p class="mg-win-stats" id="mg-win-stats"></p>
          <button class="button mg-restart-btn" id="mg-win-restart">Play Again</button>
        </div>
      </div>
      <!-- Grid -->
      <div class="mg-grid" id="mg-grid">
        ${deck.map(card => `
          <div class="mg-card mg-card--${card.type}"
               data-uid="${card.uid}"
               data-pair="${card.pairId}">
            <div class="mg-card-inner">
              <div class="mg-card-back">
                <span class="mg-card-back-icon">?</span>
              </div>
              ${card.type === "name" ? nameCardFront(card) : imageCardFront(card)}
            </div>
          </div>
        `).join("")}
      </div>

    </div>
  `;

  attachEvents();
  startTimer();
}

// ============================================================
//  Events
// ============================================================
function attachEvents() {
  document.getElementById("mg-grid").addEventListener("click", onCardClick);
  document.getElementById("mg-restart").addEventListener("click", initGame);
  document.getElementById("mg-reveal").addEventListener("click", onReveal);
  const winBtn = document.getElementById("mg-win-restart");
  if (winBtn) winBtn.addEventListener("click", initGame);
}

let revealTimeout = null;

function onReveal() {
  const btn = document.getElementById("mg-reveal");
  if (!btn || btn.disabled) return;

  // Disable both action buttons during reveal
  btn.disabled = true;
  btn.textContent = "👁 3…";
  lockBoard = true;

  const grid = document.getElementById("mg-grid");
  grid.classList.add("mg-revealing");

  let countdown = 3;
  const tick = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      btn.textContent = `👁 ${countdown}…`;
    } else {
      clearInterval(tick);
      grid.classList.remove("mg-revealing");
      lockBoard = false;
      btn.disabled = false;
      btn.textContent = "👁 Reveal";
    }
  }, 1000);
}

function onCardClick(e) {
  const cardEl = e.target.closest(".mg-card");
  if (!cardEl || lockBoard) return;
  if (cardEl.classList.contains("mg-flipped") || cardEl.classList.contains("mg-matched")) return;

  cardEl.classList.add("mg-flipped");
  flipped.push(cardEl);

  if (flipped.length === 2) {
    lockBoard = true;
    moves++;
    updateHUD();
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flipped;
  const isMatch = a.dataset.pair === b.dataset.pair && a.dataset.uid !== b.dataset.uid;

  if (isMatch) {
    a.classList.add("mg-matched");
    b.classList.add("mg-matched");
    matched.add(a.dataset.pair);
    flipped    = [];
    lockBoard  = false;
    updateHUD();

    if (matched.size === deck.length / 2) {
      stopTimer();
      showWin();
    }
  } else {
    setTimeout(() => {
      a.classList.remove("mg-flipped");
      b.classList.remove("mg-flipped");
      flipped   = [];
      lockBoard = false;
    }, 1100);
  }
}

// ============================================================
//  HUD + Win screen
// ============================================================
function updateHUD() {
  const movesEl = document.getElementById("mg-moves");
  const pairsEl = document.getElementById("mg-pairs");
  if (movesEl) movesEl.textContent = moves;
  if (pairsEl) pairsEl.textContent = `${matched.size} / ${deck.length / 2}`;
}

function showWin() {
  const banner = document.getElementById("mg-win-banner");
  const stats  = document.getElementById("mg-win-stats");
  if (banner) banner.style.display = "flex";
  if (stats)  stats.textContent =
    `Completed in ${formatTime(secondsElapsed)} with ${moves} moves.`;
}

// ============================================================
//  Init
// ============================================================
function initGame() {
  stopTimer();
  deck      = buildDeck();
  flipped   = [];
  matched   = new Set();
  moves     = 0;
  lockBoard = false;
  if (!deck.length) return;
  render();
}

// ============================================================
//  Bootstrap
// ============================================================
document.addEventListener("DOMContentLoaded", initGame);