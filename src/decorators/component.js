import normalize from './../utils/normalizeComponent';

/**
 * decorate component
 * @param  {Array} decoration - list of component decorators
 * @param {Component} component -  the target
 * @return {Component} decorated component
 */

const f = (...decoration) => rawComponent => {
  const component = normalize(rawComponent);

  return decoration
   .slice()
   .reverse()
   .reduce((target, decorator) => decorator(target), component);
};

export default f;
