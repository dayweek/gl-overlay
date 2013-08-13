# glOverlay

Ever wondering how to render multiple scenes into multiple canvases? Efficiently? Here's a method for doing that.

## How it works

Actually you don't need any canvases at all. You just pick some divs, let's say _#scene1_, _#scene2_ and a rendering function _renderFunction_ that draws triangle for example. GLOVERLAY automatically cretas fullscreen transparent canvas that draws the scene with _renderFunction_ into areas accomodated by the divs _#scene1_, _#scene2_.

You can have multiple _renderFunction_ functions which means for example one scene is rendered in the first div and the other one is rendered into another div. Cool huh?

## Usage

```javascript
var gl;
// you need to initialize WebGL context yourself
var relations = [{renderFunction: function () { drawSomething(gl); }, placeholders: ['#scene1', '#scene2']}];
overlay = GLOVERLAY(gl, relations);
overlay.render(); // do it in rendering loop
```

__Copyright__ David Hrachovy