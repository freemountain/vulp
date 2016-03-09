import mount from './mount';
import controller from './controller';
import memoize from './memoize';
import styler from './styler';
import checkContextType from './checkContextType';
import component from './component';
import name from './name';
import dispatchChangeSets from './dispatchChangeSets';
import logLifecycle from './log';

/**
 * Higher Order Component
 * @typedef {function(component: Component): Component} HOC
 */

export default {
  name,
  component,
  mount,
  controller,
  memoize,
  styler,
  checkContextType,
  dispatchChangeSets,
  logLifecycle
};
