
/**
 * value fragment factory
 *
 * created fragment returns every input.
 *
 * @example
 * import flyd from 'flyd';
 * import vulp from 'vulp';
 *
 * const patch = { op: 'add', path: '', value: 0};
 * const input = flyd.stream();
 * const val = vulp.fragments.value()(input);
 *
 * flyd.on(x => console.log(x), val);
 *
 * input([patch]);
 * // console -> [{ op: 'add', path: '', value: 0}]
 *
 * input([Object.assign(patch, { value: 1 })]);
 * // console -> [{ op: 'add', path: '', value: 0}]
 *
 * @return {BoundFragmentFactory}
 */
export default function value() {
  return input => input;
}
