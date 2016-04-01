import flyd from 'flyd';
import firstCache from './firstCache';

function log(store, view) {
  flyd.on(x => console.log('store emitted:', x), store.read);
  flyd.on(x => console.log('view emitted:', x), view.read);
}

function createHalf(initPatch, streamFactory) {
  const write = flyd.stream();
  const input = firstCache(write);

  write(initPatch);

  const read = streamFactory(input);

  return { read, write, start: input.release };
}

function connect(storeHalf, viewHalf) {
  flyd.on(x => storeHalf.write(x), viewHalf.read);
  flyd.on(x => viewHalf.write(x), storeHalf.read);
}

function start(store, view) {
  store.start();
  setTimeout(() => view.start(), 0);
}

/**
 * pipes a to b and b to a -> cycle a and b
 * @param  {HOF} viewF - view factory
 * @param  {HOF} scopeF - scope factory
 * @return {Stream} empty stream, use to end
 */

export default function cycle(storeF, viewF, init = {}) {
  const initialPatch = [{
    op:    'add',
    path:  '',
    value: init
  }];

  const view = createHalf(initialPatch, viewF);
  const store = createHalf(initialPatch, storeF);

  connect(store, view);
  log(store, view);
  start(store, view);
}
