import t from 'tcomb';

import patchUtil from './../utils/patch';

import { specDecorator } from './utils';

const ChangeSet = t.irreducible('ChangeSet', function(x) {
  if(!t.Array.is(x) || x.length % 2 !== 0) return false;

  const pairs = x.reduce(function(current, e, i) {
    if(i % 2 === 0) current.push([]);
    current[ current.length - 1 ].push(e);

    return current;
  }, []);

  return t.list(t.tuple([t.String, t.Any])).is(pairs);
});

function toPairs(changeSet) {
  return changeSet.reduce(function(current, e, i) {
    if(i % 2 === 0) current.push([]);
    current[ current.length - 1 ].push(e);

    return current;
  }, []);
}
const dispatch = model => payload => {
  model.dispatch(t.match(payload,
    ChangeSet, changeSet => patchUtil(model.context, toPairs(changeSet)),
    t.Any, x => x
  ));
};

const spec = {
  deep:  false,
  cache: null,
  name:  'dispatchChangeSets',
  model: (component, model) => {
    const decorated = Object.assign({}, model, {
      dispatch: pay => {
        dispatch(model)(pay);
      }
    });

    return decorated;
  }
};

const decorator = specDecorator(spec);

/**
 * dispatch change sets
 *
 * Usage:
 * ```javascript
 * dispatchChangeSets()(function({ dispatch }) {
 * 		// some code...
 * 		dispatch(['/count', v => v + 1])
 * })
 * ```
 *
 * A change set is an array of strings on even positions and some values on odd positions.
 * The strings acts as path selector on the context object and the next element as value for the previous path.
 * If the value element is a function, this function will be called with the value in the given path as argument.
 * If the path string ends with '-' the operator in the resulting patch will be 'add' ([info](http://jsonpatch.com/#json-pointer)).
 *
 * Example:
 * ```javascript
 * const changeSet = [
 * 	'/foo/bar' : 42,
 * 	'/someNumber' : n => n + 3,
 * 	'/someList/-' : {name: 'baz'}
 * ];
 * ```
 * The function will be called with `n = model.context.get('/someNumber')`.
 * The resulting patch set with `n = 4`:
 * ```javascript
 * const patchSet = [
 * 	{
 * 		op: 'replace',
 * 		path: '/foo/bar',
 * 		value: 42
 * 	},
 * 	{
 * 		op: 'replace',
 * 		path: '/someNumber',
 * 		value: 7
 * 	},
 * 	{
 * 		op: 'add',
 * 		path: '/someList/-',
 * 		value: { name: 'baz' }
 * 	}
 * ];
 * ```
 *
 * @return {HOC}
 */
export default function dispatchChangeSets() {
  return decorator;
}
