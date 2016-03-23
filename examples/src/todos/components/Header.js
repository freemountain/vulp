import t from 'tcomb';
import { element, decorators } from './../../vulp';

const { controller, component, dispatchChangeSets, name, memoize, contextType } = decorators;

export default component(
  memoize(),
  contextType(t.struct({
    draft: t.String,
    todos: t.Array
  })),
  dispatchChangeSets(),
  controller({
    key: controller.keyHandler(['update', {
      enter: ['save', 'clear'],
      esc:   'clear'
    }]),
    update: ({ event }) => ['/draft', event.target.value],
    clear:  ({ event }) => {
      event.target.value = '';
      return ['/draft', ''];
    },
    save: ({ event }) => [
      '/draft', '',
      '/todos/-', { completed: false, title: event.target.value }
    ]
  }),
  name('Header')
)(function({ context }) {
  const draft = context.get('/draft');

  return (<input onKeyUp='key' value={draft} type='text' />);
});
