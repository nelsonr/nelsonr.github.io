const FILES = [
  { name: "Q4 Budget Report Final.xlsx", modified: "Mar 28, 2026" },
  { name: "Screenshot 2026-03-22 at 14.32.17.png", modified: "Mar 22, 2026" },
  { name: "Meeting Notes - Product Sync.docx", modified: "Mar 14, 2026" },
  { name: "Resume - Senior Frontend Engineer.pdf", modified: "Feb 7, 2026" },
  { name: "Untitled Document 3.pages", modified: "Today at 11:04" },
  { name: "Family Photos Miami Summer 2025.zip", modified: "Sep 3, 2025" },
  { name: "grocery list.txt", modified: "Yesterday at 08:45" },
  { name: "Client Proposal Redesign v2 FINAL.pdf", modified: "Apr 1, 2026" },
  { name: "WWDC 2025 Keynote Notes.md", modified: "Jun 10, 2025" },
  { name: "Italy Trip Expenses.numbers", modified: "Nov 12, 2025" },
  { name: "home insurance renewal 2026.pdf", modified: "Mar 3, 2026" },
  {
    name: "Airbnb Confirmation Porto May 2026.pdf",
    modified: "Today at 09:17",
  },
  { name: "book recommendations.txt", modified: "Feb 20, 2026" },
];

function renderFiles(tableEl, files) {
  const tableBody = tableEl.querySelector("tbody");
  const frag = document.createDocumentFragment();
  const randomFiles = [];

  while (randomFiles.length < 4) {
    const randomIndex = Math.floor(Math.random() * (files.length - 1));
    const randomItem = files[randomIndex];

    if (
      randomFiles.length === 0 ||
      randomFiles.findIndex((el) => el.name === randomItem.name) === -1
    ) {
      randomFiles.push(randomItem);
    }
  }

  for (const file of randomFiles) {
    const tableRow = document.createElement("tr");

    for (const columnContent of Object.values(file)) {
      const tableCol = document.createElement("td");
      tableCol.textContent = columnContent;
      tableRow.append(tableCol);
    }

    frag.append(tableRow);
  }

  tableBody.append(frag);
}

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
      const width = entry.contentRect.width;
      const result = resizeText(ctx, initialText, width);

      if (result !== textEl.textContent) {
        textEl.textContent = result;
      }
    }
  });

  resizeObserver.observe(textEl);
}

function setupColumnResize(tableEl) {
  const handleEl = tableEl.querySelector(".resize-handle");
  const columnEl = tableEl.querySelector("th");

  let columnWidth = 0;
  let pointerX = 0;

  const onPointerMove = (ev) => {
    const diff = ev.clientX - pointerX;
    const width = Math.max(80, columnWidth + diff);
    tableEl.style.setProperty("--col-filename-width", `${width}px`);
  };

  const onPointerDown = (ev) => {
    ev.preventDefault();
    pointerX = ev.clientX;
    columnWidth = columnEl.getBoundingClientRect().width;

    handleEl.onpointermove = onPointerMove;
    handleEl.setPointerCapture(ev.pointerId);
    tableEl.classList.add("filenames-table--resizing");
  };

  const onPointerCancel = (ev) => {
    handleEl.onpointermove = null;
    handleEl.releasePointerCapture(ev.pointerId);
    tableEl.classList.remove("filenames-table--resizing");
  };

  handleEl.onpointerdown = onPointerDown;
  handleEl.onpointerup = onPointerCancel;
  handleEl.onpointercancel = onPointerCancel;
}

document.addEventListener("DOMContentLoaded", () => {
  const tableEl = document.querySelector("table");

  renderFiles(tableEl, FILES);
  setupColumnResize(tableEl);

  const tableCells = tableEl.querySelectorAll("tr td:first-child");

  for (const tableCell of tableCells) {
    setupTextResize(tableCell);
  }
});
