/**
 * decorate component
 * @param  {Array} decoration - list of component decorators
 * @param {Component} component -  the target
 * @return {Component} decorated component
 */

export default function decorate(decoration, component) {
  console.log(decoration);
  return decoration
    .slice()
    .reverse()
    .reduce((target, decorator) => decorator(target), component);
}
