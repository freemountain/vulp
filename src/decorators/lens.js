import t from 'tcomb';
import JSONPointer from './../JSONPointer';
import Context from './../Context';
import Immutable from 'immutable';

import createDecorator from './../utils/createDecorator';
import { get } from './../utils/state';

const assign = (target, spec) => Object.assign({}, target, spec);

let Transform = t.Any;
const TransformMap = t.dict(t.String, Transform);
const TransfromString = t.String;

Transform = t.union([TransformMap, TransfromString]);

const transformState = (transform, state) => t.match(transform,
  TransfromString, () => get(state, JSONPointer.ofString(transform)),
  TransformMap, () => Immutable.Map(transform).map(sub => transformState(sub, state))
);

const transformContext = (transform, context) => new Context({
  state: transformState(transform, context.state)
});

const transformPointer = (transform, pointer) => t.match(transform,
  TransfromString, () => JSONPointer.ofString(transform).concat(pointer),
  TransformMap, () => t.match(transform[ pointer.first() ],
    Transform, sub => transformPointer(sub, pointer.slice(1)),
    t.Nil, () => { throw new Error(`Illegal Pointer ${pointer.toRFC()}`); } // eslint-disable-line brace-style
  )
);

const parsePath     = patch => assign(patch, { path: JSONPointer.ofString(patch.path) });
const stringifyPath = patch => assign(patch, { path: patch.path.toRFC() });

const transformPath = transform => patch => assign(patch, {
  path: transformPointer(transform, patch.path)
});

const transformPatchSet = (transform, patchSet) => patchSet
  .map(parsePath)
  .map(transformPath(transform))
  .map(stringifyPath);

/**
 * transform ctx of component
 *
 * @example
 * mount({
 *   foo: '/some/value'
 *   bar: '/here/is/another/val'
 * })(component)
 *
 * @param  {Map<string, string>} transform - transform description
 * @return {HOC}
 */
export default function lens(transform) {
  Transform(transform);

  const spec = {
    deep:  true,
    cache: new WeakMap(),
    name:  'contextLens',
    model: function(component, model) {
      const context = transformContext(transform, model.context);
      const dispatch = patchSet => model.dispatch(transformPatchSet(transform, patchSet));

      return assign(model, { context, dispatch });
    }
  };

  return createDecorator(spec);
}
