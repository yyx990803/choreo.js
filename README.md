## Choreo.js

### flow control for building interactive walkthroughs

I work on a lot of html5 demos/walkthroughs that usually have a series of steps to go through. They are similar to a presentations, but have much more complex interactive contents. Existing presentation frameworks are mostly intrusive and don't give me the full flexibility, what I need is a non-intrusive flow control that can be used anywhere.

Choreo provides 'scenes' and 'steps' which can be navigated sequentially in both directions, and an event-based API for binding the navigation to the content. The core is totally abstract so you have full control over what's actually happening. DOM-related functionalities come in the form of plugins, which are modular and optional (work in progress).

**See the `example` folder for basic usage.**