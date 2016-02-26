import t from 'tcomb';

export default function normalize(component) {
  if(t.Function.is(component)) return { render: component };

  if(t.Object.is(component) && t.Function.is(component.render))
    return component;

  throw new TypeError('component must be function or object with render function');
}
