import { normalize } from './utils';

export default name => function(rawComponent) {
  const component = normalize(rawComponent);

  return Object.assign({}, component, { name });
};
