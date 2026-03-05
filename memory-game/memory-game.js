// ============================================================
//  memory-game.js  –  Data-driven Memory Game
//
//  Configuration  ↓  (change these two values to resize the grid)
// ============================================================

const GRID_COLS = 4;   // number of columns
const GRID_ROWS = 4;   // number of rows  (cols × rows must be even)

// ============================================================
//  Internal state
// ============================================================
let deck        = [];   // all card objects currently in play
let flipped     = [];   // up to 2 cards currently face-up
let matched     = new Set();
let moves       = 0;
let lockBoard   = false;
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
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

// ============================================================
//  Build deck from tiles.js data
// ============================================================
function buildDeck() {
  const totalCards = GRID_COLS * GRID_ROWS;
  const pairsNeeded = totalCards / 2;

  if (pairsNeeded > TILES.length) {
    console.error(
      `Not enough tiles! Need ${pairsNeeded} pairs but only ${TILES.length} tiles defined in tiles.js`
    );
    return [];
  }

  const chosen = shuffle(TILES).slice(0, pairsNeeded);

  // duplicate each tile to create a pair, give each card a unique uid
  const cards = [];
  chosen.forEach((tile, idx) => {
    ["a", "b"].forEach(side => {
      cards.push({
        uid:        `${tile.id}-${side}`,
        pairId:     tile.id,
        frontLabel: tile.frontLabel,
        name:       tile.name,
      });
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
      </div>

      <!-- Grid -->
      <div class="mg-grid" id="mg-grid"
           style="grid-template-columns: repeat(${GRID_COLS}, 1fr);">
        ${deck.map(card => `
          <div class="mg-card nice-container" data-uid="${card.uid}" data-pair="${card.pairId}">
            <div class="mg-card-inner">
              <div class="mg-card-back">
                <span class="mg-card-back-icon">?</span>
              </div>
              <div class="mg-card-front">
                <span class="mg-card-emoji">${card.frontLabel}</span>
                <span class="mg-card-name">${card.name}</span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Win banner (hidden until victory) -->
      <div class="mg-win-banner nice-container" id="mg-win-banner" style="display:none;">
        <div class="mg-win-content">
          <span class="mg-win-trophy">🏆</span>
          <h2 class="mg-win-title">You matched them all!</h2>
          <p class="mg-win-stats" id="mg-win-stats"></p>
          <button class="button mg-restart-btn" id="mg-win-restart">Play Again</button>
        </div>
      </div>

    </div>
  `;

  injectStyles();
  attachEvents();
  startTimer();
}

// ============================================================
//  Event handling
// ============================================================
function attachEvents() {
  document.getElementById("mg-grid").addEventListener("click", onCardClick);
  document.getElementById("mg-restart").addEventListener("click", initGame);
  const winBtn = document.getElementById("mg-win-restart");
  if (winBtn) winBtn.addEventListener("click", initGame);
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
  const isMatch = a.dataset.pair === b.dataset.pair;

  if (isMatch) {
    a.classList.add("mg-matched");
    b.classList.add("mg-matched");
    matched.add(a.dataset.pair);
    flipped = [];
    lockBoard = false;
    updateHUD();

    if (matched.size === deck.length / 2) {
      stopTimer();
      showWin();
    }
  } else {
    setTimeout(() => {
      a.classList.remove("mg-flipped");
      b.classList.remove("mg-flipped");
      flipped = [];
      lockBoard = false;
    }, 1000);
  }
}

// ============================================================
//  HUD + Win
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
  deck    = buildDeck();
  flipped = [];
  matched = new Set();
  moves   = 0;
  lockBoard = false;

  if (!deck.length) return;
  render();
}

// ============================================================
//  Scoped styles injected once
// ============================================================
function injectStyles() {
  if (document.getElementById("mg-styles")) return;

  const css = `
    /* ── Wrapper ── */
    .mg-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
      padding: 24px 12px 40px;
      width: 100%;
      box-sizing: border-box;
    }

    /* ── HUD ── */
    .mg-hud {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 28px;
      flex-wrap: wrap;
      width: 90%;
      max-width: 680px;
      padding: 14px 24px !important;
    }
    .mg-hud-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .mg-hud-label {
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.7;
      color: var(--text-color, #e0e0e0);
    }
    .mg-hud-value {
      font-size: 1.55rem;
      font-weight: 700;
      font-family: 'Rajdhani', sans-serif;
      color: rgb(218, 253, 21);
      text-shadow: 0 0 8px rgba(218,253,21,0.5);
      line-height: 1;
    }
    .mg-restart-btn {
      margin-left: auto;
      font-size: 0.95rem !important;
      padding: 10px 18px !important;
    }

    /* ── Grid ── */
    .mg-grid {
      display: grid;
      gap: 12px;
      width: 90%;
      max-width: 800px;
    }

    /* ── Card shell ── */
    .mg-card {
      aspect-ratio: 1 / 1;
      perspective: 700px;
      cursor: pointer;
      padding: 0 !important;
      border-radius: 10px !important;
      overflow: hidden;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .mg-card:hover:not(.mg-matched) {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 8px 28px rgba(0,0,0,0.45);
    }

    /* ── 3-D flip inner ── */
    .mg-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .mg-flipped .mg-card-inner,
    .mg-matched .mg-card-inner {
      transform: rotateY(180deg);
    }

    /* ── Faces ── */
    .mg-card-back,
    .mg-card-front {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
    }
    .mg-card-back {
      background: rgba(255,255,255,0.04);
      border: 2px solid rgba(255,255,255,0.12);
    }
    .mg-card-back-icon {
      font-size: 2rem;
      font-weight: 900;
      color: rgba(255,255,255,0.35);
      text-shadow: none;
      font-family: 'Rajdhani', sans-serif;
      user-select: none;
    }
    .mg-card-front {
      transform: rotateY(180deg);
      background: rgba(255,255,255,0.07);
      border: 2px solid rgba(255,255,255,0.22);
      gap: 6px;
    }
    .mg-card-emoji {
      font-size: clamp(1.4rem, 4vw, 2.6rem);
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
      user-select: none;
    }
    .mg-card-name {
      font-size: clamp(0.55rem, 1.3vw, 0.78rem);
      font-weight: 600;
      letter-spacing: 0.05em;
      color: rgba(255,255,255,0.85);
      text-transform: uppercase;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
    }

    /* ── Matched state ── */
    .mg-matched .mg-card-front {
      background: rgba(218,253,21,0.14);
      border-color: rgba(218,253,21,0.55);
      box-shadow: 0 0 16px rgba(218,253,21,0.3);
    }
    .mg-matched .mg-card-emoji { filter: none; }

    /* ── Win banner ── */
    .mg-win-banner {
      width: 90%;
      max-width: 480px;
      justify-content: center !important;
      padding: 32px 24px !important;
      animation: mg-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    .mg-win-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .mg-win-trophy {
      font-size: 3.5rem;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
    }
    .mg-win-title {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 700;
      color: rgb(218,253,21);
      text-shadow: 0 0 12px rgba(218,253,21,0.6);
    }
    .mg-win-stats {
      margin: 0 !important;
      font-size: 1rem;
      opacity: 0.85;
      color: rgba(255,255,255,0.9) !important;
    }
    @keyframes mg-pop {
      from { opacity:0; transform:scale(0.7); }
      to   { opacity:1; transform:scale(1); }
    }

    /* ── Responsive tweaks ── */
    @media (max-width: 600px) {
      .mg-grid { gap: 8px; width: 96%; }
      .mg-hud  { width: 96%; gap: 16px; padding: 12px 14px !important; }
      .mg-restart-btn { margin-left: 0; width: 100%; text-align: center; }
    }
  `;

  const style = document.createElement("style");
  style.id = "mg-styles";
  style.textContent = css;
  document.head.appendChild(style);
}

// ============================================================
//  Bootstrap — wait for DOM + tiles.js
// ============================================================
document.addEventListener("DOMContentLoaded", initGame);
