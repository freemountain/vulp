import flyd from 'flyd';
import filter from 'flyd/module/filter';
import Context from './../Context';
import value from './value';

const getFragment = () => location.hash.slice(1);

function fragmentValue(input) {
  const output = flyd.stream(getFragment());

  window.addEventListener('hashchange', function() {
    const current = getFragment();

    if(output() === current) return;
    output(current);
  });

  flyd.on(function(fragmentStr) {
    if(output() === fragmentStr) return;
    location.hash = '#'.concat(fragmentStr);
    output(fragmentStr);
  }, input);

  return output;
}

const createCtx = val => Context.ofState({ value: val });


/**
 * fragment scope factory
 * represents value of fragment identifier.
 * Json structure:
 * 	{
 * 		value: String
 *  }
 * @param {Object} opts - not used
 * @param {Scope} input - input stream
 * @return {Scope}
 */

function fragment(opts, input) {
  const filteredInput = filter(patchSet => patchSet.length !== 0, input);
  const valueStream = value({ value: getFragment() }, filteredInput);
  const fragmentInput = flyd.map(ctx => ctx.get('/value'), valueStream);
  const fragmentStream = fragmentValue(fragmentInput);
  const output = flyd.map(fragmentStr => createCtx(fragmentStr), fragmentStream);

  return output;
}

export default fragment;
