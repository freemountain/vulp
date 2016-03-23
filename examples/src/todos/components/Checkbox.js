import t from 'tcomb';
import { element, decorators } from './../../vulp';

const { memoize, controller, component, dispatchChangeSets, name, contextType } = decorators;

export default component(
  memoize(),
  contextType(t.struct({
    checked: t.Boolean
  })),
  dispatchChangeSets(),
  controller({
    uncheck: ['/checked', false],
    check:   ['/checked', true]
  }),
  name('Checkbox'),
)(function({ context }) {
  const checked = context.get('/checked');
  const handler = checked ? 'uncheck' : 'check';

  return (<input type='checkbox' checked={checked} onChange={handler} />);
});
