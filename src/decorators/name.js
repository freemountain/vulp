import { normalize } from './utils';

/**
 * add name to component - for debug messages
 *
 * @param  {string} name - component name
 * @return {HOC}
 */
export default function(name) {
  return rawComponent => Object.assign({}, normalize(rawComponent), { name });
}
