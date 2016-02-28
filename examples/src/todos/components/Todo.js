import { h, decorators } from './../../fux';
import _Checkbox from './Checkbox';

const { memoize, component } = decorators;
const Checkbox = decorators.mount({ checked: '/completed' })(_Checkbox);

export default component(
  memoize()
)(({ context }) => (
  <div>
    <Checkbox />
    {context.get('/title')}
  </div>
));
