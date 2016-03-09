import dekuMemoize from 'deku-memoize';

import { normalize } from './utils';

function defaultShouldUpdate(prev, next) {
  return next.context.changed(prev.context);
}

/**
 * memoize component
 *
 * @param  {function(nextModel: Model, prevModel: Model): boolean} shouldUpdate - list of component decorators (hocs)
 * @return {HOC}
 */

export default function(shouldUpdate = defaultShouldUpdate) {
  return rawComponent => {
    const component = normalize(rawComponent);
    const decoratedComponent = Object.assign({}, component, { shouldUpdate });

    return dekuMemoize(decoratedComponent);
  };
}
