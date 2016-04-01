import t from 'tcomb';

const Type = t.irreducible('Type', t.isType);

/**
 * 'booleanized' check function from tcomb
 * @type Function
 * @param  {Type} T - tcomb type
 * @param  {Any} x - value to check
 * @return {Boolean}
 */

export default function check(T, x) {
  let result = null;

  Type(T);

  /* eslint space-after-keywords: 0 */
  try {
    T(x);
    result = true;
  } catch(e) {
    result = false;
  }
  return result;
}
