import Immutable from 'immutable';
import t from 'tcomb';
import flyd from 'flyd';

import zipObj from '@f/zip-obj';
import curry from './../utils/curry';

import Context from './../Context';
import JSONPointer from './../JSONPointer';

const slicePath     = patch => Object.assign({}, patch, { path: patch.path.slice(1) });
const stringifyPath = patch => Object.assign({}, patch, { path: patch.path.toRFC() });
const parsePath     = patch => Object.assign({}, patch, { path: JSONPointer.ofString(patch.path) });

const filterPatchSet = curry((name, patchSet) => patchSet
  .map(parsePath)
  .filter(patch => patch.path.first() === name)
  .map(slicePath)
  .map(stringifyPath));

function readCtx(names, stores) {
  const values = stores.map(store => store());
  const stateMap = zipObj(names, values.map(ctx => ctx.state));
  const typeMap = zipObj(names, values.map(ctx => ctx.type));

  return new Context({
    state: Immutable.Map(stateMap),
    type:  t.struct(typeMap)
  });
}

function createCombine(keys) {
  return function(...args) {
    return readCtx(keys, args.slice(0, 2));
  };
}


/**
 * combiner scope factory
 * represents map of (sub)scopes.
 * @param {Map<string, ScopeFactory'>} scopeMap - the routing map
 * @param {Stream} input - input stream
 * @return {Scope}
 */

export default function combiner(scopeMap, input) {
  const names = Object.keys(scopeMap);
  const factories = names.map(name => scopeMap[ name ]);
  const inputs = names.map(name => flyd.map(function(rawPatchSet) {
    const patchSet = filterPatchSet(name, rawPatchSet);

    return patchSet;
  }, input));
  const stores = factories.map((f, i) => f(inputs[ i ]));
  const combineStreams = createCombine(names);

  return flyd.combine(combineStreams, stores);
}
