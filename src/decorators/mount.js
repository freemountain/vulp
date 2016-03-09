import { specDecorator } from './utils';
import Transform from './../Transform';
import JSONPointer from './../JSONPointer';
import Immutable from 'immutable';
import { get } from './../state';
import Context from './../Context';

const parsePath = patch => Object.assign({}, patch, { path: JSONPointer.ofString(patch.path) });
const transformPath = transform => patch => Object.assign({}, patch, { path: transform.apply(patch.path) });
const stringifyPath = patch => Object.assign({}, patch, { path: patch.path.toRFC() });

const createDispatch = (transform, dispatch) => rawPatchSet => {
  const patchSet = rawPatchSet
    .map(parsePath)
    .map(transformPath(transform))
    .map(stringifyPath);

  if(patchSet.length === 0) return;
  dispatch(patchSet);
};

function applyTransform(transform, ctx) {
  const state = Immutable.Map(transform.map)
    .map(pointer => get(ctx.state, pointer));

  return new Context({ state });
}

/**
 * transform ctx of component
 *
 * ```javascript
 * mount({
 * 	foo: '/some/value'
 * 	bar: '/here/is/another/val'
 * })(component)
 * ```
 *
 * @param  {Map<string, string>} targets - transform description
 * @return {HOC}
 */
export default function(targets) {
  const transform = Transform.ofTargets(targets);

  const spec = {
    deep:  true,
    cache: new WeakMap(),
    name:  'mount',
    model: function(component, model) {
      const context = applyTransform(transform, model.context);
      const dispatch = createDispatch(transform, model.dispatch);

      return Object.assign({}, model, { context, dispatch });
    }
  };

  return specDecorator(spec);
}
