import pick from '@f/pick';
import mapObj from '@f/map-obj';
import t from 'tcomb';
import { vnode as element } from 'deku';

const { isThunk, isText, isEmpty }  = element;


export function normalize(comp) {
  const component = t.Function.is(comp) ? { render: comp } : comp;

  if(!t.Object.is(component) && !t.Function.is(component.render))
    throw new TypeError('component must be function or object with render function');

  if(!component.name && component.render.name !== '') component.name = component.render.name;
  return component;
}

export function mapAttributes(node, f, deep = false) {
  if(isText(node) || isEmpty(node)) return node;
  const name = isThunk(node) ? 'props' : 'attributes';
  const spec = {};

  spec[ name ] = mapObj(f, node[ name ]);
  if(deep) spec.children = node.children.map(child => mapAttributes(child, f, deep));

  return Object.assign({}, node, spec);
}

export const isHandler = name => (
  name.length > 2 &&
  name.slice(0, 2) === 'on' &&
  name[ 2 ] === name[ 2 ].toUpperCase()
);

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
  const hooks = pick(['onCreate', 'onUpdate', 'onRemove'], spec);
  const componentSpec = mapObj(hook => model => hook(component, spec.model(component, model)), hooks);

  componentSpec.render = function(model) {
    const decoratedModel = spec.model(component, model);
    const node = spec.render(component, decoratedModel);

    return spec.deep ? decorateNode(spec, node) : node;
  };

  const decorated =  Object.assign({}, component, componentSpec);

  if(spec.cache) spec.cache.set(rawComponent, decorated);
  return decorated;
}

function decorateNode(spec, node) {
  const nodeSpec = {};

  if(isThunk(node)) nodeSpec.component = applySpec(spec, node.component);
  if(!t.Nil.is(node.children)) nodeSpec.children = node.children.map(child => decorateNode(spec, child));

  return Object.assign({}, node, nodeSpec);
}

export function specDecorator(options) {
  const cache = options.deep && !options.cache ? new WeakMap() : options.cache;
  const spec = Object.assign({}, defaultOpts, options, { cache });

  return function(component) {
    const decorated = applySpec(spec, component);

    return decorated;
  };
}
