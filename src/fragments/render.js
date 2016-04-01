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
 * render fragment factory
 * This function is used to create the render part of your app.
 * If the view receives a context object, it will pass the context through your component.
 * All actions dispatched inside component, will be emitted from the view.
 *
 * @param  {DOMElement} container - container dom element
 * @param  {Component} component - component to render in container
 * @returns {BoundFragmentFactory}
 */
export default function render(container, component) {
  return input => {
    const dispatchStream = flyd.stream();
    const dispatch = val => dispatchStream(val);
    const renderDom = createDekuApp(container, dispatch);
    const wrappedComponent = debug()(component);
    const ctxStream = createCtxStream(input);

    flyd.on(function(ctx) {
      const el = element(wrappedComponent);

      console.log('render', ctx.get(true));
      return renderDom(el, ctx);
    }, ctxStream);

    return dispatchStream;
  };
}
