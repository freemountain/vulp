import dekuMemoize from 'deku-memoize';

import normalize from './../utils/normalizeComponent';

function defaultShouldUpdate(prev, next) {
  return next.context.changed(prev.context);
}

/**
 * memoize component
 *
 * this decorator is a small wrapper around [deku-memoize](https://github.com/rstacruz/deku-memoize)
 *
 * @param  {function(Context: prev, Context: next): boolean} shouldUpdate - called before update
 * @return {HOC}
 */
export default function memoize(shouldUpdate = defaultShouldUpdate) {
  return rawComponent => {
    const component = normalize(rawComponent);
    const decoratedComponent = Object.assign({}, component, { shouldUpdate });

    return dekuMemoize(decoratedComponent);
  };
}
