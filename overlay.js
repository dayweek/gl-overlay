var GLOVERLAY;
if(GLOVERLAY) {
  throw new Error("GLOVERLAY variable is already defined");
}
GLOVERLAY = (function () {

  var placeholders, _gl, viewTop, viewBottom, viewLeft, viewRight, viewHeight;

  // Gets placeholders that are in current view
  var visibleViewports = function() {
    var elemTop, elemBottom, elemLeft, elemRight, elemWidth, elemHeight;
    var viewports = [];
    var placeholder;
    var rect;
    var n = placeholders.length;
    for(var i = 0; i < n; i++) {
      placeholder = placeholders[i].placeholder;
      rect = placeholder.getBoundingClientRect();
      elemWidth = placeholder.offsetWidth;
      elemHeight = placeholder.offsetHeight;
      elemTop = rect.top + viewTop;
      elemBottom = elemTop + elemHeight;
      elemLeft = rect.left + viewLeft;
      elemRight = elemLeft + elemWidth;
      // is placeholder partially in the browser view?
      if(
        // upper left
        (elemTop <= viewBottom && elemTop >= viewTop &&
         elemLeft <= viewRight && elemLeft >= viewLeft) ||

        // bottom left
        (elemBottom <= viewBottom && elemBottom >= viewTop &&
         elemLeft <= viewRight && elemLeft >= viewLeft) ||

        // upper right
        (elemTop <= viewBottom && elemTop >= viewTop &&
         elemRight <= viewRight && elemRight >= viewLeft) ||

        // bottom right
        (elemBottom <= viewBottom && elemBottom >= viewTop &&
         elemRight <= viewRight && elemRight >= viewLeft)) {
      //then
        viewports.push({renderFunction: placeholders[i].renderFunction, elemTop: elemTop, elemBottom: elemBottom, elemLeft: elemLeft, elemWidth: elemWidth, elemHeight: elemHeight});
       }
    }
    return viewports;
  };

  // Set up rendering function for each placeholder
  var itself = function (gl, relations) {
  _gl = gl;
    placeholders = [];
    for(var i = 0; i < relations.length; i++) {
      for(var ii = 0; ii < relations[i].placeholders.length; ii++) {
        placeholders.push({renderFunction: relations[i].renderFunction, placeholder: document.getElementById(relations[i].placeholders[ii])});
      }
    }
    return { render: render };
  };

  // clears framebuffer, for each placeholder sets up appropriate viewport and launches it's render function
  var render = function() {
    viewHeight = window.innerHeight;
    viewTop = window.pageYOffset;
    viewBottom = viewTop + viewHeight;
    viewLeft = window.pageXOffset;
    viewRight = viewLeft + window.innerWidth;
    var viewports = visibleViewports();
    var viewport;
    for(var i = 0, n = viewports.length; i < n; i++) {
      // compute coordinates for viewport
      viewport = viewports[i];
      gl.viewport(viewport.elemLeft - viewLeft, viewHeight + viewTop - viewport.elemTop - viewport.elemHeight, viewport.elemWidth, viewport.elemHeight);
      //console.log(viewport.elemLeft - viewLeft, viewHeight + viewTop - viewport.elemTop - viewport.elemHeight, viewport.elemWidth, viewport.elemHeight);

      viewport.renderFunction.call();
    }
  };
  return itself;
}());
