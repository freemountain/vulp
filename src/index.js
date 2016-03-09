import { element } from 'deku';

import decorators from './decorators';
import scopes from './scopes';
import views from './views';

import cycle from './utils/cycle';

/**
 * @see http://dekujs.github.io/deku/docs/basics/components.html#model
 * @typedef {Object} model
 * @property {Map<string, any>} model.props
 * @property {string} model.path - unique path to the component
 * @property {Context} model.context
 * @property {Array<vnode>} model.children
 */

/**
 * @see http://dekujs.github.io/deku/docs/basics/components.html
 * @typedef {Object} Component
 * @property {function(model: model): vnode} Component.render
 * @property {function(model: model)} Component.onCreate
 * @property {function(model: model)} Component.onUpdate
 * @property {function(model: model)} Component.onRemove
 */

/**
 * @see http://dekujs.github.io/deku/docs/basics/elements.html
 * @typedef {Object} vnode
 * @property {string|Component} vnode.type
 * @property {Map<string, any>} vnode.attributes
 * @property {Array<vnode>} vnode.children
 */

const helper = {
  cycle
};


/**
 * jsx compatible element function.
 * @external {h} http://dekujs.github.io/deku/docs/api/element.html
 */

const h = element;

export {
  scopes,
  views,
  decorators,
  helper,
  h
};
