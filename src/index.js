
import { element } from 'deku';

import decorators from './decorators';
import fragments from './fragments';
import cycle from './utils/cycle';


/**
 * jsx compatible element function.
 * @typedef {function} element
 * @see http://dekujs.github.io/deku/docs/api/element.html
 */

/**
 * the model
 * @see http://dekujs.github.io/deku/docs/basics/components.html#model
 * @typedef {{ props: Map<string, any>, path: string, context: Context, children: Array<vnode>}} Model
 */

/**
 * @see http://dekujs.github.io/deku/docs/basics/components.html
 * @typedef {{
 *   render: function(model: Model): vnode,
 *   onCreate: function(model: Model),
 *   onUpdate: function(model: Model),
 *   onRemove: function(model: Model)
 * }} Component
 */

/**
 * @see http://dekujs.github.io/deku/docs/basics/elements.html
 * @typedef {Object} vnode
 * @property {string|Component} vnode.type
 * @property {Map<string, any>} vnode.attributes
 * @property {Array<vnode>} vnode.children
 */


export {
  decorators,
  fragments,
  cycle,
  element
};
