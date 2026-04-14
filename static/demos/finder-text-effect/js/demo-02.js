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

function resizeText(ctx, initialText, targetWidth) {
  let result = initialText;
  let maxChars = initialText.length;
  let textWidth = ctx.measureText(initialText).width;

  while (textWidth > targetWidth && textWidth > 0 && maxChars > 0) {
    result = clampText(initialText, maxChars--);
    textWidth = ctx.measureText(result).width;
  }

  return result;
}

function setupTextResize(textEl) {
  const ctx = createCanvasCtx(textEl);
  const initialText = textEl.textContent;

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      // Obtain the target width returned by the observer
      const targetWidth = entry.contentRect.width;

      // Transform the text to fit the target width
      const result = resizeText(ctx, initialText, targetWidth);

      // Update the displayed text
      if (result !== textEl.textContent) {
        textEl.textContent = result;
      }
    }
  });

  resizeObserver.observe(textEl);
}

function setupContainerResize(containerEl) {
  const handleEl = containerEl.querySelector(".resize-handle");

  let containerWidth = 0;
  let pointerX = 0;

  const onPointerMove = (ev) => {
    const diff = ev.clientX - pointerX;
    const width = Math.max(120, containerWidth + diff);
    containerEl.style.width = `${width}px`;
  };

  const onPointerDown = (ev) => {
    pointerX = ev.clientX;
    containerWidth = containerEl.getBoundingClientRect().width;

    handleEl.onpointermove = onPointerMove;
    handleEl.setPointerCapture(ev.pointerId);
    containerEl.classList.add("resizable--resizing");
  };

  const onPointerCancel = (ev) => {
    handleEl.onpointermove = null;
    handleEl.releasePointerCapture(ev.pointerId);
    containerEl.classList.remove("resizable--resizing");
  };

  handleEl.onpointerdown = onPointerDown;
  handleEl.onpointerup = onPointerCancel;
  handleEl.onpointercancel = onPointerCancel;
}

document.addEventListener("DOMContentLoaded", () => {
  const containerEl = document.querySelector(".resizable");
  const textEl = document.querySelector("#my-text");

  setupContainerResize(containerEl);
  setupTextResize(textEl);
});
