import dom from './dom';

/**
 * view
 * - view stream representation
 * - views listen on contexts and render them in some way (e.g. dom)
 * - a view can emit patchSets
´* - flyd stream
 * @see https://github.com/paldepind/flyd#flydstream
 * @listens {Context}
 * @emits {PatchSet}
 * @typedef View
 */

/**
 * view factory
 * - creates view, who listen on scops
 * - curried: opts -> input -> view
 * @typedef {function(...opts: any) : BoundViewFactory} ViewFactory
 */

/**
 * bound view factory
 * @typedef {function(input: any) : View} BoundViewFactory
 */

export default {
  dom
};
