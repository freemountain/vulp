import { element, cycle, decorators, fragments } from './../vulp';

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

const view = fragments.render(document.body, App);
const scope = fragments.value();

export default () => cycle(scope, view, { count: 0 });
