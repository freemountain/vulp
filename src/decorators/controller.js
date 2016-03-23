import t from 'tcomb';
import mapObj from '@f/map-obj';
import ev from '@f/event-handler';

import { specDecorator, mapAttributes, isHandler } from './utils';
import check from './../utils/checkType.js';

function error(msg) {
  throw new Error(msg);
}

const ControllerEvent = t.struct({
  handler: t.union([t.String, t.list(t.String)]),
  event:   t.maybe(t.Any)
});

const ControllerEventT = t.refinement(t.Object, x => check(ControllerEvent, x));

function createHandlerModel(model, event) {
  const copy = Object.assign({}, model, { event });

  delete copy.dispatch;
  return copy;
}

function reduceCtrlEvent(model, controller, event, result) {
  const handlerList = t.Array.is(event.handler) ? event.handler : [event.handler];
  const handlerModel = createHandlerModel(model, event.event);

  handlerList
    .forEach(name => t.match(controller[ name ],
      t.Nil, () => error(`controller[${name}] is nil`),
      t.Function, handler => reduceEvent(model, controller, handler(handlerModel), result),
      t.Any, e => result.push(e)
    ));
}

function reduceEvent(model, controller, event, result) {
  t.match(event,
    t.Nil, () => null,
    ControllerEventT, () => reduceCtrlEvent(model, controller, event, result),
    t.Any, () => result.push(event)
  );
}

const dispatch = (model, controller) => event => {
  const result = [];

  reduceEvent(model, controller, event, result);
  result.forEach(e => model.dispatch(e));
};

function createModel(model, controller) {
  return Object.assign({}, model, { dispatch: dispatch(model, controller) });
}

function createRender(component, model) {
  const output = component.render(model);

  return mapAttributes(output, function(prop, name) {
    if(!t.String.is(prop) || !isHandler(name)) return prop;
    return event => model.dispatch({
      handler: [prop],
      event
    });
  }, true);
}

const parseKeySpec = names => spec => t.match(spec,
  t.String, () => () => names.push(spec),
  t.Array, () => spec.map(parseKeySpec(names)),
  t.Object, () => mapObj(parseKeySpec(names), spec)
);

const keyHandler = spec => ({ event }) => {
  const names = [];
  const handler = parseKeySpec(names)(spec);

  ev(handler)(event);

  return {
    handler: names,
    event
  };
};

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
function controllerDecorator(controller) {
  const spec = {
    deep:   false,
    cache:  new WeakMap(),
    model:  (component, model) => createModel(model, controller),
    render: (component, model) => createRender(component, model)
  };

  return specDecorator(spec);
}

controllerDecorator.keyHandler = keyHandler;

export default controllerDecorator;
