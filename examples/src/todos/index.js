import App from './components/App';
import { views, scopes, decorators, cycle } from './../vulp';

const initialValue = {
  todos: [
    { completed: true, title: 'foo' },
    { completed: false, title: 'bar' }
  ],
  draft: ''
};


const MountedApp = decorators.mount({
  todos:  '/state/todos',
  draft:  '/state/draft',
  filter: '/fragment/value'
})(App);

const view = views.dom(document.body, MountedApp);

const state = scopes.value(initialValue);
const fragment = scopes.fragment();

const rootSscope = scopes.combiner({ state, fragment });

export default () => cycle(view, rootSscope);
