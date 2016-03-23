import t from 'tcomb';

import { element, decorators } from './../../vulp';
import _Checkbox from './Checkbox';

const { memoize, component, name, contextType, lens } = decorators;
const Checkbox = lens({ checked: '/completed' })(_Checkbox);

export default component(
  memoize(),
  contextType(t.struct({
    title:     t.String,
    completed: t.Boolean
  })),
  name('Todo')
)(function({ context }) {
  const title = context.get('/title');

  return (
    <div>
      <Checkbox /> {title}
    </div>
  );
});
