+++
title = 'Learning Go: Channels'
date = '2025-05-02'
+++

Recently, I've been on a journey to learn <a href="https://go.dev" target="_blank">Go</a>.

One of its defining features, is the concept of <a href="https://go.dev/doc/effective_go#channels" target="_blank">Channels</a>.

Channels are the way Go enables communication between asynchronous code, which in Go takes the name of <a href="https://go.dev/doc/effective_go#goroutines" target="_blank">goroutines</a>.

<!--more-->

## Creating a channel

To create a channel in Go, we use the `make()` function:

```Go
ch := make(chan string)
```

When creating a channel it's always necessary to define its underlying type. In this case we created a channel of the type `string`.

## Using a channel

We have our channel, so how do we use it? There's two things you can do with it, **send** or **receive** messages.

Let's send a message to the channel we just created:

```Go
ch <- "Hello!"
```

This arrow is a special operator, unique to channels. Whatever is on the left side of the arrow is the receiver, and whatever is on the right is the sender. In our case we're just sending a string, but it could also be the result of a function.

Now, let's see how can we receive a message:

```Go
msg := <-ch
```

Here, we're receiving a message from the channel and storing it on a new variable `msg`.

## Putting it in practice

Let's create something that puts in practice everything we covered so far.

For the example, we'll create two functions, one that sends messages and another one to receive them.

First, let's define the sender:

```Go {linenos=inline}
func sender(ch chan<- string) {
	for i := range 5 {
		if i < 4 {
			ch <- "Tick!"
		} else {
			ch <- "BOOM!"
		}

		time.Sleep(500 * time.Millisecond)
	}
}
```

Notice the type of the argument of the `sender` function. It looks odd doesn't it? By default, a channel is **bidirectional**, in other words, it can both send and receive messages. But what if we want to only send or receive messages?

We can define the direction of a channel, by putting an arrow **before** or **after** the `chan` type. In this case we're saying that the argument `ch` is a **send-only channel**.

The function should be straightforward to understand, we're looping 5 times, each time sending a message to the channel and then waiting 500ms until the next one is sent.

Now, let's define the receiver:

```Go {linenos=inline}
func receiver(ch <-chan string) {
	for msg := range ch {
		log.Println(msg)
	}
}
```

Once again, notice the placement of the arrow next to the `chan` type. In this case we're saying that this is a **receive-only channel**.

As for the function, we're using the `for range` to continuously read the messages sent to the channel. The `for` loop won't actually proceed unless a message is received, so we won't see anything being printed.

> On the other end, a message is also not sent until a receiver is available. If we attempt to send a message without some receiver defined, our application will panic and crash, so it's important to keep that in mind.

## Glueing it together

We've defined the main pieces of our channel communication. All that's left is to glue everything together.

Here's the code for the `main` function:

```Go {linenos=inline}
func main() {
	ch := make(chan string)
	done := make(chan bool)

	go receiver(ch)

	go func() {
		sender(ch)
		close(ch)
		done <- true
	}()

	<-done
}
```

Let's go over the code, starting from the top:

```Go {linenos=inline}
ch := make(chan string)
done := make(chan bool)
```

Here, we're creating two channels, one for the communication between functions and another for controlling the execution of our program (more on that later).

```Go {linenos=inline}
go receiver(ch)

go func() {
    sender(ch)
    close(ch)
    done <- true
}()
```

Next, we're creating two goroutines, one for the receiver and another for the sender. You might wonder why the goroutine for the sender is different?

In this case we want to react to when the `sender()` function finishes, to do some clean up and to trigger the end of our program.

After the `sender()` terminates, we're using `close()` function to close the channel, to let any other consumers know, that no more messages will be sent. This causes the `receiver()` function to terminate as well.

Lastly, we send a message to our second channel that has been waiting all this time.

```Go
<-done
```

Because reading from a channel is a blocking action, until a message is sent, the program won't proceed.

```Go
done <- true
```

When we send the message to the `done` channel, we unblock it, letting the rest of the program continue. But, since there's nothing else to do, it terminates.

Here's the result of running our program:

```
2025/05/01 23:55:17 Tick!
2025/05/01 23:55:17 Tick!
2025/05/01 23:55:18 Tick!
2025/05/01 23:55:18 Tick!
2025/05/01 23:55:19 BOOM!
```

As expected, we see four "Tick!" messages before finishing with a "BOOM!".

For the full, documented code, check it <a href="https://gist.github.com/nelsonr/040a2d89b32fc7b767dbc443b78f8f28" target="_blank">here</a>.

## Conclusion

As you see, channels are very powerful feature and there's more that can be done with them than just this simple example. We just covered the surface.

Hope you've enjoyed this small trip to the land of Go channels! And more importantly, that you feel you've learned something new. I sure did.

Until next time! :)
