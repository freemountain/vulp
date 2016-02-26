import dekuMemoize from 'deku-memoize';

import normalize from './../utils/normalizeComponent';

function defaultShouldUpdate(prev, next) {
  return next.context.changed(prev.context);
}

export default (shouldUpdate = defaultShouldUpdate) => rawComponent => {
  const component = normalize(rawComponent);
  const decoratedComponent = Object.assign({}, component, { shouldUpdate });

  return dekuMemoize(decoratedComponent);
};
