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
 * ```javascript
 * dispatchChangeSets()(function({ dispatch }) {
 * 		// some code...
 * 		dispatch(['/count', v => v + 1])
 * })
 * ```
 *
 * @return {HOC}
 */
export default function dispatchChangeSets() {
  return decorator;
}
