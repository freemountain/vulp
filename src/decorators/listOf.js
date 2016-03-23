import { element } from 'deku';

import lens from './lens';

const createListComponent = (cache, comp) => function({ context, props }) {
  const filter = props.filter || (() => true);
  const children = context.get()
    .map((_, i) => i)
    .filter(i => filter(context.get(`/${i}`, true)))
    .map(function(index) {
      const prefix = `/${index}`;

      if(!cache[ prefix ]) cache[ prefix ] = lens(prefix)(comp);
      return element('li', {}, [
        element(cache[ prefix ], { key: index })
      ]);
    })
    .toJS();

  return element('ul', {}, children);
};

export default function() {
  const cache = {};

  return component => createListComponent(cache, component);
}
