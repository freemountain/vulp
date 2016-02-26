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
 * scope stream
 * - stream representation of json data that (may) change
 * - depends on input stream
 * - inputs are PatchActions
 * - outputs are Contexts
 * - flyd stream
 * @see https://github.com/paldepind/flyd#flydstream
 * @typedef {function(patchAction: List<Patch>) } Scope
 */

/**
 * scope factory
 * - creates scope, who listen on input
 * - curried: opts -> inputStream -> scope
 * @typedef {function(options: Object, input: Scope): Scope} ScopeFactory
 */

 /**
  * scope factory with bound options
  * @typedef {function(input: Scope): Scope} ScopeFactory'
  */

export default {
  value,
  fragment,
  combiner
};
