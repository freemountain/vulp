import createDecorator from './../utils/createDecorator';
import check from './../utils/check';

/**
 * assert context type
 *
 * @example
 * import t from 'tcomb'
 *
 * const T = t.struct({
 *   name: t.String
 * });
 *
 * const component = checkContextType(T)(function({context}) {
 *   return <h1>{context.get('/name')}</h1>;
 * });
 *
 * @param  {Type} T - type to check context again (tcomb type)
 * @return {HOC}
 */
export default function checkContextType(T) {
  const resultCache = new WeakMap();
  const spec = {
    deep:  false,
    model: function(component, model) {
      const cacheEntry = resultCache.get(model.context);

      if(cacheEntry === true) return model;
      if(cacheEntry === false) T(model.context.get(true));

      const unboxedCtx = model.context.get(true);
      const result = check(T, unboxedCtx);

      resultCache.set(model.context, result);
      if(result === false) T(unboxedCtx);

      return model;
    }
  };
  const decorator = createDecorator(spec);

  return comp => {
    return decorator(comp);
  };
}
