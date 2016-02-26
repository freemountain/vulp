import curry from './../utils/curry';
import generateSpec from './../utils/generateSpec';
import normalize from './../utils/normalizeComponent';

function assert(T, ctx, name = 'undefinedh') {
  const raw = ctx.get(true);
  let error = null;

  try {
    T(raw);
  } catch(e) {
    e.message = (`
      component decorator mount error!
      component.name: ${name}
      \n`).concat(e.message);

    error = e;
  }
  if(error) throw error;
}

function decorateHook(component, T, name) {
  if(!component[ name ]) return null;

  return function(model) {
    assert(T, model.context, component.Name);
    return component[ name ](model);
  };
}

export default T => rawComponent => {
  const component = normalize(rawComponent);
  const decorator = curry(decorateHook)(component, T);
  const spec = generateSpec(decorator);

  return Object.assign({}, component, spec);
};
