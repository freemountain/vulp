import pick from '@f/pick';

import { specDecorator } from './utils';

const nameCache = new WeakMap();

function componentName(component) {
  if(component.name) return component.name;
  const cacheEntry = nameCache.get(component);

  if(cacheEntry) return cacheEntry;
  const body =  Object.keys(component)
    .map(key => [key, `${component[ key ]}`])
    .map(([key, value]) => `  ${key}: ${value.split('\n')[ 0 ]}...`)
    .join('\n');
  const name =  `Component#{\n${body}\n}`;

  nameCache.set(component, name);
  return name;
}

const createHandler = name => (component, model) => {
  const handler = component[ name.slice(2).toLowerCase() ];

  return () => handler ? handler(model) : null;
};

const targetHandler = {
  render: function(component, model) {
    console.log('render', componentName(component));
    return component.render(model);
  },
  onUpdate: createHandler('onUpdate'),
  onCreate: createHandler('onCreate'),
  onRemove: createHandler('onRemove')
};

const defaultTargets = ['render', 'onUpdate', 'onCreate', 'onRemove'];

/**
 * log component lifecycle
 *
 * @return {HOC}
 */

export default function log(targets = defaultTargets) {
  const opts = {
    deep:  false,
    name:  'log',
    cache: new WeakMap()
  };
  const spec = Object.assign({}, pick(targets, targetHandler), opts);

  return specDecorator(spec);
}
