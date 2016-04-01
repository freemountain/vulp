import normalize from './../utils/normalizeComponent';

/**
 * add name to component - for debug messages
 *
 * @param  {string} nameParam - component name
 * @return {HOC}
 */
export default function name(nameParam) {
  return rawComponent => Object.assign({}, normalize(rawComponent), { name: nameParam });
}
