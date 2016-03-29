// import flyd from 'flyd';


/**
 * value scope factory
 * Scope will update and emit value on every patch action.
 * @param {Object} init - init value as plain object
 * @param {stream} input - input flyd stream
 * @return {Scope}


function value(T, input) {
  const output = flyd.stream([{
    path: '/',
    value: init,
    op: 'add'
  }]);

  flyd.on(function(patchSet) {
    if(patchSet.length === 0) return;
    current = current.update(patchSet);
    output(current);
  }, input);

  return output;
}
export default value;
*/

export default () => input => input;
