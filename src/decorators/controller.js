import t from 'tcomb';
import mapObj from '@f/map-obj';
import ev from '@f/event-handler';
import { vnode as element } from 'deku';

import createDecorator from './../utils/createDecorator';
import check from './../utils/check';

const { isThunk, isText, isEmpty }  = element;

const isHandler = name => (
  name.length > 2 &&
  name.slice(0, 2) === 'on' &&
  name[ 2 ] === name[ 2 ].toUpperCase()
);

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

function reduceCtrlEvent(model, handler, event, result) {
  const handlerList = t.Array.is(event.handler) ? event.handler : [event.handler];
  const handlerModel = createHandlerModel(model, event.event);

  handlerList
    .forEach(name => t.match(handler[ name ],
      t.Nil, () => error(`handler[${name}] is nil`),
      t.Function, f => reduceEvent(model, handler, f(handlerModel), result),
      t.Any, e => result.push(e)
    ));
}

function reduceEvent(model, handler, event, result) {
  t.match(event,
    t.Nil, () => null,
    ControllerEventT, () => reduceCtrlEvent(model, handler, event, result),
    t.Any, () => result.push(event)
  );
}

const dispatch = (model, handler) => event => {
  const result = [];

  reduceEvent(model, handler, event, result);
  result.forEach(e => model.dispatch(e));
};

function createModel(model, handler) {
  return Object.assign({}, model, { dispatch: dispatch(model, handler) });
}

function mapAttributes(node, f, deep = false) {
  if(isText(node) || isEmpty(node)) return node;
  const name = isThunk(node) ? 'props' : 'attributes';
  const spec = {};

  spec[ name ] = mapObj(f, node[ name ]);
  if(deep) spec.children = node.children.map(child => mapAttributes(child, f, deep));

  return Object.assign({}, node, spec);
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
 * controller decorator
 *
 * You can dispatch actions to handlers in your controller when you call
 * model.dispatch with the property name as first argument and an optional event as second argument.
 *
 * If the property is a function, then the function will be called with model as the only argument.
 * The model object has an additional property 'event', which contains the second argument from dispatch.
 * Otherwise the property will just be dispatched.
 *
 * @example
 * controller({
 *   click: (model) => { ... }
 * })(function({ dispatch }) {
 *   return (<div>
 *     <input type='button' onClick='click' /> // or
 *     <input type='button' onClick={event => dispatch('click', event)} />
 *   <div>);
 * });
 *
 * @type {decorator}
 * @param  {Map<string, any>} handler - action map
 * @return {HOC}
 */
function controller(handler) {
  const spec = {
    deep:   false,
    cache:  new WeakMap(),
    model:  (component, model) => createModel(model, handler),
    render: (component, model) => createRender(component, model)
  };

  return createDecorator(spec);
}

controller.keyHandler = keyHandler;

export default controller;
