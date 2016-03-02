import curry from './../utils/curry';
import { normalize } from './utils';
import { vnode as element } from 'deku';
import Transform from './../Transform';

const { isThunk, isText, isEmpty }  = element;

import generateSpec from './../utils/generateSpec';

function decorateHook(targets, targetComponent, hookName) {
  if(!targetComponent[ hookName ]) return null;

  return function(model) {
    const context = model.context.sub(targets);
    const decoratedModel = Object.assign({}, model, { context });

    targetComponent[ hookName ](decoratedModel);
  };
}

function decorateChildren(cache, targets, vnode) {
  return (vnode.children || []).map(child => decorateNode(cache, child, targets));
}

function decorateNode(cache, vnode, targets) {
  if(isText(vnode) || isEmpty(vnode)) return vnode;

  const children = decorateChildren(cache, targets, vnode);
  const decoratedVnode = Object.assign({}, vnode, { children });

  if(!isThunk(vnode)) return decoratedVnode;

  let cacheEntry = cache.get(vnode.component);

  if(!cacheEntry) cacheEntry = mount(targets, vnode.component);
  cache.set(vnode.component, cacheEntry);

  return Object.assign({}, decoratedVnode, { component: cacheEntry });
}

function mount(targets, rawComponent) {
  const component = normalize(rawComponent);
  const cache = new WeakMap();
  const transform = Transform.ofTargets(targets);

  function render(model) {
    const context = model.context.sub(transform);
    const decoratedModel = Object.assign({}, model, { context });
    const vnode = component.render(decoratedModel);

    const output = decorateNode(cache, vnode, targets);

    return output;
  }

  const decorator = curry(decorateHook)(targets, component);
  const spec = generateSpec(decorator);

  spec.render = render;
  return Object.assign({}, component, spec);
}

export default mount;
