import pick from '@f/pick';
import mapObj from '@f/map-obj';
import t from 'tcomb';

export function normalize(component) {
  if(t.Function.is(component)) return { render: component };

  if(t.Object.is(component) && t.Function.is(component.render))
    return component;

  throw new TypeError('component must be function or object with render function');
}

const defaultOpts = {
  deep:     false,
  cache:    null,
  model:    (component, model) => model,
  render:   (component, model) => component.render(model),
  onCreate: (component, model) => component.onCreate ? component.onCreate(model) : null,
  onUpdate: (component, model) => component.onUpdate ? component.onUpdate(model) : null,
  onRemove: (component, model) => component.onRemove ? component.onRemove(model) : null
};

function applySpec(spec, rawComponent) {
  const cacheEntry = spec.cache ? spec.cache.get(rawComponent) : null;

  if(cacheEntry) return cacheEntry;
  const component = normalize(rawComponent);
  const handlers = pick(['onCreate', 'onUpdate', 'onRemove', 'render'], spec);
  let handlerSpec = mapObj(handler => model => handler(component, spec.model(component, model)), handlers);

  if(spec.deep) handlerSpec = Object.assign({}, handlerSpec, {
    render: function(model) {
      const node = handlers.render(component, model);
      const decoratedNode = decorateChildren(spec, node);

      return decoratedNode;
    }
  });

  const decorated =  Object.assign({}, component, handlerSpec);

  if(spec.cache) spec.cache.set(rawComponent, decorated);
  return decorated;
}


function decorateChildren(spec, node) {
  if(!node.children) return node;
  const cacheEntry = spec.cache ? spec.cache.get(node) : null;

  if(cacheEntry) return cacheEntry;
  const children = node.children.map(function(child) {
    if(child.type !== '#thunk') return child;

    return Object.assign({}, child, { component: applySpec(spec, child.component) });
  });
  const decoratedNode = Object.assign({}, node, { children });

  if(spec.cache) spec.cache.set(node, decoratedNode);
  return decoratedNode;
}


export function specDecorator(options) {
  const cache = options.deep && !options.cache ? new WeakMap() : options.cache;
  const spec = Object.assign({}, defaultOpts, options, { cache });

  return function(component) {
    const decorated = applySpec(spec, component);

    return decorated;
  };
}
