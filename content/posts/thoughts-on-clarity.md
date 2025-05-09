+++
title = 'Thoughts on clarity'
date = '2025-05-09'
+++

Writing code for a living is a tricky business. There’s a lot that happens even before a line of code is put on the screen: meetings, gathering requirements, asking questions, discussions on which technology stack to use, and so on.

All of this is done with one purpose: figuring out the shape of the solution to the problem. We do this because, humans aren’t yet able to read each other's minds. And because we need a proper understanding of the task at hand before we can start working on it.

So why, then, aren’t we also taking the same care on translating this understanding to the code that we write?

## What is code?

Some might say that code is just instructions for the computer to perform some task. That’s, in part, true, but it’s also a written specification of the problem that someone else needs to read, change, and maintain. How can you maintain something without understanding in the first place?

To even start writing something, especially when it’s a complex system, we need to, basically, “load” the problem into our brain, that takes some hard thinking. After that step is done, we write some code and test it to see if we’re on the right path, and it’s back again for some more thinking.

It’s a process that takes precious, sometimes limited, time.

Now imagine that every time that you go back to this code that you just wrote, you would need to repeat the whole thinking process again. Wouldn’t that be a waste of time?

## Code is for humans

If you have been working for a while, there’s a big chance that you’ve been part of a team or two. That team most probably had people with different levels of experience and, most important, different levels of understanding of the project as a whole.

This is a crucial factor that is often disregarded; we’re not just writing code for the machine or for ourselves, but for the whole team, which will have to keep it working long after you’ve left the project. If you’re the only one who understands your code, even if it’s fast, is that really, good code?

How many times have you encountered a codebase that’s full of cryptic code? Full of one-letter variables, conditions that span multiple lines and refer to multiple, scattered variables, that makes you jump around just to get an idea of WTF is going on? Is that triple-nested ternary expression really that good just because it saved two lines of code?

What good is code if no one else understands it?

## Clear as water

I know that the people that end up using the software we write don’t give a damn about the code we write; all they care about is whether the program works or not. But they also care about it not having bugs. Which is what happens when something is not clear. And nobody likes that.

Shipping software is hard, but it’s also kind of magical when you really think about it. Someone asks us for a thing; we write some gibberish, hit a button, and magic comes out.

Now, there's some gibberish that nobody understands, and there's some, that people, like you and me, do.

Let's aim for more of the latter.
