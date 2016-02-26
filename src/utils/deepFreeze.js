/**
 * deep freeze of Arrays and Objects
 * @param  {object} val - will be deeply freezed
 * @return {object} freezed val
 */

export default function deepFreeze(val) {
  // Reminder: typeof [1,2] -> 'object'
  if(typeof val !== 'object') return val;

  const propNames = Object.getOwnPropertyNames(val);

  propNames.forEach(name => deepFreeze(val[ name ]));

  return Object.freeze(val);
}
