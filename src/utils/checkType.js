import t from 'tcomb';

/**
 * tcomb type
 * @external {Type} https://github.com/gcanti/tcomb/blob/master/docs/API.md
 */

const Type = t.irreducible('Type', t.isType);

/**
 * 'booleanized' check function from tcomb
 * @type Function
 * @param  {Type} T - tcomb type
 * @param  {Any} x - value to check
 * @return {Boolean}
 */

const check = t.func([Type, t.Any], t.Bool).of(function(T, x) {
  let result = null;

  /* eslint space-after-keywords: 0 */
  try {
    T(x);
    result = true;
  } catch(e) {
    result = false;
  }
  return result;
});

export default check;
