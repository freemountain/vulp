import { h, views, scopes, decorators, helper } from './../fux';

const { component, controller } = decorators;
const btnController = { inc: helper.patch('/count', v => v + 1) };

const App = component([
  controller(btnController)
])(({ context, dispatch }) => (
  <div>
    <input type='button' onClick={dispatch('inc')}/>
    {context.get('/count')}
  </div>
));


const view = views.dom(document.body, App);
const scope = scopes.value({ count: 0 });

export default () => helper.cycle(view, scope);
