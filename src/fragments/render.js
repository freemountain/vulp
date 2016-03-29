import flyd from 'flyd';
import t from 'tcomb';

import Context from './../Context';
import { createApp as createDekuApp, element } from 'deku';
import debug from './../decorators/debug';

function requester(f) {
  let waiting = false;

  function handler() {
    if(waiting) f();
    waiting = false;
  }

  return {
    request: function() {
      if(waiting) return;
      requestAnimationFrame(handler);
      waiting = true;
    },
    clear: function() {
      waiting = false;
    }
  };
}

function createCtxStream(input) {
  let current = Context.ofState();
  const output = flyd.stream();
  const { request } = requester(function() {
    output(current);
  });

  flyd.on(function(patchSet) {
    if(t.Nil.is(patchSet) || patchSet.length === 0) return;
    current = current.update(patchSet);
    request();
  }, input);

  return output;
}

/**
 * This function is used to create the render part of your app.
 * If the view receives a context object, it will pass the context through your component.
 * All actions dispatched inside component, will be emitted from the view.
 * @param  {DOMElement} container - container dom element
 * @param  {Component} rawComponent - deku component
 * @return {BoundViewFactory}
 */

export default function dom(container, rawComponent) {
  return input => {
    const dispatchStream = flyd.stream();
    const dispatch = val => dispatchStream(val);
    const render = createDekuApp(container, dispatch);
    const component = debug()(rawComponent);
    const ctxStream = createCtxStream(input);

    flyd.on(function(ctx) {
      const el = element(component);

      console.log('render', ctx.get(true));
      return render(el, ctx);
    }, ctxStream);

    return dispatchStream;
  };
}
