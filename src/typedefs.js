/**
 * Higher Order Component
 *
 * An Higher Order Component is a function, which mapps a component on to another component.
 * Most of the time, they add behaviour to an actual component
 * HOC´s are returned from decorator functions.
 * @typedef {function(component: Component): Component} HOC
 */

/**
 * Type
 *
 * any type created with [tcomb](https://github.com/gcanti/tcomb)
 * @see https://github.com/gcanti/tcomb/blob/master/docs/API.md
 * @typedef {function(x: any): any} Type
 */

/**
 * Stream
 *
 * As there is no 'native' stream implementation in JavaScript for now,
 * [flyd](https://github.com/gcanti/tcomb) is used as stream library.
 * @see https://github.com/paldepind/flyd
 * @typedef {function(x: any): any} Stream
 */

/**
 * A [stream](https://github.com/paldepind/flyd) who emits PatchSets.
 *
 * Fragments are the building blocks of this library, they represents a JSON value that may change over time.
 * Fragments are functions, you can call them without an argument to get the last value (PatchSet).
 * @extends {Stream}
 * @typedef {Function} Fragment
 */

/**
 * Higher Order Fragment
 * @typedef {function(input: Fragment): Fragment} HOF
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
 * @see http://dekujs.github.io/deku/docs/basics/components.html#model
 * @typedef {Object} model
 * @property {Map<string, any>} model.props
 * @property {string} model.path - unique path to the component
 * @property {Context} model.context
 * @property {Array<vnode>} model.children
 */
