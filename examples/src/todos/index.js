import App from './components/App';
import { createRenderSubject, scopes, decorators, helper } from './../fux';

const initialValue = {
  todos: [
    { completed: true, title: 'foo' },
    { completed: false, title: 'bar' }
  ],
  draft: ''
};

const mountedApp = decorators.mount({
  todos:  '/state/todos',
  draft:  '/state/draft',
  filter: '/fragment/value'
})(App);

const view = createRenderSubject(document.body)(mountedApp);

const state = scopes.value(initialValue);
const fragment = scopes.fragment();

const rootSscope = scopes.combiner({ state, fragment });

export default () => helper.cycle(view, rootSscope);
