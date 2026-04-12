+++
title = 'Implementing macOS Finder text shortening'
date = '2026-04-10'
draft = true
+++

I recently watched a video from a talk about the [future of the Desktop UX](https://www.youtube.com/watch?v=1fZTOjd_bOQ) from Scott Jenson, a designer that has worked on a lot of stuff that we all probably use in our daily lives, without giving it much thought.

Right at the beginning of the talk, he mentions some of his work while at Apple, including a cool detail about how Finder handles the display of filenames. When there's not enough room to display the full filename, Finder displays an ellipsis in the middle of the filename instead of placing it at the end, which, according to him, would omit important information about the file itself.

It's a neat detail, and while I didn't paid it much attention back then, it recently came back to me and, it's just the sort of UI challenge that I love to tackle, so here we are.

<!--more-->

## Some context

Just to give some brief context if you haven't used Finder before, here's short video about the behavior we're implementing:

<video src="/videos/finder-recording.webm" width="480" muted loop autoplay></video>

As you can see, when you resize the column, Finder adjusts the filenames  by shortening from the middle, while keeping both start and end of the name always visible.

## Divide and conquer

Let's think about how this works in practice. As we resize the column, we reduce the **available width** for the text. That's one factor. 

The second factor will be to measure the the **display width** of the text, which, would be simple if we were dealing with a monospace font but, there's no guarantee that it's going to be the case. Fortunately, there's a neat trick for that, using the `<canvas>` element.

Finally, knowing both the **available width** and the **display width** of the text, all that's left is to reduce the text until it fits the available width. 

Let's start from this last point, which is simpler, and build up our logic as we go.

> The code examples will be in [TypeScript](https://www.typescriptlang.org). It's just a matter of personal preference but you'll be fine using JavaScript as well.

## Show me the code!

First, we're going to define a function that takes a `string`, a maximum `number` of characters and returns a transformed string:

```TS
function clampText(text: string, maxChars: number): string {
  let result = text;

  if (text.length > maxChars) {
    const half = Math.floor(maxChars / 2);
    const firstHalf = text.slice(0, half);
    const secondHalf = text.slice(text.length - half);

    result = `${firstHalf}…${secondHalf}`;
  }

  return result;
}

// Examples:
clampText("Hello, world!", 7); // "Hel…ld!"
clampText("Learning new things is cool!", 18); // "Learning … is cool!"
```

The core logic is quite simple: we take a string and the number of characters and divide the number in half to obtain the characters count to take from the both ends of the string. Lastly, we join them together with a [ellipsis unicode character](https://unicodeplus.com/U+2026). 

> We could have used three periods ("...") but they would have used more display space, depending on the font used.

Ok! Let's tackle the next thing, measuring the display width of the text. For this we'll use a feature from the `<canvas>` has been available since 2015 but you probably never used or heard of: `measureText()`.

This method returns metrics information about a text, such as the [rendered width](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics#measuring_text_width), which is just what we need.

```HTML
<!-- Our test HTML element -->
<div id="movie-quote">You can't handle the truth!</div>
```

```TS
function createCanvasCtx(textElem: HTMLElement): CanvasRenderingContext2D {
  const {fontStyle, fontFamily, fontSize} = getComputedStyle(textElem);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // We set font information on the canvas context to 
  // guarantee that the measure matches the style of the
  // rendered HTML element.
  ctx.font = `${fontStyle} ${fontSize} ${fontFamily}`;
  
  return ctx;
}

function measureTextWidth(ctx: CanvasRenderingContext2D, text: string): number {
  return ctx.measureText(text).width;
}

// Get a reference to the HTML element
const textElem = document.getElementById("movie-quote");

// Create a canvas 2d context using the HTML element
const ctx = createCanvasCtx(textElem);

// Calculate the display width of the text element
const width = measureTextWidth(ctx, textElem.textContent);
```

Let's breakdown the **TypeScript** code.

First, we have the `createCanvasCtx()` function, that expects an HTML element as an argument and returns a canvas 2d context. The HTML element argument is necessary because, we're basically drawing the text onto the canvas. For the measure to be correct, we need to extract some style information so that, the drawn text has the same style properties as our HTML element.

Here's a live example that you can play with:

{{< iframe-demo src="/demos/finder-text-effect/demo-01.html" height="300" >}}
