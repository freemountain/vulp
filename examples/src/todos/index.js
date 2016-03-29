import { decorators, cycle, fragments } from './../vulp';

import App from './components/App';

const initialValue = {
  todos: [
    { completed: true, title: 'foo' },
    { completed: false, title: 'bar' }
  ],
  draft: ''
};


const MountedApp = decorators.lens({
  todos:  '/state/todos',
  draft:  '/state/draft',
  filter: '/hash'
})(App);

const view = fragments.render(document.body, MountedApp);

const state = fragments.value();
const hash = fragments.hash();

const rootScope = fragments.combiner({ state, hash });

export default () => cycle(rootScope, view, {
  state: initialValue,
  hash:  'all'
});
