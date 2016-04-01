import normalize from './../utils/normalizeComponent';

/**
 * apply multiple decorators on component
 *
 * @example
 * const myComponent = component(
 * 	someDeoraotor(),
 * 	someOther()
 * )(model => { ... });
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
