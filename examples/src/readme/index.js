import { h, views, scopes, decorators, helper } from './../fux';

const { component, controller, dispatchChangeSets } = decorators;
const App = component(
  dispatchChangeSets(),
  controller({
    inc: ['/count', count => count + 1]
  }),
)(function({ context }) {
  return (<div>
    <input type='button' onClick='inc'/>
    {context.get('/count')}
  </div>);
});

const view = views.dom(document.body, App);
const scope = scopes.value({ count: 0 });

export default () => helper.cycle(view, scope);
