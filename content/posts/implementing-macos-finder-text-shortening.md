+++
title = 'Implementing macOS Finder text shortening'
date = '2026-04-14'
+++

I recently watched a video from a talk about the [future of the Desktop UX](https://www.youtube.com/watch?v=1fZTOjd_bOQ) from Scott Jenson, a designer who has worked on a lot of stuff that we all probably use in our daily lives, without giving it much thought.

Right at the beginning of the talk, he mentions some of his work while at Apple, including a cool detail about how **Finder** handles the display of filenames. Instead of placing the ellipsis at the end, Finder places it in the middle — which, according to him, preserves important information about the file.

It's a neat detail, and while I didn't pay it much attention back then, it recently came back to me and it's just the sort of UI challenge that I love to tackle, so here we are.

<!--more-->

## Some context

Just to give some brief context if you haven't used Finder before, here's a short video about the behavior we're implementing:

<video src="/videos/finder-recording.webm" width="480" muted loop autoplay></video>

As you can see, when you resize the column, Finder adjusts the filenames by shortening from the middle, while keeping both ends of the filename always visible.

## Divide and conquer

Let's think about how this works in practice. As we resize the column, we reduce the **available width** for the text. That's one factor. 

The second factor will be to measure the **display width** of the text, which would be simple if we were dealing with a monospace font, but there's no guarantee that it's going to be the case. Fortunately, there's a neat trick for that, using the `<canvas>` element.

Finally, knowing both the **available width** and the **display width** of the text, all that's left is to reduce the text until it fits the available width. 

Let's start from the text shortening method, and build up from that as we go.

> We'll use [TypeScript](https://www.typescriptlang.org) for the code examples. You should have no problem following it, just ignore the types if necessary.

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

The core logic is quite simple: we take a string and a character count, divide it in half to obtain the number of characters to take from both ends of the string. Lastly, we join them together with an [ellipsis unicode character](https://unicodeplus.com/U+2026). 

> We could have used three periods ("...") but they would have used more display space, depending on the font used.

Ok! Let's tackle the next thing, measuring the display width of the text. For this we'll use a feature from the `<canvas>` element that has been available since 2015 but you probably never used or heard of: `measureText()`.

This method returns metrics information about a text, such as the [rendered width](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics#measuring_text_width), which is just what we need.

```HTML
<!-- Our test HTML element -->
<div id="movie-quote">You can't handle the truth!</div>
```

```TS
function createCanvasCtx(textEl: HTMLElement): CanvasRenderingContext2D {
  const {fontStyle, fontFamily, fontSize} = getComputedStyle(textEl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // We set font information on the canvas context to 
  // guarantee that the measure matches the style of the
  // rendered HTML element.
  ctx.font = `${fontStyle} ${fontSize} ${fontFamily}`;
  
  return ctx;
}

// Get a reference to the HTML element
const textEl = document.getElementById("movie-quote");

// Create a canvas 2d context using the HTML element
const ctx = createCanvasCtx(textEl);

// Calculate the display width of the text element
const width = ctx.measureText(textEl.textContent).width;
```

Let's break down the **TypeScript** code.

First, we have the `createCanvasCtx()` function, that expects an HTML element as an argument and returns a canvas 2d context. The HTML element argument is necessary because we're basically drawing the text onto the canvas. For the measure to be correct, we need to extract some style information so that the drawn text has the same style properties as our HTML element.

Here's a live example of the text measurement:

{{< iframe-demo src="/demos/finder-text-effect/demo-01.html" height="300" >}}

You might be wondering why we couldn't just use `.clientWidth` or `.getBoundingClientRect()` to obtain the width of the displayed text? 

That's a good question. Both approaches force a layout/style recalculation, which can be an expensive operation for the browser and often a reason behind **performance issues**.

In our case, we're going to be calling the measure method multiple times during the resize process so, it makes sense to minimize the performance impact if we're able to. Our approach never touches the DOM so, even if we call it 50 times a second, it won't ever affect the layout.

> For a complete reference of all properties/methods that trigger layout/style recalculation, check [here](https://gist.github.com/paulirish/5d52fb081b3570c81e3a).

## The final stretch

We're almost there. 

So far, we have created methods that can **compute the display width** of text and a clamp function that **shortens the text** given a maximum number of characters.

The next step is to define a method that allows us to resize the text to fit a **target width**:

```TS
function resizeText(
  ctx: CanvasRenderingContext2D, 
  initialText: string, 
  targetWidth: number
): string {
  let result = initialText;
  let maxChars = initialText.length;
  let textWidth = ctx.measureText(initialText).width;

  // Loop while reducing the maximum number of 
  // chars until the text fits the target width.
  while (textWidth > targetWidth && textWidth > 0 && maxChars > 0) {
    result = clampText(initialText, maxChars--);
    textWidth = ctx.measureText(result).width;
  }

  return result;
}
```

Let's break down the code.

For the arguments we receive the canvas 2d context we created earlier (`ctx`), the initial text content of the HTML element (`initialText`) and the `targetWidth` that our text needs to fit into.

We then do some initial setup for our loop.

```TS
  let result = initialText;
  let maxChars = initialText.length;
  let textWidth = ctx.measureText(initialText).width;
```

> It's important that we always start with the initial text of the element because we don't know if we're shortening or expanding the displayed text. So, rather than assuming, we always start from the same state. It might incur into extra operations but our loop should be fast enough that it won't cause any stutter.

This is where everything connects. On each iteration of the loop, we shorten the text by a single character and then do a new measure. The loop will keep going until its condition turns false, which means that either we reached the target width or that we ran out of characters.

```TS
while (textWidth > targetWidth && textWidth > 0 && maxChars > 0) {
  result = clampText(initialText, maxChars--);
  textWidth = ctx.measureText(result).width;
}
```

There's just one more piece to our puzzle: when do we run all of this?

There are probably multiple paths we could take with this but, for this example we're going to use the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) API. 

In case you're not familiar with it, this API allows us to know about changes to dimensions of an HTML element, which is just what we need.

Every time the HTML element's dimensions change, we'll be notified about the new **target width**.

Let's set this up:

```TS
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

// Example:
const textEl = document.querySelector("#my-text");
setupTextResize(textEl);
```

It might look complex but we're essentially declaring the observer, telling it to watch our text element's dimensions, and executing our callback whenever they change.

> The `entries` is just an `Array` of the elements being observed. In our case it's always a single HTML element.

That's it! Go ahead and try it — move the **handle** at the edge of the container to see the text change:

{{< iframe-demo src="/demos/finder-text-effect/demo-02.html" height="300" >}}

## Final demo

To finalize, a minimal reproduction of what we saw in the video at the start of this post.

Try to move the column divider to see the table cells of the **Name** column adjust to the available width.

{{< iframe-demo src="/demos/finder-text-effect/demo-03.html" height="300" >}}

If you're still reading this far, thank you! Hope you've enjoyed this small exploration. 

It's something minimal, but it's neat details like this that end up making a difference to the overall experience of the applications we use daily.

The full code of the presented demos is available on [Github](https://github.com/nelsonr/nelsonr.github.io/tree/main/static/demos/finder-text-effect).

In this exploration we didn't use any frontend framework and that was intentional. It would have introduced an extra layer of complexity and made the code examples less approachable. 

Nonetheless, if you're a fan of **React**, you can see a similar example of this effect [here](https://nelsonr.github.io/text-clamp-ui/) ([source code](https://github.com/nelsonr/text-clamp-ui)).
