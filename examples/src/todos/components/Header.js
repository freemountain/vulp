import { h, helper, decorators } from './../../fux';

const { $rep, $add } = helper;
const { controller, component } = decorators;
const throttledCall = helper.choke(100);

function key(e, model, dispatch) {
  // keyCode 27 => ESCAPE
  if(e.keyCode === 27) {
    dispatch([$rep('/draft', '')]);
    return;
  }

  // keyCode 13 => Enter
  if(e.keyCode === 13) {
    const title = e.target.value;

    e.target.value = '';
    dispatch([
      $add('/todos/-', { completed: false, title }),
      $rep('/draft', '')
    ]);
    return;
  }
  const f = () => dispatch([$rep('/draft', e.target.value)]);

  throttledCall(model.path, f);
}

export default component([
  controller({ key })
])(({ context, dispatch }) => (
  <div>
    <input
      onKeyUp = {dispatch('key')}
      value = {context.get('/draft')}
      type = 'text'
    />
  </div>
));
