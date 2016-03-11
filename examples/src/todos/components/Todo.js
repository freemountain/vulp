import { element, decorators } from './../../fux';
import _Checkbox from './Checkbox';

const { memoize, component, name } = decorators;
const Checkbox = decorators.mount({ checked: '/completed' })(_Checkbox);

export default component(
  memoize(),
  name('Todo')
)(function({ context }) {

  return (
    <div>
      <Checkbox /> {context.get('/title')}
    </div>
  );
});
