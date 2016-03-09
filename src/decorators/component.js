import { normalize } from './utils/';

/**
 * apply multiple decorators on component
 *
 * ```javascript
 * component(
 * 	someDeoraotor(),
 * 	someOther()
 * )(model => { ... })
 * ```
 *
 * @param  {...HOC} decoration - list of component decorators (hocs)
 * @return {HOC}
 */

export default function component(...decoration) {
  return rawComponent => {
    const comp = normalize(rawComponent);

    return decoration
     .slice()
     .reverse()
     .reduce((target, decorator) => decorator(target), comp);
  };
}
