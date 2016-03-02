import { specDecorator } from './utils';

function assert(T, ctx, name = 'undefined') {
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

export default function(T) {
  const spec = {
    deep:  false,
    cache: null,
    model: function(component, model) {
      assert(T, model.context, component.Name);

      return model;
    }
  };

  return specDecorator(spec);
}
