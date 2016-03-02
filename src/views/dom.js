import flyd from 'flyd';
import curry from './../utils/curry';

import { createApp as createDekuApp, element } from 'deku';
import base from './../decorators/base';

/**
 * This function is used to create the render part of your app.
 * The returned Rx.Subject listen to state events.
 * State is used as context when rendering component with deku inside container.
 * All actions dispatched inside component, will be emitted from subject.
 * @param  {DOMElement} container - container dom element
 * @param  {Component} component - deku component
 * @return {Subject}
 */

export default curry(function(container, rawComponent, input) {
  const dispatchStream = flyd.stream();
  const dispatch = val => dispatchStream(val);
  const cache = new WeakMap();
  const component = base(cache)(rawComponent);
  const render = createDekuApp(container, dispatch);

  flyd.on(function(ctx) {
    const el = element(component, { __ctx: ctx.get(true) });

    return render(el, ctx);
  }, input);

  return dispatchStream;
});
