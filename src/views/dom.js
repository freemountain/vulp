import flyd from 'flyd';

import { createApp as createDekuApp, element } from 'deku';
import debug from './../decorators/debug';

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

    flyd.on(function(ctx) {
      const el = element(component);

      return render(el, ctx);
    }, input);

    return dispatchStream;
  };
}
