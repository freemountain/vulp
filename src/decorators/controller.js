import t from 'tcomb';

import JSONPointer from './../JSONPointer';

import normalizeComponent from './../utils/normalizeComponent';

import patchUtil from './../utils/patch';
import check from './../utils/checkType';

import { Patch } from './../Patch';

const JSONPatch = t.irreducible('Patch', x => check(Patch, x));
const PatchSet = t.list(JSONPatch);
const ChangeSet = t.irreducible('ChangeSet', function(x) {
  if(!t.Array.is(x) || x.length % 2 !== 0) return false;

  const pairs = x.reduce(function(current, e, i) {
    if(i % 2 === 0) current.push([]);
    current[ current.length - 1 ].push(e);

    return current;
  }, []);

  return t.list(t.tuple([t.String, t.Any])).is(pairs);
});

const normalizePatch = model => patch => {
  if(!patch.path) return patch;
  const newPatch = Object.assign({}, patch);
  const pointer = JSONPointer.ofString(patch.path);

  newPatch.path = model.context.transform.apply(pointer).toRFC();
  return newPatch;
};

function warn(msg) {
  const handler = console.warn ? x => console.warn(x) : x => console.log('Warning:', x);

  handler(msg);
}

const createChangeHandler = changeSet =>
  model => model.dispatch(patchUtil(changeSet)(null, model));

const createPatchHandler = patchSet => ({ dispatch }) => dispatch(patchSet);

const createFuncHandler = f => model => t.match(f(model.event, model, model.dispatch),
  PatchSet, patchSet => createPatchHandler(patchSet),
  ChangeSet, changeSet => createChangeHandler(changeSet),
  // function handler may return undefined or null
  t.Nil, () => () => null,
  t.Any, x => () => warn(`controller returned ${x}\nignoring...`)
)(model);

const createHandler = x => t.match(x,
  t.Function, f => createFuncHandler(f),
  PatchSet, patchSet => createPatchHandler(patchSet),
  ChangeSet, changeSet => createChangeHandler(changeSet),
);


const createDispatch = (controller, model) => function(name) {
  if(!controller[ name ]) return () => null;

  function dispatch(patchSet) {
    if(t.Nil.is(patchSet) || patchSet.length === 0) return;

    const normalizedPatchSet = patchSet.map(normalizePatch(model));

    model.dispatch(normalizedPatchSet);
  }

  return function(event) {
    const handlerModel = Object.assign({}, model, { dispatch, event });
    const handlerArg = controller[ name ];

    if(t.Nil.is(handlerArg)) throw new Error(`controller.[${name}] shall not be ${handlerArg}`);
    createHandler(handlerArg)(handlerModel);
  };
};


const controllerDecorator = controller => rawComponent => {
  const component = normalizeComponent(rawComponent);

  function render(model) {
    const dispatch = createDispatch(controller, model);
    const decoratedModel = Object.assign({}, model, { dispatch });

    return component.render(decoratedModel);
  }

  return Object.assign({}, component, { render });
};

export default controllerDecorator;
