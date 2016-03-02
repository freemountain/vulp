import { h, decorators } from './../../fux';

const { memoize, controller, component} = decorators;

export default component(
  memoize(),
  controller({
    uncheck: ['/checked', false],
    check:   ['/checked', true]
  })
)(({ context, dispatch }) => {
  const checked = context.get('/checked');

  return (<input
    type='checkbox'
    checked={checked}
    onChange={dispatch(checked ? 'uncheck' : 'check')}
  />);
});
