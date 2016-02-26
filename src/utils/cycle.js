import flyd from 'flyd';

/**
 * pipes a to b and b to a -> cycle a and b
 * @param  {Stream} a - flyd stream
 * @param  {Stream} b - flyd stream
 * @return {Stream} empty stream, use to end
 */

export default function cycle(a, b) {
  const start = flyd.stream();
  const streamA = a(start);
  const streamB = b(streamA);

  // flyd.on(val => console.log('a emitted:', val), streamA);
  // flyd.on(val => console.log('b emitted:', val.get(true)), streamB);

  return flyd.on(x => start(x), streamB);
}
