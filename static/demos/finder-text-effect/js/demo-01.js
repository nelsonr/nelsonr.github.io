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

function createCanvasCtx(textElem) {
  const { fontStyle, fontFamily, fontSize } = getComputedStyle(textElem);
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

function measureAndDisplay(ctx, textElem, displayElem, rulerElem) {
  const width = measureTextWidth(ctx, textElem.textContent);
  displayElem.textContent = `${width.toFixed(2)}px`;
  rulerElem.style.width = `${width}px`;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#next-quote");
  const displayElem = document.querySelector("#display-size");
  const rulerElem = document.querySelector("#ruler");
  const textElem = document.querySelector("#movie-quote span");

  const ctx = createCanvasCtx(textElem);

  let currentIndex = 0;

  // Measure the initial quote on load
  measureAndDisplay(ctx, textElem, displayElem, rulerElem);

  btn.addEventListener("click", () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * QUOTES.length);
    } while (nextIndex === currentIndex);
    currentIndex = nextIndex;
    textElem.textContent = QUOTES[currentIndex];
    measureAndDisplay(ctx, textElem, displayElem, rulerElem);
  });
});
