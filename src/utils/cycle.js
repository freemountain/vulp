import flyd from 'flyd';

/**
 * pipes a to b and b to a -> cycle a and b
 * @param  {BoundViewFactory} viewF - view factory
 * @param  {BoundScopeFactory} scopeF - scope factory
 * @return {Stream} empty stream, use to end
 */

export default function cycle(viewF, scopeF) {
  const start = flyd.stream();
  const viewStream = viewF(start);
  const scopeStream = scopeF(viewStream);

  flyd.on(val => console.log('view emitted:', val), viewStream);
  flyd.on(ctx => console.log('scope emitted:', ctx.get(true)), scopeStream);

  return flyd.on(x => start(x), scopeStream);
}
