import t from 'tcomb';

/**
 * normalize component
 *
 * @private
 * @param {Component} comp - the component
 * @return {Component}
 */
export default function normalizeComponent(comp) {
  const component = t.Function.is(comp) ? { render: comp } : comp;

  if(!t.Object.is(component) && !t.Function.is(component.render))
    throw new TypeError('component must be function or object with render function');

  if(!component.name && component.render.name !== '') component.name = component.render.name;
  return component;
}
