import t from 'tcomb';

import { specDecorator, mapAttributes, isHandler } from './utils';


function createModel(model, controller) {
  function dispatch(name, payload) {
    if(!t.String.is(name)) return model.dispatch(name, payload);
    const target = controller[ name ];

    if(t.Nil.is(target)) throw new TypeError(`controller[${name}] is ${target}`);
    if(!t.Function.is(target)) return model.dispatch(target);
    const targetModel = Object.assign({}, model, { event: payload });
    const output = target(targetModel);

    return model.dispatch(output);
  }

  return Object.assign({}, model, { dispatch });
}

function createRender(component, model) {
  const output = component.render(model);

  return mapAttributes(output, function(prop, name) {
    if(!t.String.is(prop) || !isHandler(name)) return prop;
    return event => model.dispatch(prop, event);
  }, true);
}

/**
 * controller decorator.
 *
 * ```javascript
 * controller({
 * 	click: (model) => { ... }
 * })(({ dispatch }) => (
 * 	<input type='button' onClick={event => dispatch('click', event)} />
 * 	// or
 * 	<input type='button' onClick='click' />
 * ))
 * ```
 *
 * You can dispatch actions to handlers in your controller when you call
 * model.dispatch with the property name as first argument and an optional event as second argument.
 *
 * If the property is a function, then the function will be called with model as the only argument.
 * The model object has an additional property 'event', which contains the second argument from dispatch.
 * Otherwise the property will just be dispatched.
 *
 * @param  {Map<string, any>} controller - action map
 * @return {HOC}
 */
export default function(controller) {
  const spec = {
    deep:   false,
    cache:  new WeakMap(),
    model:  (component, model) => createModel(model, controller),
    render: (component, model) => createRender(component, model)
  };

  return specDecorator(spec);
}
