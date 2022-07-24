# Switch2Zero Coding Challenge

## Installation
This solution uses Node, React, TypeScript, Sass and Vite. Running it locally
should be as simple as:

```
> npm install
> npm run dev
```

It has also been published to the web using GitHub Actions / GitHub Pages, where it can be found at
[https://s2z-challenge.barnabycollins.com/](https://s2z-challenge.barnabycollins.com/).

## Features
The app is largely based on the example screenshot, though some slightly
different design choices have been made along the way.

The biggest of these changes is the addition of a cumulative carbon production /
sequestration graph, which shows the user how long it would take them to offset
all the carbon they produce from the current date (rather than just how long it
would take them to equal their annual carbon output). Obviously, this method is
flawed in that it ignores historical emissions, but it hopefully achieves its
goal of making the user aware of the carbon they produce before their planted
trees reach maturity.

I chose not to use Bootstrap, as I felt that it would be overkill for a simple
design such as this one. Instead, the application's stylesheet is a single file
leveraging flexboxes and a grid layout to produce a responsive and attractive
frontend.

While no administration console or UI adjustment of the parameters is built-in,
these features would be easy to add under the code's current architecture. All
values such as an individual tree's cost or rate of carbon sequestration are set
exactly once in a sensible place, and any changes to these values would
immediately be reflected in the rest of the application with no other changes
needed.
