import t from 'tcomb';
import { element, cycle, views, scopes, decorators } from './../fux';

const { component, checkContextType, controller, dispatchChangeSets } = decorators;

const contextType = t.struct({
  count: t.Number
});

const IncBtn = component(
  dispatchChangeSets(),
  controller({
    inc: ['/count', count => count + 1]
  })
)(() => (
  <input type='button' onClick='inc' />
));

const App = component(
  checkContextType(contextType)
)(({ context }) => (
  <div>
    <IncBtn />
    {context.get('/count')}
  </div>
));

const renderSubject = views.dom(document.body, App);
const storeSubject = scopes.value({ count: 0 });

export default () => cycle(renderSubject, storeSubject);
