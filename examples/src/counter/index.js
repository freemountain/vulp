import t from 'tcomb';
import { h, createRenderSubject, scopes, decorators, helper } from './../fux';

const { component, checkContextType, controller } = decorators;

const contextType = t.struct({
  count: t.Number
});

const inc = (_, { context }) => [helper.$rep('/count', context.get('/count') + 1)];

const IncBtn = component([
  checkContextType(contextType),
  controller({ inc })
])(({ dispatch }) => (
  <input type='button' onClick={dispatch('inc')}/>
));

const App = component([
  checkContextType(contextType)
])(({ context }) => (
  <div>
    <IncBtn />
    {context.get('/count')}
  </div>
));

const renderSubject = createRenderSubject(document.body, App);
const storeSubject = scopes.value({ count: 0 });

export default () => helper.cycle(renderSubject, storeSubject);
