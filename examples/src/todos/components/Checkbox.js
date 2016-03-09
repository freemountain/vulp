import { h, decorators } from './../../fux';

const { memoize, controller, component, dispatchChangeSets, name } = decorators;

export default component(
  memoize(),
  dispatchChangeSets(),
  controller({
    uncheck: ['/checked', false],
    check:   ['/checked', true]
  }),
  name('Checkbox'),
)(({ context }) => {
  const checked = context.get('/checked');

  return (<input
    type='checkbox'
    checked={checked}
    onChange={checked ? 'uncheck' : 'check'}
  />);
});
