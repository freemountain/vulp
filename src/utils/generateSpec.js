import t from 'tcomb';

/**
 * generate update spec for component hooks
 * @param  {function} decorator - decorator is applied on all targets
 * @param  {Array} targets - targets for decorator
 * @return {Component}
 */

export default function generateSpec(decorator, targets = ['onCreate', 'onUpdate', 'render', 'onRemove']) {
  const spec = {};

  targets.forEach(function(target) {
    const result = decorator(target);

    if(t.Nil.is(result)) return;

    spec[ target ] = result;
  });

  return spec;
}
