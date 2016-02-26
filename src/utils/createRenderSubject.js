import flyd from 'flyd';
import curry from './curry';

import { createApp as createDekuApp, element } from 'deku';

/**
 * This function is used to create the render part of your app.
 * The returned Rx.Subject listen to state events.
 * State is used as context when rendering component with deku inside container.
 * All actions dispatched inside component, will be emitted from subject.
 * @param  {DOMElement} container - container dom element
 * @param  {Component} component - deku component
 * @return {Subject}
 */

export default curry(function createRenderSubject(container, component, input) {
  const dispatchStream = flyd.stream();
  const dispatch = val => dispatchStream(val);
  const render = createDekuApp(container, dispatch);

  flyd.on(function(ctx) {
    const el = element(component, { __ctx: ctx.get(true) });

    render(el, ctx);
  }, input);

  return dispatchStream;
});
