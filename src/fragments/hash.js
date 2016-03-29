import flyd from 'flyd';
import filter from 'flyd/module/filter';

const getFragment = () => location.hash.slice(1);

function skip(n, input) {
  let count = -1;

  return flyd.combine((i, out) => {
    count = count + 1;
    if(count < n) return;
    out(i());
  }, [input]);
}

function fragmentValue(input) {
  const inital = getFragment();
  const output = flyd.stream(inital);

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

  setTimeout(() => output(inital), 1);

  return output;
}

const last = list => list[ list.length - 1 ];

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

const fragment = () => function(input) {
  const filteredInput = filter(patchSet => patchSet.length !== 0, skip(1, input));
  const mappedInput = flyd.map(ps => last(ps).value, filteredInput);
  const fragmentStream = fragmentValue(mappedInput);
  const output = flyd.map(fragmentStr => [{ op: 'add', path: '', value: fragmentStr }], fragmentStream);

  return output;
};

export default fragment;
