import { h, helper, decorators } from './../../fux';

const { memoize, controller, component} = decorators;
const { $rep } = helper;

export default component(
  memoize(),
  controller({
    uncheck: () => [$rep('/checked', false)],
    check:   () => [$rep('/checked', true)]
  })
)(({ context, dispatch }) => {
  const checked = context.get('/checked');

  return (<input
    type='checkbox'
    checked={checked}
    onChange={dispatch(checked ? 'uncheck' : 'check')}
  />);
});
