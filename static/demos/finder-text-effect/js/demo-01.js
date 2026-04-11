function clampText(text, maxChars) {
  let result = text;

  if (text.length > maxChars) {
    const half = Math.floor(maxChars / 2);
    const firstHalf = text.slice(0, half);
    const secondHalf = text.slice(text.length - half);

    result = `${firstHalf}…${secondHalf}`;
  }

  return result;
}

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

function measureAndDisplay(ctx, textElem, displayElem) {
  const width = measureTextWidth(ctx, textElem.textContent);
  displayElem.textContent = `${width}px`;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const displayElem = document.querySelector("#display-size span");

  // Get a reference to the HTML element
  const textElem = document.querySelector("#movie-quote span");

  // Create a canvas 2d context using the HTML element
  const ctx = createCanvasCtx(textElem);

  // Calculate the display width of the text element
  measureAndDisplay(ctx, textElem, displayElem);

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const inputValue = formData.get("text");

    textElem.textContent = inputValue;
    measureAndDisplay(ctx, textElem, displayElem);
  });
});
