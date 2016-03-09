import { specDecorator } from './utils';
import check from './../utils/checkType';

/**
 * assert context type
 *
 * ```javascript
 * import t from 'tcomb'
 *
 * checkContextType(t.struct({
 * 	someProp: t.String
 * }))(model => { ... })
 * ```
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
  const decorator = specDecorator(spec);

  return comp => {
    return decorator(comp);
  };
}
