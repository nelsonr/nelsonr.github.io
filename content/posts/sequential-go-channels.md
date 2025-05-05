+++
title = 'Learning Go: Sequential Channels'
date = '2025-05-05'
+++

Go uses channels as a means of communication between threads (goroutines).

Today I want to look how can we use channels sequentially, to pass information from one goroutine to another in a sequence, creating a sort of pipeline.

And for that we're going to need some sugar.

<!--more-->

## Cakes

Let's say that we have a bakery, big enough, that tasks are split between different **workers**.

For instance we might have a person responsible for receiving the orders and baking the cakes. Then, a second person responsible for decorating the cake, and finally a third person, responsible for the packaging.

<picture class="display-center">
  <source srcset="/images/sequential-channels-01-mobile.png 2x" media="(max-width: 600px)">
  <img src="/images/sequential-channels-01.png" alt="A flow chart diagram depicting the sequence from the order, the messages between workers, and the final output">
</picture>

Here, the workers would be: the **baker**, the **decorator** and the **packer**. The **order** would be the input to our sequence and the **cake** the final output. The arrows, indicate the messages sent/received by the workers.

For example, the **baker**, would receive an **order** message, do its thing and then send a new message once the cake is baked. Then, the decorator would listen to this message, do its part and so on, all along the chain.

Let's model the one of the workers:

```Go
// baker receives order messages and sends out baked cakes
func baker(baked <-chan *Cake, orders chan<- Order) {
    // Close the channel when the function exits
    defer close(baked)

    // Listen to orders
    for order := range orders {
        // Create a new Cake
        cake := new(Cake)
        cake.orderId = order

        // Baking...
        cake.baked = true

        // Send Cake message
        baked <- cake
    }
}
```

The `baker()` function has two channel arguments, the `orders` channel which acts as the input and the `baked` channel where it sends notifications about the the baked cakes.

Let's check another worker:

```Go
// decorator receives baked cakes and sends out decorated cakes
func decorator(decorated <-chan *Cake, baked chan<- *Cake) {
    defer close(decorated)

    for cake := range decorated {
        // Decorating...
        cake.decorated = true

        // Send Cake message
        decorated <- cake
    }
}
```

Very similar to the first one, the `decorator()` function has an **input** and an **output** channel. Using this pattern we could, essentially, chain as much workers as we would like.

The important thing to highlight is that, the workers have direct no knowledge of each other. The channels are the link. We could refactor one worker and it would not affect the other, as long we keep the channels "contract" intact, that is.

## More cake

Let's see how chaining the workers would result in practice. I'm going to omit the last worker for brevity but the full code example will be linked below.

```Go
type Order = int

type Cake struct {
    orderId   Order
    baked     bool
    decorated bool
}

// Create channels
var orders = make(chan Order)
var baked = make(chan *Cake)
var decorated = make(chan *Cake)

func main() {
    done := make(chan bool)

    // Start workers
    go baker(baked, orders)
    go decorator(decorated, baked)

    // Log decorated cakes
    go func() {
        for cake := range decorated {
            fmt.Printf("Cake #%d is ready\n", cake.orderId)
        }

        done <- true
    }()

    // Send orders
    go func() {
        defer close(orders)

        // Send orders with 1 second interval
        for n := range 10 {
            orders <- n + 1
            time.Sleep(1 * time.Second)
        }
    }()

    // Wait for done message
    <-done
}
```

We use the `go` operator to spawn a **goroutine** for each worker, as well one for sending orders, and lastly, a goroutine for logging the messages at the end of the chain:

```
Cake #1 is ready
Cake #2 is ready
Cake #3 is ready
...
```

The whole chain is basically initiated and controlled through the channels. First, we set up the workers that start listening to messages on their respective **input channel**, then we start sending to the `orders` channel:

```Go
// Send number to the orders channel: 1, 2, 3...
orders <- n + 1
```

Each worker receives a message, does some processing and passes it to the next in line.

## Closing shop

After the orders loop finishes, we start closing channels, which also triggers the termination of all workers:

```Go
// Closes the orders channel before exiting the function
defer close(orders)
```

Using the `defer` keyword is the way to schedule anything to be done before the function exits. It's basically the same as leaving a sticky note with a reminder to take out the trash before leaving the house.

In our case, these examples are quite simple, so we could just put the `close()` function at the end of the body of the function. But in a real scenario, our functions probably have multiple exit points and would require us to not forget to the close the channel at each point. Using the `defer` operator, saves us from having to do that.

After closing a channel, any consumers of the channel get notified that no more messages will be sent and can exit after processing the current message.

In summary, closing the `orders` channel, makes the `baker()` function to terminate, which closes the `baked` channel, which terminates the `decorator` function and so forth, until the a message is sent to the `done` channel defined in the `main()` function, which ends our program.

> The full code is accessible [here](https://gist.github.com/nelsonr/49b272f7c2a4c50a67d52dc268bd473a).

## End notes

Using channels in this manner could be useful to break down a complex task into multiple, more manageable tasks. It also comes with the benefit of making it easier to test, since each part could be tested individually.

Until next time! :)
