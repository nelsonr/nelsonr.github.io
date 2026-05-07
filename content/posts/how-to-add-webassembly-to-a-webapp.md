+++
title = 'How to add WebAssembly to a web app'
date = '2026-05-05'
draft = true
+++

[WebAssembly](https://webassembly.org) is the new, hot thing! Just kidding. It has been around since 2017. It's (almost) a 10 years old technology, ancient, by the JavaScript [framework standards](https://dayssincelastjsframework.com). Nonetheless, if you have been doing regular web stuff in the last decade, you probably have heard of it but, never or very rarely touched it. Let's change that!

<!--more-->

## Overview

So what is WebAssembly? To put it in simple terms, it's a binary format for the Web. 

Some of its [design goals](https://webassembly.github.io/spec/core/intro/introduction.html#design-goals) include: being **fast** (near native code speed), **safe** (runs in a sandbox environment) and **language-independent** (can be compiled from a variety of languages). It initially targeted just the Web but has since evolved to be a sort of [universal](https://webassembly.org/docs/non-web/), portable, binary format that can run in other environments, such as servers or embedded devices.

Why would you want to use it? Well, in your projects, depending on their scale or nature, it's likely that you encountered situations where you wished that the code would run faster. Or maybe, it required some tech that couldn't run on the browser and you had to defer to a server. It's in these kind of scenarios &mdash; especially when it comes to pure computation &mdash; that WebAssembly shines! Some of the web apps that you use daily at work, such as **Figma**, **Google Meet** or **Zoom**, use it, to handle expensive or complex calculations.

To create a WebAssembly program, you typically refer to a low-level language, such as **C**, to generate a `.wasm` file. This file can then be loaded into your web app to methods to be called by JavaScript. This process of loading the `.wasm` file, requires a bit of boilerplate code that can be hard to understand. Fortunately some of modern solutions abstract this part for us, so we can focus on what matters.

> Although low-level languages are often the preferred choice for compiling to WebAssembly, there's a [variety of options](https://webassembly.org/getting-started/developers-guide/) at your choice. You can even compile to it from COBOL or Pascal!

## Who are you people?!

For this exercise we're going to build a **mOckIng TExT geNeratoR**, like those seen on SpongeBob memes. Genius level idea, I know. But hopefully you'll learn something useful in the process.

{{< image src="/images/mocking-spongebob.jpeg" width="200" alt="spongebob crushing JS developers' spirits" caption="Your average JS developer" >}}

Jokes aside, here is a [demo](https://nelsonr.github.io/vite-wasm-demo) similar to what we'll be creating. When you type in the text input, it renders the text in the box below with each letter randomly set to uppercase or lowercase.

Let's start! We'll use [Vite](https://vite.dev) to create the web app. Run the following command in your terminal to create the web app:

```Bash
npm create vite@latest
```

During the setup set any name of your liking for the app name and then set the following options:

1. Framework: **Vanilla**
2. Variant: **TypeScript**

After the app has been created, we'll need to do some cleanup to remove unnecessary code and files: 

1. Delete the `src/assets` folder 
2. Delete the `src/counter.ts` file 
3. Edit the `src/main.ts` file and delete everything other than the first line: `import "./style.css"`.

Your project tree should look something like this:

```bash
app-name
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

```bash
npm run dev
```

Navigate to [http://localhost:5173](http://localhost:5173) and if all went as planned, you should see something like this on your browser:

{{< image src="/images/mocking-spongebob-example.png" width="600" alt="Example of web app" >}}

## Crab attack!

As mentioned before, we'll use a low-level language to generate the `.wasm` file. For this example we'll use the [Rust programming language](https://rust-lang.org). **Rust** is a widely popular, modern, low-level language. Well known for its performance and memory-safety features. It also has very good integration with WebAssembly. 

{{< image src="/images/rustacean-flat-happy.png" width="100" alt="Ferris, the crab" caption="Ferris, the unofficial mascot of Rust" >}}

If you never touched Rust before, don't worry, the code itself will be quite simple. Meanwhile, go ahead and install Rust if you don't have it yet. It's ok, I'll wait...

> Follow the instructions available [here](https://rust-lang.org/tools/install/) to install **Rust** in your system.

All good? Ok! We'll use **cargo** (the package manager for Rust) to generate a new project. Go ahead and run the following command in the project root:

```bash
cargo new --lib wasm
```

This command creates a new package named **wasm**. We could have chosen any other name, it has no special meaning. If all went well, you should see a new directory in the project root:

```bash
wasm
├── Cargo.toml
└── src
    └── lib.rs
```

The `lib.rs` file is where we're going to place our code to generate the WebAssembly module. But before that, there's some dependencies that we need take care of. 

Edit the `Cargo.toml` file and add the following:

```toml
[dependencies]
wasm-bindgen = "0.2.120"
getrandom = { version = "0.4.2", features = ["wasm_js"] }
rand = "0.10.1"

[lib]
crate-type = ["cdylib"]
```

Run the following command to install the new dependencies:

```bash
cargo check
```

I'll briefly go over what was added. The `getrandom` and `rand` packages are for the random number generation, to randomly set each character to either upper or lowercase. The [wasm-bindgen](https://github.com/wasm-bindgen/wasm-bindgen) package is the main library that will generate the `.wasm` module, as well some JS glue code to facilitate the integration into our web app. Finally, the `[lib]` section specifies what kind of artifact will be produced when the project is compiled. In this case, a **C** compatible dynamic library, a requirement for a `.wasm` module.

One last dependency remains: [wasm-pack](https://github.com/wasm-bindgen/wasm-pack). This is a build tool for compiling the Rust code into a neat NPM package that can be easily imported as a simple dependency of our web app.

Run the following command to install it:

```bash
cargo install wasm-pack
```

## It's assembly time!

It's finally time to do some coding. Let's start with `lib.rs` file. Replace its contents with the following:

```Rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn get_mocking_text(text: &str) -> String {
    text.split("")
        .map(|char| {
            if rand::random_bool(1.0 / 3.0) {
                char.to_uppercase()
            } else {
                char.to_lowercase()
            }
        })
        .collect()
}
```

Without going over into much detail, we're simply defining a method that accepts a string, iterates over each character and randomly sets it to either upper or lowercase.

The magic bit happens in the `#[wasm_bindgen]` line. This is called an **attribute macro** in Rust and by adding it above the method we're basically telling to the Rust compiler: *"Hey, I want to expose this to the JavaScript context!"*. Simple, right?

That's all that it for the Rust code. Let's compile it. Run the following command inside the `wasm` directory:

```bash
wasm-pack build --target web
```

{{< image src="/images/power-rangers-dance.gif" width="200" alt="It's dancing time!" caption="Compiling time!" >}}

After the build completes you should have a new `pkg` directory available:

```bash
wasm
├── Cargo.lock
├── Cargo.toml
├── src
│   └── lib.rs
└── pkg
    ├── package.json
    ├── wasm.d.ts
    ├── wasm.js
    ├── wasm_bg.wasm
    └── wasm_bg.wasm.d.ts
```

Here's our `.wasm` file! Look at it! There's also a `wasm.js` file, this includes the glue code between JavaScript and the `.wasm` file. Lastly we have some TypeScript type definition files and, a `package.json`. This is our local NPM package, let's add it to our web app.

Open the `package.json` file in the project root and the dependency to the `pkg` directory:

```JSON
{
  // ...
  "dependencies": {
    "wasm": "file:wasm/pkg",
  }
}
```

> If you're using [pnpm](https://pnpm.io) use `link:` instead of `file:`

Run the following command in the project root to install the new NPM dependency:

```bash
npm install
```

Now if you peek inside the `node_modules` directory, there should be a shortcut to the `wasm` folder.
