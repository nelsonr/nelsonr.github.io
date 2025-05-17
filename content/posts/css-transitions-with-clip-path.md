+++
title = 'CSS transitions with clip-path'
date = '2025-05-10'
draft = true
+++

One of the more "recent" additions to CSS is {{< link url="https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path" text="clip-path" >}} property. It essentially allows you to add a mask to any content. Anything inside the mask region is shown, while anything outside of it becomes hidden.

There's a lot that can be said about to clip-path, but today I want to focus on using it in CSS transitions.

<!--more-->

<style>
.example {
    display: flex;
    justify-content: center;
}
</style>

## A simple mask

Let's start with something simple:

<style>
    .circle {
        clip-path: circle(35%);
        transition: clip-path 300ms ease-out;
        border-radius: 4px;
    }

    .circle:hover {
        clip-path: circle(100%);
    }
</style>
<div class="example">
    <figure>
        <img src="/images/kitty.jpg" alt="A kitty sunbathing in a outside sofa" width="200" height="200" class="circle">
        <figcaption>Hover the picture</figcaption>
    </figure>
</div>

When we hover over the picture, the full image reveals itself. Notice that, the cutout does not affect bounding-box of the element, so even though we initially see only part of the image, for the purpose of the layout, it's as if the image has clip-path at all.

Let's get into the code:

```html
<img src="/images/kitty.jpg" width="200" height="200" class="circle">
```

```css
.circle {
    clip-path: circle(35%);
    transition: clip-path 300ms ease-out;
}

.circle:hover {
    clip-path: circle(100%);
}
```

We add the `clip-path` property and use the `circle()` function to create a circular cutout of the image. Then add a transition effect to the property and change it on mouse hover.

There's more functions that we can play with, check the examples below:

<style>
    .rect {
        clip-path: rect(20% 80% 80% 20% round 10%);
        transition: clip-path 300ms ease-out;
        border-radius: 4px;
    }

    .rect:hover {
        clip-path: rect(0px 200px 200px 0px);
    }

    .tri {
        clip-path: polygon(50% 20%, 50% 20%, 20% 80%, 80% 80%);
        transition: clip-path 300ms ease-out;
        border-radius: 4px;
    }

    .tri:hover {
        clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%);
    }

    .rhombus {
        clip-path: polygon(50% 20%, 80% 50%, 50% 80%, 20% 50%);
        transition: clip-path 300ms ease-out;
        border-radius: 4px;
    }

    .rhombus:hover {
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    }
</style>
<div class="example">
    <figure>
        <img src="/images/kitty.jpg" alt="A kitty sunbathing in a outside sofa" width="200" height="200" class="rect">
        <figcaption>Hover the picture</figcaption>
    </figure>
    <figure>
        <img src="/images/kitty.jpg" alt="A kitty sunbathing in a outside sofa" width="200" height="200" class="tri">
        <figcaption>Hover the picture</figcaption>
    </figure>
    <figure>
        <img src="/images/kitty.jpg" alt="A kitty sunbathing in a outside sofa" width="200" height="200" class="rhombus">
        <figcaption>Hover the picture</figcaption>
    </figure>
</div>

Pretty neat, right?

## Color fill transition

<style>
.transitions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    justify-items: center;
    gap: 1em;
}

.card {
    display: grid;
    cursor: pointer;
    font-size: 1.1em;
    line-height: 1;
}

.card__default,
.card__transition {
    grid-column: 1;
    grid-row: 1;
    width: 200px;
    height: 200px;
    background-color: #131313;
    display: flex;
    justify-content: center;
    align-items: center;
    color: hotpink;
    font-weight: bold;
}

.card__transition {
    color: #131313;
    background-color: hotpink;
    clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
    transition: all 200ms ease-out;
}

.ex-01:hover .card__transition {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.ex-02 .card__transition {
    clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
}

.ex-02:hover .card__transition {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.ex-03:hover .card__transition {
    clip-path: polygon(0% 0%, 200% 0%, 100% 100%, 0% 100%);
}

.ex-04:hover .card__transition {
    clip-path: polygon(0% 0%, 100% 0%, 200% 100%, 0% 100%);
}
</style>
<div class="example">
    <div class="transitions">
        <div class="card ex-01">
            <div class="card__default">
                <div class="card__title">Hover me</div>
            </div>
            <div class="card__transition">
                <div class="card__title">Hover me</div>
            </div>
        </div>
        <div class="card ex-02">
            <div class="card__default">
                <div class="card__title">Hover me</div>
            </div>
            <div class="card__transition">
                <div class="card__title">Hover me</div>
            </div>
        </div>
        <div class="card ex-03">
            <div class="card__default">
                <div class="card__title">Hover me</div>
            </div>
            <div class="card__transition">
                <div class="card__title">Hover me</div>
            </div>
        </div>
        <div class="card ex-04">
            <div class="card__default">
                <div class="card__title">Hover me</div>
            </div>
            <div class="card__transition">
                <div class="card__title">Hover me</div>
            </div>
        </div>
    </div>
</div>
