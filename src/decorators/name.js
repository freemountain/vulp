import { normalize } from './utils';

/**
 * add name to component - for debug messages
 *
 * @param  {string} name - component name
 * @return {HOC}
 */
export default name => function(rawComponent) {
  const component = normalize(rawComponent);

  return Object.assign({}, component, { name });
};
