import { element } from 'deku';

import lens from './lens';
import normalize from './../utils/normalizeComponent';

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

/**
 * create list of component
 *
 * If you throw a component that expect a context of type `T` in the listOf decorator, the returned
 * component expect a context of `t.list(T)`. You can pass a filter function as prop.
 *
 * @example
 * const PhoneBook = listOf(function Item(context) {
 *   const name = context.get('/name');
 *   const number = context.get('/number');
 *
 * 	 return (<div>name, number</div>);
 * });
 *
 * // the rendered html will look like:
 * // <ul>
 * //   <li><div>Donald, 01213324243</div></li>
 * //   <li><div>Daisy, 0234345356</div></li>
 * // </ul>
 *
 * @return {HOC}
 */
export default function listOf() {
  const cache = {};

  return component => createListComponent(cache, normalize(component));
}
