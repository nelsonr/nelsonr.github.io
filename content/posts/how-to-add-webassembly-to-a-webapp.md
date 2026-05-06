+++
title = 'How to add WebAssembly to a web app'
date = '2026-05-05'
+++

[WebAssembly](https://webassembly.org) is the new, hot thing! Just kidding. It has been around since 2017. It's (almost) a 10 years old technology, ancient, by the JavaScript [framework standards](https://dayssincelastjsframework.com). Nonetheless, if you have been doing regular web stuff in the last decade, you probably have heard of it but, never or very rarely touched it. Let's change that!

<!--more-->

## Overview

So what is WebAssembly? To put it in simple terms, it's a binary format for the Web. 

Some of its [design goals](https://webassembly.github.io/spec/core/intro/introduction.html#design-goals) include: being **fast** (near native code speed), **safe** (runs in a sandbox environment) and **language-independent** (can be compiled from a variety of languages). It initially targeted just the Web but has since evolved to be a sort of [universal](https://webassembly.org/docs/non-web/), portable, binary format that can run in other environments, such as servers or embedded devices.

Why would you want to use it? Well, in your projects, depending on their scale or nature, it's likely that you encountered situations where you wished that the code would run faster. Or maybe, it required some tech that couldn't run on the browser and you had to defer to a server. It's in these kind of scenarios &mdash; especially when it comes to pure computation &mdash; that WebAssembly shines! Some of the web apps that you use daily at work, such as **Figma**, **Google Meet** or **Zoom**, use it, to handle expensive or complex calculations.

To create a WebAssembly program, you typically refer to a low-level language, such as **C**, to generate a `.wasm` file. This file can then be loaded into your web app to methods to be called by JavaScript. This process of loading the `.wasm` file, requires a bit of boilerplate code that can be hard to understand. Fortunately some of modern solutions abstract this part for us, so we can focus on what matters.

> Although low-level languages are often the preferred choice for compiling to WebAssembly, there's a [variety of options](https://webassembly.org/getting-started/developers-guide/) at your choice. You can even compile to it from COBOL or Pascal!

## Who are you people?

For this exercise we're going to build a **mOcking TExT geNeratoR**, like those seen on SpongeBob memes. Genius-level idea I know, but the main point is to show how to simple is to integrate WebAssembly into your app. Then you can integrate this knowledge in your enterprise-level web app, that burns through $20k of cloud server costs on every hour.

{{< image src="/images/mocking-spongebob.jpeg" width="200" alt="spongebob crushing JS developers' spirits" caption="Your average JS developer" >}}

Jokes aside, [here](https://nelsonr.github.io/vite-wasm-demo) you can see a demo similar to what we'll be creating. When you type in the text input, it renders the text in the box below with each letter randomly set to uppercase or lowercase.

Let's get it going. We'll use [Vite](https://vite.dev) to create the web app. Run the following command in your terminal to start the creation process:

```
npm create vite@latest
```

Choose a name of your liking for the app name and then set the following options:

1. Framework: **Vanilla**
2. Variant: **TypeScript**

After the app has been created, we'll need to do some cleanup to remove unnecessary code and files: 

1. Delete the `src/assets` folder 
2. Delete the `src/counter.ts` file 
3. Edit the `src/main.ts` file and delete everything other than the first line: `import "./style.css"`.

Your project tree should look something like this:

```
├── index.html
├── package-lock.json
├── package.json
├── public
│   ├── favicon.svg
│   └── icons.svg
├── src
│   ├── main.ts
│   └── style.css
└── tsconfig.json
```

Now to add the contents and styles for our web app:

1. Edit the `index.html` file and replace its contents with the code available [here](https://github.com/nelsonr/mocking-spongebob/blob/main/index.html).
2. Edit the `style.css` file and replace its contents with the code available [here](https://github.com/nelsonr/mocking-spongebob/blob/main/src/style.css).

Run the following command in the terminal to start the web app:

```
npm run dev
```

Navigate to [http://localhost:5173](http://localhost:5173) and if all went as planned, you should see something like this on your browser:

{{< image src="/images/mocking-spongebob-example.png" width="600" alt="Example of web app" >}}

## Crab attack!

Now for the fun part, let's add the WebAssembly code!

As mentioned before, we'll use a low-level language to generate the `.wasm` file. For this example we'll use the [Rust programming language](https://rust-lang.org). **Rust** is a widely popular, modern low-level language. Famous for its performance and memory-safety features. It also has very good integration with WebAssembly. 

If you never touched Rust before, don't worry, the code itself will be quite simple.

{{< image src="/images/rustacean-flat-happy.png" width="100" alt="Ferris, the crab" caption="Ferris, the unofficial mascot of Rust" >}}

> Follow the instructions available [here](https://rust-lang.org/tools/install/) to install **Rust** in your system.
