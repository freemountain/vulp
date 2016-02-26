import { element } from 'deku';
import rawDecorators from './decorators';
import scopes from './scopes';
import curry from './utils/curry.js';
import { $rep, $add } from './Patch';

import createRenderSubject from './utils/createRenderSubject';
import decorateComponent from './utils/decorateComponent';
import choke from './utils/choke';
import cycle from './utils/cycle';
import patch from './utils/patch';
import mapObj from '@f/map-obj';
import dom from './views/dom';

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

/**
 * @see https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/subjects.md
 * @typedef {Object} Subject
 * @property {function} Subject.subscribe
 * @property {function(val: any)} Subject.onNext

 */

/**
 * curried decorators
 * @private
 */

const decorators = mapObj(decorator => curry(decorator), rawDecorators);

/**
 * curried decorateComponent
 * @private
 */

const decorate = decorateComponent;

/**
 * exported helper
 * @private
 */

const helper = {
  $rep,
  $add,
  choke,
  cycle,
  patch
};

const views = {
  dom
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
  decorate,
  helper,
  createRenderSubject,
  h
};
