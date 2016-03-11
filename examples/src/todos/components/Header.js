import { element, decorators } from './../../fux';

const { controller, component, dispatchChangeSets, name, memoize } = decorators;

function key({ event }) {
  // keyCode 27 => ESCAPE
  if(event.keyCode === 27) return ['/draft', ''];

  // keyCode 13 => Enter
  if(event.keyCode === 13) {
    const title = event.target.value;

    event.target.value = '';
    return [
      '/draft', '',
      '/todos/-', { completed: false, title }
    ];
  }

  return ['/draft', event.target.value];
}

export default component(
  memoize(),
  dispatchChangeSets(),
  controller({ key }),
  name('Header')
)(({ context }) => (
  <div>
    <input
      onKeyUp = 'key'
      value = {context.get('/draft')}
      type = 'text'
    />
  </div>
));
