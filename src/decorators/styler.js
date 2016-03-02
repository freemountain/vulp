import inflection from 'inflection';
import { vnode as element } from 'deku';

import { specDecorator } from './utils';

const { isText, isEmpty }  = element;
const toDash = x => inflection.underscore(x).split('_').join('-');

function decorateChildren(vnode) {
  if(isText(vnode) || isEmpty(vnode) || !vnode.children) return vnode;
  const children = vnode.children.map(child => decorateVnode(child));

  return Object.assign({}, vnode, { children });
}

function decorateVnode(vnode) {
  if(isText(vnode) || isEmpty(vnode)) return vnode;

  const decoratedNode = decorateChildren(vnode);

  if(!vnode.attributes || !vnode.attributes.style)
    return decoratedNode;

  const rule = Object.keys(vnode.attributes.style)
    .map(key => `${toDash(key)}:${vnode.attributes.style[ key ]};`)
    .join('');

  const attributes = Object.assign({}, decoratedNode.attributes, { style: rule });

  return Object.assign({}, decoratedNode, { attributes });
}

const spec = {
  deep:   false,
  cache:  null,
  render: function(component, model) {
    const vnode = component.render(model);

    return decorateVnode(vnode);
  }
};

const decorator = specDecorator(spec);

export default () => decorator;
