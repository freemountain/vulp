import flyd from 'flyd';

import Context from './../Context';

/**
 * value scope factory
 * Scope will update and emit value on every patch action.
 * @param {Object} init - init value as plain object
 * @param {stream} input - input flyd stream
 * @return {Scope}
 */
function value(init, input) {
  let current = Context.ofState(init);
  const output = flyd.stream(current);

  flyd.on(function(patchSet) {
    if(patchSet.length === 0) return;
    current = current.update(patchSet);
    output(current);
  }, input);

  return output;
}
export default value;
