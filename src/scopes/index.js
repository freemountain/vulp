import _value from './value';
import _fragment from './fragment';
import _combiner from './combiner';
import flyd from 'flyd';

const wrapFactory = f => opts => input => f(opts, input);

const value = wrapFactory(_value);
const fragment = wrapFactory(_fragment);
const combiner = wrapFactory(_combiner);

window.flyd  = flyd;


/**
 * scope
 * - stream representation of json data that (may) change
´* - flyd stream
 * @see https://github.com/paldepind/flyd#flydstream
 * @listens {PatchSet}
 * @emits {Context}
 * @typedef {function(patchAction: PatchSet) } Scope
 */

/**
 * scope factory
 * - creates scope, who listen on input
 * - curried: opts -> input -> scope
 * @typedef {function(...opts: any) : BoundScopeFactory} ScopeFactory
 */

 /**
  * bound scope factory
  * @typedef {function(input: any) : Context} BoundScopeFactory
  */

export default {
  value,
  fragment,
  combiner
};
