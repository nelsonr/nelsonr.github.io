const QUOTES = [
  "You can't handle the truth!",
  "I'll be back.",
  "Here's looking at you, kid.",
  "May the Force be with you.",
  "You talking to me?",
  "To infinity and beyond!",
  "Why so serious?",
  "Just keep swimming.",
  "There's no place like home.",
  "Elementary, my dear Watson.",
  "I see dead people.",
  "Houston, we have a problem.",
  "My precious.",
  "You had me at hello.",
  "Frankly, my dear, I don't give a damn.",
];

function createCanvasCtx(textEl) {
  const { fontStyle, fontFamily, fontSize } = getComputedStyle(textEl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // We set font information on the canvas context to
  // guarantee that the measure matches the style of the
  // rendered HTML element.
  ctx.font = `${fontStyle} ${fontSize} ${fontFamily}`;

  return ctx;
}

function measureTextWidth(ctx, text) {
  return ctx.measureText(text).width;
}

function measureAndDisplay(ctx, textEl, displayEl, rulerEl) {
  const width = measureTextWidth(ctx, textEl.textContent);
  displayEl.textContent = `${width.toFixed(2)}px`;
  rulerEl.style.width = `${width}px`;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#next-quote");
  const displayEl = document.querySelector("#display-size");
  const rulerEl = document.querySelector("#ruler");
  const textEl = document.querySelector("#movie-quote span");

  const ctx = createCanvasCtx(textEl);

  let currentIndex = 0;

  // Measure the initial quote on load
  measureAndDisplay(ctx, textEl, displayEl, rulerEl);

  btn.addEventListener("click", () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * QUOTES.length);
    } while (nextIndex === currentIndex);
    currentIndex = nextIndex;
    textEl.textContent = QUOTES[currentIndex];
    measureAndDisplay(ctx, textEl, displayEl, rulerEl);
  });
});
